// pages/terms.js - Terms of Service page
import Head from 'next/head'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - My Mortgage Hacker</title>
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
                <a href="/privacy" className="text-gray-700 hover:text-blue-600 font-medium">Privacy</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="prose prose-blue max-w-none space-y-6">
              <p className="text-gray-600 mb-8">
                <strong>Effective Date:</strong> January 1, 2024<br />
                <strong>Last Updated:</strong> January 1, 2024
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the My Mortgage Hacker website and services ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
                <p className="text-gray-700 mb-4">
                  My Mortgage Hacker provides an online mortgage pre-qualification tool that helps potential homebuyers assess their eligibility for various mortgage programs. Our service includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Mortgage qualification calculations based on provided information</li>
                  <li>Comparison of different loan programs (Conventional, FHA, VA, USDA, Jumbo)</li>
                  <li>Debt-to-income ratio analysis</li>
                  <li>Loan-to-value ratio calculations</li>
                  <li>Results export and email functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Important Disclaimers</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 font-semibold mb-2">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    IMPORTANT: This is NOT a commitment to lend
                  </p>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    <li>Pre-qualification results are preliminary estimates only</li>
                    <li>Final loan approval depends on complete application, documentation, and underwriting</li>
                    <li>Interest rates and terms are subject to change</li>
                    <li>Property appraisal and title verification required</li>
                    <li>Additional conditions may apply based on lender requirements</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
                <p className="text-gray-700 mb-4">By using our service, you agree to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Provide accurate and truthful information</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Not attempt to circumvent security measures</li>
                  <li>Respect intellectual property rights</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> to understand how we collect, use, and protect your personal information. By using our service, you consent to our data practices as described in the Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Accuracy of Information</h2>
                <p className="text-gray-700 mb-4">
                  While we strive to provide accurate calculations and current market information, we make no warranties about the completeness, reliability, or accuracy of this information. Mortgage rates, program requirements, and lending criteria change frequently and vary by lender.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  MyMortgageHackers LLC and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of the service, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Loan application rejections</li>
                  <li>Changes in interest rates or market conditions</li>
                  <li>Reliance on pre-qualification results</li>
                  <li>Technical errors or service interruptions</li>
                  <li>Third-party actions or omissions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Regulatory Compliance</h2>
                <p className="text-gray-700 mb-4">
                  MyMortgageHackers LLC is licensed as a mortgage broker in applicable states. We comply with:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Equal Credit Opportunity Act (ECOA)</li>
                  <li>Fair Housing Act</li>
                  <li>Truth in Lending Act (TILA)</li>
                  <li>Real Estate Settlement Procedures Act (RESPA)</li>
                  <li>Gramm-Leach-Bliley Act (Privacy regulations)</li>
                  <li>State licensing requirements</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  <strong>NMLS ID:</strong> #12345<br />
                  <strong>License Information:</strong> Licensed in all 50 states
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content, trademarks, and intellectual property on this website are owned by MyMortgageHackers LLC. You may not reproduce, distribute, or create derivative works without written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibent text-gray-900 mb-4">10. Third-Party Links</h2>
                <p className="text-gray-700 mb-4">
                  Our service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of these external sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Service Modifications</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify, suspend, or discontinue the service at any time without notice. We may also update these terms periodically, and your continued use constitutes acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
                <p className="text-gray-700 mb-4">
                  These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 mb-2">
                    <strong>MyMortgageHackers LLC</strong>
                  </p>
                  <p className="text-blue-700">
                    <i className="fas fa-envelope mr-2"></i>Email: legal@mymortgagehacker.com<br />
                    <i className="fas fa-phone mr-2"></i>Phone: (555) 123-4567<br />
                    <i className="fas fa-map-marker-alt mr-2"></i>Address: 123 Financial Plaza, Suite 100, Los Angeles, CA 90210
                  </p>
                </div>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  By using My Mortgage Hacker, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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