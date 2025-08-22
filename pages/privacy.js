// pages/privacy.js - Privacy Policy page
import Head from 'next/head'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - My Mortgage Hacker</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-blue-600">
                  <i className="fas fa-home mr-2"></i>
                  My Mortgage Hacker
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="/terms" className="text-gray-700 hover:text-blue-600 font-medium">Terms</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-blue max-w-none space-y-6">
              <p className="text-gray-600 mb-8">
                <strong>Effective Date:</strong> January 1, 2024<br />
                <strong>Last Updated:</strong> January 1, 2024
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  MyMortgageHackers LLC ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mortgage qualification service.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    <i className="fas fa-shield-alt mr-2"></i>
                    <strong>Your Privacy Matters:</strong> We use bank-level security and never sell your personal information to third parties.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                <p className="text-gray-700 mb-4">We collect information you provide directly to us, including:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address</li>
                  <li><strong>Financial Information:</strong> Income, employment details, credit score range, debt information, assets</li>
                  <li><strong>Property Information:</strong> Property value, address, type, intended use</li>
                  <li><strong>Identification Information:</strong> Date of birth, Social Security Number (last 4 digits stored)</li>
                  <li><strong>Application Data:</strong> Loan preferences, down payment amount, co-signer information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, referral sources</li>
                  <li><strong>Cookies:</strong> Session cookies for functionality, analytics cookies for improvement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Primary Services</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Calculate mortgage qualification and loan program eligibility</li>
                  <li>Provide personalized interest rates and payment estimates</li>
                  <li>Generate qualification reports and export functionality</li>
                  <li>Send results via email as requested</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Communication</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send service-related notifications and updates</li>
                  <li>Provide educational content about mortgage processes (with consent)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal and Compliance</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Maintain audit trails for compliance purposes</li>
                  <li>Prevent fraud and ensure service security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold">
                    <i className="fas fa-check-circle mr-2"></i>
                    We DO NOT sell your personal information to third parties.
                  </p>
                </div>

                <p className="text-gray-700 mb-4">We may share your information in the following limited circumstances:</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">With Your Consent</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Approved mortgage lenders and brokers (only when you request connection)</li>
                  <li>Real estate professionals (only with explicit permission)</li>
                  <li>Financial advisors or consultants (only when you authorize)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Providers</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Technology vendors (hosting, analytics, security services)</li>
                  <li>Email service providers (for sending results and communications)</li>
                  <li>Customer support tools and platforms</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Law enforcement when required by law or court order</li>
                  <li>Regulatory agencies for compliance audits</li>
                  <li>Legal proceedings involving our company</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 mb-4">We implement comprehensive security measures to protect your information:</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Safeguards</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Encryption:</strong> SSL/TLS encryption for data transmission</li>
                  <li><strong>Database Security:</strong> Encrypted storage and access controls</li>
                  <li><strong>Authentication:</strong> Multi-factor authentication for admin access</li>
                  <li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Administrative Safeguards</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Employee background checks and confidentiality agreements</li>
                  <li>Regular security training and awareness programs</li>
                  <li>Incident response and breach notification procedures</li>
                  <li>Regular security audits and vulnerability assessments</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Physical Safeguards</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Secure data centers with restricted access</li>
                  <li>Environmental controls and backup systems</li>
                  <li>Secure disposal of physical and electronic media</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Privacy Rights</h2>
                <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Access and Portability</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Request a copy of your personal information</li>
                  <li>Download your qualification results and data</li>
                  <li>Verify the accuracy of your information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Correction and Updates</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Update your contact information</li>
                  <li>Correct inaccurate personal data</li>
                  <li>Complete incomplete information</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Deletion and Restriction</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Request deletion of your personal information (subject to legal requirements)</li>
                  <li>Restrict processing of your data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-700 mb-4">We retain your information for the following periods:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Application Data:</strong> 7 years for regulatory compliance</li>
                  <li><strong>Communication Records:</strong> 3 years for customer service</li>
                  <li><strong>Technical Logs:</strong> 1 year for security and analytics</li>
                  <li><strong>Marketing Data:</strong> Until you opt out or withdraw consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">We use cookies and similar technologies for:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Essential Cookies:</strong> Required for service functionality</li>
                  <li><strong>Analytics Cookies:</strong> Understanding usage patterns (anonymized)</li>
                  <li><strong>Preference Cookies:</strong> Remembering your settings</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  You can control cookies through your browser settings, but disabling essential cookies may limit functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
                <p className="text-gray-700 mb-4">Our service integrates with third-party providers:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Analytics:</strong> Google Analytics (anonymized data)</li>
                  <li><strong>Email:</strong> Secure email service providers</li>
                  <li><strong>Hosting:</strong> Cloud infrastructure providers</li>
                  <li><strong>Security:</strong> Fraud prevention and monitoring services</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  These providers have their own privacy policies and security measures.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. State-Specific Rights</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">California Residents (CCPA)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of sale (we don't sell personal information)</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">European Residents (GDPR)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Right to access and data portability</li>
                  <li>Right to rectification and erasure</li>
                  <li>Right to restrict processing</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we discover we have collected such information, we will delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Policy Updates</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by email or through our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 mb-2">
                    <strong>Privacy Officer</strong><br />
                    MyMortgageHackers LLC
                  </p>
                  <p className="text-blue-700">
                    <i className="fas fa-envelope mr-2"></i>Email: privacy@mymortgagehacker.com<br />
                    <i className="fas fa-phone mr-2"></i>Phone: (555) 123-4567<br />
                    <i className="fas fa-map-marker-alt mr-2"></i>Address: 123 Financial Plaza, Suite 100, Los Angeles, CA 90210
                  </p>
                </div>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  By using My Mortgage Hacker, you acknowledge that you have read and understood this Privacy Policy and consent to our data practices as described herein.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 MyMortgageHackers LLC. All rights reserved. NMLS #12345</p>
          </div>
        </footer>
      </div>
    </>
  )
}