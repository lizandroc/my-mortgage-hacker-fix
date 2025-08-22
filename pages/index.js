// pages/index.js - Main landing page
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRates()
  }, [])

  const fetchRates = async () => {
    try {
      const response = await fetch('/api/rates')
      const data = await response.json()
      if (data.success) {
        setRates(data.rates)
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>My Mortgage Hacker - Personalized Mortgage Qualifier</title>
        <meta name="description" content="Get qualified for your dream home in minutes. Professional mortgage qualification with real-time calculations and expert guidance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">
                  <i className="fas fa-home mr-2"></i>
                  My Mortgage Hacker
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#qualify" className="text-gray-700 hover:text-blue-600 font-medium">Get Qualified</a>
                <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</a>
                <button 
                  onClick={() => document.getElementById('qualify').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-bold mb-6">
              Get Qualified for Your Dream Home
              <span className="block text-blue-200 text-3xl mt-2">in Minutes, Not Days</span>
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Professional mortgage qualification with real-time calculations, multiple loan programs, 
              and instant results. Start your homebuying journey today.
            </p>
            <button 
              onClick={() => document.getElementById('qualify').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <i className="fas fa-calculator mr-2"></i>
              Check My Qualification
            </button>
          </div>
        </section>

        {/* Current Rates Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                <i className="fas fa-chart-line mr-2 text-green-600"></i>
                Today's Mortgage Rates
              </h3>
              <p className="text-gray-600">Current rates updated daily</p>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading current rates...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rates && Object.entries(rates).map(([program, programRates]) => (
                  <div key={program} className="bg-gray-50 rounded-lg p-6 text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                      {program === 'fha' ? 'FHA' : 
                       program === 'va' ? 'VA' : 
                       program === 'usda' ? 'USDA' : 
                       program.charAt(0).toUpperCase() + program.slice(1)}
                    </h4>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {programRates.excellent || programRates.good || '-.---'}%
                    </div>
                    <p className="text-sm text-gray-500">
                      {programRates.excellent ? 'Excellent Credit (740+)' : 'Starting Rate'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose My Mortgage Hacker?</h3>
              <p className="text-gray-600">Professional qualification process designed for homebuyers</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightning-bolt text-2xl text-blue-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
                <p className="text-gray-600">Get qualified in under 5 minutes with our streamlined process</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-2xl text-green-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
                <p className="text-gray-600">Bank-level security with encrypted data transmission</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-2xl text-purple-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">Expert Support</h4>
                <p className="text-gray-600">Professional mortgage consultants available to help</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calculator text-2xl text-orange-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">Real-Time Calculations</h4>
                <p className="text-gray-600">Accurate DTI and LTV calculations for multiple loan programs</p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-export text-2xl text-red-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">Export Results</h4>
                <p className="text-gray-600">Download PDF or email your qualification results</p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-mobile-alt text-2xl text-indigo-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">Mobile Optimized</h4>
                <p className="text-gray-600">Works perfectly on all devices and screen sizes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Qualification Form Section */}
        <section id="qualify" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                <i className="fas fa-clipboard-check mr-2 text-blue-600"></i>
                Start Your Qualification
              </h3>
              <p className="text-gray-600">Complete the form below to get your personalized mortgage qualification</p>
            </div>

            {/* Qualification Form Container */}
            <div id="qualification-form" className="bg-white rounded-lg shadow-lg p-8">
              {/* Form will be loaded by qualification.js */}
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading qualification form...</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  <i className="fas fa-home mr-2"></i>
                  My Mortgage Hacker
                </h4>
                <p className="text-gray-400">
                  Professional mortgage qualification platform helping homebuyers achieve their dreams.
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold mb-3">Services</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Mortgage Qualification</a></li>
                  <li><a href="#" className="hover:text-white">Rate Comparison</a></li>
                  <li><a href="#" className="hover:text-white">Expert Consultation</a></li>
                  <li><a href="#" className="hover:text-white">First-Time Buyer Programs</a></li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold mb-3">Support</h5>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>  
                  <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold mb-3">Contact</h5>
                <div className="text-gray-400 space-y-2">
                  <p><i className="fas fa-phone mr-2"></i>(555) 123-4567</p>
                  <p><i className="fas fa-envelope mr-2"></i>info@mymortgagehacker.com</p>
                  <p><i className="fas fa-map-marker-alt mr-2"></i>Licensed in all 50 states</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 MyMortgageHackers LLC. All rights reserved. NMLS #12345</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Load qualification form script */}
      <script src="/static/qualification.js"></script>
    </>
  )
}