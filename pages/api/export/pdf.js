// pages/api/export/pdf.js - Generate PDF export of qualification results
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { applicationId, email } = req.body

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID required' })
    }

    // Fetch application data
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (error || !application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Generate PDF content (HTML format for now, can be enhanced with PDF library)
    const pdfContent = generatePDFContent(application)

    // Log export event
    await supabase.from('application_exports').insert({
      application_id: applicationId,
      export_type: 'pdf',
      exported_by: email || application.personal_info?.email,
      exported_at: new Date().toISOString()
    })

    // Log compliance event
    await supabase.from('compliance_logs').insert({
      event_type: 'application_exported',
      user_identifier: email || application.personal_info?.email,
      event_data: {
        applicationId,
        exportType: 'pdf'
      },
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    // Return PDF content (in production, you'd generate actual PDF)
    res.status(200).json({
      success: true,
      content: pdfContent,
      filename: `mortgage-qualification-${applicationId}.pdf`,
      message: 'PDF generated successfully'
    })

  } catch (error) {
    console.error('PDF export error:', error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
}

function generatePDFContent(application) {
  const personal = application.personal_info || {}
  const employment = application.employment || {}
  const financial = application.financial || {}
  const property = application.property || {}
  const qualification = application.qualification_results || {}

  return `
<!DOCTYPE html>
<html>
<head>
    <title>Mortgage Qualification Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #2563eb; border-bottom: 2px solid #2563eb; }
        .qualified { color: #059669; font-weight: bold; }
        .not-qualified { color: #dc2626; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>My Mortgage Hacker</h1>
        <h2>Mortgage Qualification Report</h2>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h3>Personal Information</h3>
        <table>
            <tr><td><strong>Name:</strong></td><td>${personal.firstName} ${personal.lastName}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${personal.email}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${personal.phone}</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Financial Summary</h3>
        <table>
            <tr><td><strong>Monthly Income:</strong></td><td>$${employment.monthlyIncome?.toLocaleString()}</td></tr>
            <tr><td><strong>Monthly Debts:</strong></td><td>$${financial.monthlyDebts?.toLocaleString()}</td></tr>
            <tr><td><strong>Credit Score:</strong></td><td>${financial.creditScore}</td></tr>
            <tr><td><strong>Down Payment:</strong></td><td>$${financial.downPayment?.toLocaleString()}</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Property Information</h3>
        <table>
            <tr><td><strong>Property Value:</strong></td><td>$${property.propertyValue?.toLocaleString()}</td></tr>
            <tr><td><strong>Address:</strong></td><td>${property.address}, ${property.city}, ${property.state} ${property.zipCode}</td></tr>
            <tr><td><strong>Property Type:</strong></td><td>${property.propertyType}</td></tr>
        </table>
    </div>

    <div class="section">
        <h3>Qualification Results</h3>
        <p class="${qualification.qualified ? 'qualified' : 'not-qualified'}">
            Status: ${qualification.qualified ? 'QUALIFIED' : 'NOT QUALIFIED'}
        </p>
        
        ${qualification.qualified ? `
            <h4>Approved Programs:</h4>
            <table>
                <tr>
                    <th>Program</th>
                    <th>Interest Rate</th>
                    <th>Monthly Payment</th>
                    <th>Total Monthly Payment</th>
                </tr>
                ${qualification.programs?.map(program => `
                    <tr>
                        <td>${program.displayName}</td>
                        <td>${program.rate}%</td>
                        <td>$${program.monthlyPayment?.toLocaleString()}</td>
                        <td>$${program.totalMonthlyPayment?.toLocaleString()}</td>
                    </tr>
                `).join('') || ''}
            </table>
        ` : `
            <h4>Reasons for Decline:</h4>
            <ul>
                ${qualification.reasons?.map(reason => `<li>${reason}</li>`).join('') || ''}
            </ul>
        `}
    </div>

    <div class="section">
        <h3>Important Disclaimers</h3>
        <p><small>
            This qualification is preliminary and based on the information provided. Final loan approval 
            is subject to verification of all information, property appraisal, and lender underwriting guidelines. 
            Interest rates are subject to change and may vary based on final loan terms and market conditions.
            This is not a commitment to lend.
        </small></p>
    </div>
</body>
</html>
  `.trim()
}