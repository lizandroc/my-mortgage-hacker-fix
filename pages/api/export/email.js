// pages/api/export/email.js - Email qualification results
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
    const { applicationId, email, recipientEmail } = req.body

    if (!applicationId || !email) {
      return res.status(400).json({ error: 'Application ID and email required' })
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

    // Generate email content
    const emailContent = generateEmailContent(application, recipientEmail || email)

    // In production, you would send the actual email here using a service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // 
    // For now, we'll simulate the email sending
    const emailResult = await simulateEmailSending(emailContent, recipientEmail || email)

    // Log export event
    await supabase.from('application_exports').insert({
      application_id: applicationId,
      export_type: 'email',
      exported_by: email,
      recipient_email: recipientEmail || email,
      exported_at: new Date().toISOString()
    })

    // Log compliance event
    await supabase.from('compliance_logs').insert({
      event_type: 'application_emailed',
      user_identifier: email,
      event_data: {
        applicationId,
        recipientEmail: recipientEmail || email
      },
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    res.status(200).json({
      success: true,
      message: `Qualification results sent to ${recipientEmail || email}`,
      emailSent: emailResult.success
    })

  } catch (error) {
    console.error('Email export error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
}

function generateEmailContent(application, recipientEmail) {
  const personal = application.personal_info || {}
  const qualification = application.qualification_results || {}

  const subject = `Your Mortgage Qualification Results - ${qualification.qualified ? 'Approved' : 'Review Required'}`

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .qualified { color: #059669; font-weight: bold; font-size: 18px; }
        .not-qualified { color: #dc2626; font-weight: bold; font-size: 18px; }
        .program { background: white; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .footer { padding: 20px; font-size: 12px; color: #6b7280; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>My Mortgage Hacker</h1>
            <h2>Your Qualification Results</h2>
        </div>
        
        <div class="content">
            <p>Dear ${personal.firstName} ${personal.lastName},</p>
            
            <p>Thank you for using My Mortgage Hacker to check your mortgage qualification. Here are your results:</p>
            
            <div class="${qualification.qualified ? 'qualified' : 'not-qualified'}">
                Status: ${qualification.qualified ? 'CONGRATULATIONS! You are QUALIFIED' : 'Additional Review Required'}
            </div>
            
            ${qualification.qualified ? `
                <h3>Your Approved Programs:</h3>
                ${qualification.programs?.map(program => `
                    <div class="program">
                        <strong>${program.displayName}</strong><br>
                        Interest Rate: ${program.rate}%<br>
                        Monthly Payment: $${program.monthlyPayment?.toLocaleString()}<br>
                        Total Monthly Payment: $${program.totalMonthlyPayment?.toLocaleString()}
                    </div>
                `).join('') || ''}
                
                <h3>Next Steps:</h3>
                <ol>
                    <li>Contact one of our approved lenders to begin the formal application process</li>
                    <li>Gather required documentation (pay stubs, tax returns, bank statements)</li>
                    <li>Schedule a property appraisal once you find your home</li>
                    <li>Review and sign your loan documents</li>
                </ol>
            ` : `
                <h3>Areas for Improvement:</h3>
                <ul>
                    ${qualification.reasons?.map(reason => `<li>${reason}</li>`).join('') || ''}
                </ul>
                
                <h3>Recommended Next Steps:</h3>
                <ol>
                    <li>Work on improving your credit score</li>
                    <li>Consider increasing your down payment</li>
                    <li>Pay down existing debts to improve your debt-to-income ratio</li>
                    <li>Speak with one of our mortgage consultants for personalized advice</li>
                </ol>
            `}
            
            <p>
                <a href="https://mymortgagehacker.com/contact" class="button">Speak with a Mortgage Expert</a>
            </p>
            
            <p>If you have any questions about your results, please don't hesitate to contact us at <strong>(555) 123-4567</strong> or reply to this email.</p>
        </div>
        
        <div class="footer">
            <p><strong>Important Disclaimers:</strong></p>
            <p>This qualification is preliminary and based on the information provided. Final loan approval is subject to verification of all information, property appraisal, and lender underwriting guidelines. Interest rates are subject to change and may vary based on final loan terms and market conditions. This is not a commitment to lend.</p>
            
            <p>MyMortgageHackers LLC | (555) 123-4567 | support@mymortgagehacker.com</p>
            <p>Licensed Mortgage Broker | NMLS #12345</p>
        </div>
    </div>
</body>
</html>
  `

  return {
    to: recipientEmail,
    subject,
    html: htmlContent,
    text: convertHtmlToText(htmlContent)
  }
}

function convertHtmlToText(html) {
  // Simple HTML to text conversion
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function simulateEmailSending(emailContent, recipientEmail) {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In production, replace this with actual email service integration:
  /*
  // Example with SendGrid:
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  const msg = {
    to: emailContent.to,
    from: 'noreply@mymortgagehacker.com',
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  }
  
  try {
    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error.message }
  }
  */
  
  // For development/demo, always return success
  console.log(`Email would be sent to: ${recipientEmail}`)
  console.log(`Subject: ${emailContent.subject}`)
  
  return { success: true }
}