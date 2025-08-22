import { createSupabaseClient } from '../../lib/supabase';

// Simple HTML to PDF conversion (in production, consider using puppeteer or similar)
function generatePDFContent(applicationData, qualificationResults) {
  const {
    first_name,
    last_name,
    email,
    phone,
    income_monthly,
    debt_monthly,
    credit_score,
    employment_type,
    down_payment,
    loan_program,
    property_address,
    property_city,
    property_state,
    property_zip,
    property_value
  } = applicationData;

  const {
    qualification_status,
    front_end_dti,
    back_end_dti,
    ltv_ratio,
    estimated_monthly_payment,
    estimated_interest_rate,
    recommendations
  } = qualificationResults;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mortgage Qualification Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 28px; font-weight: bold; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #1f2937; }
        .status { padding: 8px 16px; border-radius: 4px; font-weight: bold; text-align: center; }
        .approved { background-color: #d1fae5; color: #065f46; }
        .needs-review { background-color: #fef3c7; color: #92400e; }
        .recommendations { background-color: #f3f4f6; padding: 15px; border-radius: 6px; }
        .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏠 My Mortgage Hacker</div>
        <p>Personalized Mortgage Qualification Report</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h3>Personal Information</h3>
        <div class="grid">
            <div>
                <div class="field">
                    <span class="label">Name:</span>
                    <span class="value">${first_name} ${last_name}</span>
                </div>
                <div class="field">
                    <span class="label">Email:</span>
                    <span class="value">${email}</span>
                </div>
                <div class="field">
                    <span class="label">Phone:</span>
                    <span class="value">${phone}</span>
                </div>
            </div>
            <div>
                <div class="field">
                    <span class="label">Credit Score:</span>
                    <span class="value">${credit_score}</span>
                </div>
                <div class="field">
                    <span class="label">Employment Type:</span>
                    <span class="value">${employment_type}</span>
                </div>
                <div class="field">
                    <span class="label">Monthly Income:</span>
                    <span class="value">$${parseInt(income_monthly).toLocaleString()}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>Property Information</h3>
        <div class="field">
            <span class="label">Address:</span>
            <span class="value">${property_address || 'Not specified'}</span>
        </div>
        <div class="field">
            <span class="label">City, State, ZIP:</span>
            <span class="value">${property_city || ''} ${property_state || ''} ${property_zip || ''}</span>
        </div>
        <div class="grid">
            <div class="field">
                <span class="label">Property Value:</span>
                <span class="value">$${parseInt(property_value || 0).toLocaleString()}</span>
            </div>
            <div class="field">
                <span class="label">Down Payment:</span>
                <span class="value">$${parseInt(down_payment || 0).toLocaleString()}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>Qualification Results</h3>
        <div class="status ${qualification_status === 'approved' ? 'approved' : 'needs-review'}">
            Status: ${qualification_status === 'approved' ? 'APPROVED' : 'NEEDS REVIEW'}
        </div>
        <br>
        <div class="grid">
            <div>
                <div class="field">
                    <span class="label">Front-End DTI:</span>
                    <span class="value">${front_end_dti}%</span>
                </div>
                <div class="field">
                    <span class="label">Back-End DTI:</span>
                    <span class="value">${back_end_dti}%</span>
                </div>
                <div class="field">
                    <span class="label">LTV Ratio:</span>
                    <span class="value">${ltv_ratio}%</span>
                </div>
            </div>
            <div>
                <div class="field">
                    <span class="label">Loan Program:</span>
                    <span class="value">${loan_program.toUpperCase()}</span>
                </div>
                <div class="field">
                    <span class="label">Estimated Rate:</span>
                    <span class="value">${estimated_interest_rate}%</span>
                </div>
                <div class="field">
                    <span class="label">Monthly Payment:</span>
                    <span class="value">$${parseInt(estimated_monthly_payment || 0).toLocaleString()}</span>
                </div>
            </div>
        </div>
    </div>

    ${recommendations && recommendations.length > 0 ? `
    <div class="section">
        <h3>Recommendations</h3>
        <div class="recommendations">
            ${recommendations.map(rec => `<p>• ${rec}</p>`).join('')}
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <p><strong>My Mortgage Hacker</strong> - Professional Mortgage Qualification Service</p>
        <p>This report is for informational purposes only. Final loan approval subject to lender review.</p>
        <p>Contact us: support@mymortgagehacker.com | (555) 123-4567</p>
    </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { application_id, export_type = 'pdf', email_to } = req.body;

    if (!application_id) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const supabase = createSupabaseClient();

    // Get application data
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        properties (*),
        users (*)
      `)
      .eq('id', application_id)
      .single();

    if (appError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Prepare qualification results
    const qualificationResults = {
      qualification_status: application.qualification_status,
      front_end_dti: application.front_end_dti,
      back_end_dti: application.back_end_dti,
      ltv_ratio: application.ltv_ratio,
      estimated_monthly_payment: application.estimated_monthly_payment,
      estimated_interest_rate: application.estimated_interest_rate,
      recommendations: [
        application.qualification_status === 'approved' ? 
          'Your application looks great!' : 
          'Consider improving your credit score or reducing monthly debts'
      ]
    };

    // Combine user and application data
    const applicationData = {
      ...application.users,
      ...application,
      ...(application.properties?.[0] || {})
    };

    if (export_type === 'pdf') {
      const htmlContent = generatePDFContent(applicationData, qualificationResults);
      
      // In production, convert HTML to PDF using puppeteer or similar
      // For now, return HTML content with PDF headers
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="mortgage-qualification-${application_id}.html"`);
      
      // Log the export
      await supabase
        .from('application_exports')
        .insert({
          application_id,
          export_type: 'html',
          exported_by: applicationData.email,
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

      return res.status(200).send(htmlContent);
    }

    if (export_type === 'email' && email_to) {
      // In production, integrate with email service (SendGrid, etc.)
      // For now, simulate email sending
      
      const emailContent = `
Dear ${applicationData.first_name},

Your mortgage qualification report is ready!

Qualification Status: ${application.qualification_status.toUpperCase()}
Estimated Monthly Payment: $${parseInt(application.estimated_monthly_payment || 0).toLocaleString()}
Estimated Interest Rate: ${application.estimated_interest_rate}%

Best regards,
My Mortgage Hacker Team
      `;

      // Log the export
      await supabase
        .from('application_exports')
        .insert({
          application_id,
          export_type: 'email',
          exported_by: applicationData.email,
          recipient_email: email_to,
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        // In development, return email content for testing
        email_content: process.env.NODE_ENV === 'development' ? emailContent : undefined
      });
    }

    return res.status(400).json({ error: 'Invalid export type' });

  } catch (error) {
    console.error('Export API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
}