// pages/admin.js - Admin dashboard page
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = () => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      // Verify token is still valid
      fetch('/api/admin/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('adminToken')
          setIsAuthenticated(false)
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken')
        setIsAuthenticated(false)
      })
      .finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.user))
        onLogin()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login - My Mortgage Hacker</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              <i className="fas fa-home mr-2"></i>
              My Mortgage Hacker
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-gray-600">Access the administration panel</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-sign-in-alt mr-2"></i>
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>Default admin credentials:</p>
              <p className="font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                Username: admin | Password: admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('adminUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    onLogout()
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - My Mortgage Hacker</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Admin Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.username || 'Admin'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 font-medium"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'tachometer-alt' },
                { id: 'applications', label: 'Applications', icon: 'file-alt' },
                { id: 'statistics', label: 'Statistics', icon: 'chart-bar' },
                { id: 'settings', label: 'Settings', icon: 'cog' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  <i className={`fas fa-${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div id="admin-content">
            {activeTab === 'dashboard' && <div id="dashboard-content">Loading dashboard...</div>}
            {activeTab === 'applications' && <div id="applications-content">Loading applications...</div>}
            {activeTab === 'statistics' && <div id="statistics-content">Loading statistics...</div>}
            {activeTab === 'settings' && <div id="settings-content">Loading settings...</div>}
          </div>
        </div>
      </div>

      {/* Load admin dashboard scripts */}
      <script src="/static/admin-dashboard.js"></script>
    </>
  )
}