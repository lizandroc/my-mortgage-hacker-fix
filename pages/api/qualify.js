// pages/api/qualify.js - Main qualification endpoint
import { createClient } from '@supabase/supabase-js'
import { InputValidator, LOAN_PROGRAMS, CREDIT_TIERS, STATE_DATA } from '../../lib/validation'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = req.body
    
    // Validate input data
    const validator = new InputValidator()
    const validationResult = validator.validateQualificationData(data)
    
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.errors 
      })
    }

    // Calculate qualification
    const qualification = calculateQualification(data)
    
    // Save to database
    const { data: savedData, error } = await supabase
      .from('applications')
      .insert({
        user_id: data.userId || null,
        personal_info: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          ssn: data.ssn?.slice(-4) // Only store last 4 digits
        },
        employment: {
          employmentStatus: data.employmentStatus,
          employer: data.employer,
          jobTitle: data.jobTitle,
          monthlyIncome: parseFloat(data.monthlyIncome),
          employmentYears: parseInt(data.employmentYears),
          additionalIncome: parseFloat(data.additionalIncome) || 0
        },
        financial: {
          creditScore: parseInt(data.creditScore),
          monthlyDebts: parseFloat(data.monthlyDebts),
          assets: parseFloat(data.assets),
          downPayment: parseFloat(data.downPayment),
          hasCoSigner: data.hasCoSigner === 'true'
        },
        property: {
          propertyType: data.propertyType,
          propertyValue: parseFloat(data.propertyValue),
          address: data.propertyAddress,
          city: data.propertyCity,
          state: data.propertyState,
          zipCode: data.propertyZip,
          isFirstTimeHomeBuyer: data.firstTimeHomeBuyer === 'true'
        },
        qualification_results: qualification,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to save application' })
    }

    // Log compliance event
    await supabase.from('compliance_logs').insert({
      event_type: 'qualification_submitted',
      user_identifier: data.email,
      event_data: {
        applicationId: savedData.id,
        qualification: qualification.qualified,
        programs: qualification.programs?.map(p => p.name) || []
      },
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    res.status(200).json({
      success: true,
      applicationId: savedData.id,
      qualification: qualification
    })

  } catch (error) {
    console.error('Qualification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

function calculateQualification(data) {
  const monthlyIncome = parseFloat(data.monthlyIncome) + (parseFloat(data.additionalIncome) || 0)
  const monthlyDebts = parseFloat(data.monthlyDebts)
  const creditScore = parseInt(data.creditScore)
  const downPayment = parseFloat(data.downPayment)
  const propertyValue = parseFloat(data.propertyValue)
  const state = data.propertyState

  // Get state-specific costs
  const stateData = STATE_DATA[state] || STATE_DATA['CA'] // Default to CA
  const propertyTax = (propertyValue * stateData.propertyTaxRate) / 12
  const homeInsurance = (propertyValue * stateData.homeInsuranceRate) / 12

  // Calculate loan amount and LTV
  const loanAmount = propertyValue - downPayment
  const ltv = (loanAmount / propertyValue) * 100

  // Determine credit tier
  let creditTier = 'Poor'
  if (creditScore >= 740) creditTier = 'Excellent'
  else if (creditScore >= 680) creditTier = 'Good'
  else if (creditScore >= 620) creditTier = 'Fair'

  const results = {
    qualified: false,
    programs: [],
    calculations: {
      monthlyIncome,
      monthlyDebts,
      loanAmount,
      ltv: Math.round(ltv * 100) / 100,
      creditTier,
      propertyTax: Math.round(propertyTax),
      homeInsurance: Math.round(homeInsurance)
    },
    reasons: []
  }

  // Check each loan program
  for (const [programName, program] of Object.entries(LOAN_PROGRAMS)) {
    const programResult = checkProgramEligibility(
      data, 
      program, 
      monthlyIncome, 
      monthlyDebts, 
      ltv, 
      creditScore,
      propertyTax,
      homeInsurance
    )

    if (programResult.eligible) {
      results.qualified = true
      results.programs.push({
        name: programName,
        displayName: program.displayName,
        rate: CREDIT_TIERS[creditTier][programName.toLowerCase()] || program.baseRate,
        monthlyPayment: programResult.monthlyPayment,
        totalMonthlyPayment: programResult.totalMonthlyPayment,
        frontEndDTI: programResult.frontEndDTI,
        backEndDTI: programResult.backEndDTI,
        requiresPMI: programResult.requiresPMI,
        pmiAmount: programResult.pmiAmount || 0
      })
    }
  }

  // Add reasons if not qualified for any program
  if (!results.qualified) {
    if (creditScore < 580) {
      results.reasons.push('Credit score too low (minimum 580 required)')
    }
    if (ltv > 100) {
      results.reasons.push('Down payment too low for available programs')
    }
    
    // Check DTI for conventional program as baseline
    const housingPayment = calculateHousingPayment(loanAmount, 6.5, propertyTax, homeInsurance, ltv > 80)
    const frontEndDTI = (housingPayment / monthlyIncome) * 100
    const backEndDTI = ((housingPayment + monthlyDebts) / monthlyIncome) * 100
    
    if (frontEndDTI > 36) {
      results.reasons.push(`Front-end DTI too high: ${Math.round(frontEndDTI)}% (max 36%)`)
    }
    if (backEndDTI > 43) {
      results.reasons.push(`Back-end DTI too high: ${Math.round(backEndDTI)}% (max 43%)`)
    }
  }

  return results
}

function checkProgramEligibility(data, program, monthlyIncome, monthlyDebts, ltv, creditScore, propertyTax, homeInsurance) {
  // Check basic eligibility
  if (creditScore < program.minCreditScore) {
    return { eligible: false, reason: 'Credit score too low' }
  }

  if (ltv > program.maxLTV) {
    return { eligible: false, reason: 'LTV too high' }
  }

  // Calculate housing payment
  const loanAmount = parseFloat(data.propertyValue) - parseFloat(data.downPayment)
  const rate = program.baseRate // Use base rate for eligibility check
  const requiresPMI = ltv > 80 && program.name !== 'VA' && program.name !== 'USDA'
  const pmiAmount = requiresPMI ? (loanAmount * 0.005) / 12 : 0

  const monthlyPayment = calculateMonthlyPayment(loanAmount, rate)
  const totalMonthlyPayment = monthlyPayment + propertyTax + homeInsurance + pmiAmount

  // Calculate DTI ratios
  const frontEndDTI = (totalMonthlyPayment / monthlyIncome) * 100
  const backEndDTI = ((totalMonthlyPayment + monthlyDebts) / monthlyIncome) * 100

  // Check DTI limits
  if (frontEndDTI > program.maxFrontEndDTI) {
    return { eligible: false, reason: 'Front-end DTI too high' }
  }

  if (backEndDTI > program.maxBackEndDTI) {
    return { eligible: false, reason: 'Back-end DTI too high' }
  }

  // Special program checks
  if (program.name === 'FHA' && parseFloat(data.downPayment) < parseFloat(data.propertyValue) * 0.035) {
    return { eligible: false, reason: 'Minimum 3.5% down payment required for FHA' }
  }

  return {
    eligible: true,
    monthlyPayment: Math.round(monthlyPayment),
    totalMonthlyPayment: Math.round(totalMonthlyPayment),
    frontEndDTI: Math.round(frontEndDTI * 100) / 100,
    backEndDTI: Math.round(backEndDTI * 100) / 100,
    requiresPMI,
    pmiAmount: Math.round(pmiAmount)
  }
}

function calculateMonthlyPayment(loanAmount, annualRate) {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = 30 * 12 // 30 year loan
  
  if (monthlyRate === 0) return loanAmount / numPayments
  
  return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1)
}

function calculateHousingPayment(loanAmount, rate, propertyTax, homeInsurance, requiresPMI) {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, rate)
  const pmiAmount = requiresPMI ? (loanAmount * 0.005) / 12 : 0
  return monthlyPayment + propertyTax + homeInsurance + pmiAmount
}