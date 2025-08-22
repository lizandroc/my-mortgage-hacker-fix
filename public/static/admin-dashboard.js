// public/static/admin-dashboard.js - Admin dashboard functionality

class AdminDashboard {
  constructor() {
    this.token = localStorage.getItem('adminToken')
    this.currentPage = 1
    this.applicationsPerPage = 20
    this.statistics = null
    this.applications = []
    
    this.init()
  }

  init() {
    this.loadDashboard()
    this.attachEventListeners()
  }

  attachEventListeners() {
    // Tab switching is handled by the React component
    // We'll listen for custom events or check the active tab periodically
    this.checkActiveTab()
  }

  checkActiveTab() {
    setInterval(() => {
      const dashboardContent = document.getElementById('dashboard-content')
      const applicationsContent = document.getElementById('applications-content')
      const statisticsContent = document.getElementById('statistics-content')
      const settingsContent = document.getElementById('settings-content')

      if (dashboardContent && dashboardContent.textContent.includes('Loading dashboard...')) {
        this.loadDashboard()
      } else if (applicationsContent && applicationsContent.textContent.includes('Loading applications...')) {
        this.loadApplications()
      } else if (statisticsContent && statisticsContent.textContent.includes('Loading statistics...')) {
        this.loadStatistics()
      } else if (settingsContent && settingsContent.textContent.includes('Loading settings...')) {
        this.loadSettings()
      }
    }, 1000)
  }

  async loadDashboard() {
    try {
      const [statsResponse, appsResponse] = await Promise.all([
        this.apiCall('/api/admin/statistics'),
        this.apiCall('/api/admin/applications?limit=5')
      ])

      if (statsResponse.success && appsResponse.success) {
        this.statistics = statsResponse.statistics
        this.renderDashboard(statsResponse.statistics, appsResponse.applications)
      }
    } catch (error) {
      console.error('Dashboard load error:', error)
      this.showError('Failed to load dashboard')
    }
  }

  renderDashboard(stats, recentApps) {
    const content = document.getElementById('dashboard-content')
    if (!content) return

    content.innerHTML = `
      <div class="space-y-8">
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-full">
                <i class="fas fa-file-alt text-blue-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Applications</p>
                <p class="text-2xl font-bold text-gray-900">${stats.totals.applications}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-full">
                <i class="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Qualified</p>
                <p class="text-2xl font-bold text-gray-900">${stats.totals.qualified}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-full">
                <i class="fas fa-percentage text-purple-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Qualification Rate</p>
                <p class="text-2xl font-bold text-gray-900">${stats.totals.qualificationRate}%</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-full">
                <i class="fas fa-calendar-week text-orange-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">This Week</p>
                <p class="text-2xl font-bold text-gray-900">${stats.periods.thisWeek.applications}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Applications Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Applications Over Time</h3>
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div class="text-center text-gray-500">
                <i class="fas fa-chart-line text-3xl mb-2"></i>
                <p>Chart visualization would go here</p>
                <p class="text-sm">Total: ${stats.totals.applications} applications</p>
              </div>
            </div>
          </div>

          <!-- Program Distribution -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Loan Program Distribution</h3>
            <div class="space-y-3">
              ${Object.entries(stats.programs).map(([program, count]) => `
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">${program}</span>
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div class="bg-blue-600 h-2 rounded-full" style="width: ${(count / Math.max(...Object.values(stats.programs))) * 100}%"></div>
                    </div>
                    <span class="font-semibold">${count}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Recent Applications</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${recentApps.map(app => `
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">${app.personal_info?.firstName} ${app.personal_info?.lastName}</div>
                        <div class="text-sm text-gray-500">${app.personal_info?.email}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.qualification_results?.qualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }">
                        ${app.qualification_results?.qualified ? 'Qualified' : 'Not Qualified'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button class="text-blue-600 hover:text-blue-900" onclick="adminDashboard.viewApplication('${app.id}')">
                        View Details
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  }

  async loadApplications() {
    try {
      const response = await this.apiCall(`/api/admin/applications?page=${this.currentPage}&limit=${this.applicationsPerPage}`)
      
      if (response.success) {
        this.applications = response.applications
        this.renderApplications(response.applications, response.pagination)
      }
    } catch (error) {
      console.error('Applications load error:', error)
      this.showError('Failed to load applications')
    }
  }

  renderApplications(applications, pagination) {
    const content = document.getElementById('applications-content')
    if (!content) return

    content.innerHTML = `
      <div class="space-y-6">
        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select id="status-filter" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="all">All Applications</option>
                <option value="qualified">Qualified</option>
                <option value="not_qualified">Not Qualified</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input type="text" id="search-input" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Name or email...">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select id="sort-filter" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="created_at">Date Created</option>
                <option value="qualification_results->qualified">Qualification Status</option>
              </select>
            </div>
            <div class="flex items-end">
              <button id="apply-filters" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Applications Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Applications (${pagination.totalCount} total)</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income/DTI</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${applications.map(app => `
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">${app.personal_info?.firstName} ${app.personal_info?.lastName}</div>
                        <div class="text-sm text-gray-500">${app.personal_info?.email}</div>
                        <div class="text-sm text-gray-500">${app.personal_info?.phone}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.qualification_results?.qualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }">
                        ${app.qualification_results?.qualified ? 'Qualified' : 'Not Qualified'}
                      </span>
                      ${app.qualification_results?.qualified ? `
                        <div class="text-xs text-gray-500 mt-1">
                          ${app.qualification_results.programs?.length || 0} programs
                        </div>
                      ` : ''}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>$${app.property?.propertyValue?.toLocaleString()}</div>
                      <div class="text-gray-500">${app.property?.city}, ${app.property?.state}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>$${app.employment?.monthlyIncome?.toLocaleString()}/mo</div>
                      <div class="text-gray-500">Credit: ${app.financial?.creditScore}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button class="text-blue-600 hover:text-blue-900" onclick="adminDashboard.viewApplication('${app.id}')">
                        View
                      </button>
                      <button class="text-green-600 hover:text-green-900" onclick="adminDashboard.addNote('${app.id}')">
                        Note
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          ${this.renderPagination(pagination)}
        </div>
      </div>
    `

    // Attach filter event listeners
    document.getElementById('apply-filters').addEventListener('click', () => this.applyFilters())
  }

  renderPagination(pagination) {
    if (pagination.totalPages <= 1) return ''

    return `
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button ${!pagination.hasPrev ? 'disabled' : ''} 
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  onclick="adminDashboard.changePage(${pagination.currentPage - 1})">
            Previous
          </button>
          <button ${!pagination.hasNext ? 'disabled' : ''} 
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  onclick="adminDashboard.changePage(${pagination.currentPage + 1})">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">${((pagination.currentPage - 1) * this.applicationsPerPage) + 1}</span> to 
              <span class="font-medium">${Math.min(pagination.currentPage * this.applicationsPerPage, pagination.totalCount)}</span> of 
              <span class="font-medium">${pagination.totalCount}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              ${Array.from({length: Math.min(pagination.totalPages, 10)}, (_, i) => {
                const page = i + 1
                return `
                  <button onclick="adminDashboard.changePage(${page})" 
                          class="relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage 
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }">
                    ${page}
                  </button>
                `
              }).join('')}
            </nav>
          </div>
        </div>
      </div>
    `
  }

  async loadStatistics() {
    try {
      const response = await this.apiCall('/api/admin/statistics')
      
      if (response.success) {
        this.renderStatistics(response.statistics)
      }
    } catch (error) {
      console.error('Statistics load error:', error)
      this.showError('Failed to load statistics')
    }
  }

  renderStatistics(stats) {
    const content = document.getElementById('statistics-content')
    if (!content) return

    content.innerHTML = `
      <div class="space-y-8">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-full">
                <i class="fas fa-file-alt text-blue-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Applications</p>
                <p class="text-3xl font-bold text-gray-900">${stats.totals.applications}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-full">
                <i class="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Qualified</p>
                <p class="text-3xl font-bold text-gray-900">${stats.totals.qualified}</p>
                <p class="text-sm text-green-600">${stats.totals.qualificationRate}% rate</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-full">
                <i class="fas fa-calendar-week text-purple-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">This Week</p>
                <p class="text-3xl font-bold text-gray-900">${stats.periods.thisWeek.applications}</p>
                <p class="text-sm ${stats.periods.thisWeek.growth >= 0 ? 'text-green-600' : 'text-red-600'}">
                  ${stats.periods.thisWeek.growth >= 0 ? '+' : ''}${stats.periods.thisWeek.growth}%
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 rounded-full">
                <i class="fas fa-calendar-alt text-orange-600 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">This Month</p>
                <p class="text-3xl font-bold text-gray-900">${stats.periods.thisMonth.applications}</p>
                <p class="text-sm ${stats.periods.thisMonth.growth >= 0 ? 'text-green-600' : 'text-red-600'}">
                  ${stats.periods.thisMonth.growth >= 0 ? '+' : ''}${stats.periods.thisMonth.growth}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Program Performance -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Loan Program Performance</h3>
            <div class="space-y-4">
              ${Object.entries(stats.programs).map(([program, count]) => {
                const percentage = stats.totals.qualified > 0 ? (count / stats.totals.qualified * 100).toFixed(1) : 0
                return `
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-700">${program}</span>
                      <span class="text-sm text-gray-500">${count} (${percentage}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div class="space-y-4">
              ${stats.recentActivity.slice(0, 8).map(activity => `
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-${activity.qualified ? 'green' : 'red'}-100 rounded-full flex items-center justify-center">
                      <i class="fas fa-${activity.qualified ? 'check' : 'times'} text-${activity.qualified ? 'green' : 'red'}-600 text-sm"></i>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">${activity.name}</p>
                    <p class="text-sm text-gray-500">${activity.email}</p>
                  </div>
                  <div class="flex-shrink-0 text-sm text-gray-500">
                    ${new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Monthly Trends -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Application Trends</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div class="text-center text-gray-500">
              <i class="fas fa-chart-area text-4xl mb-4"></i>
              <p class="text-lg">Trend Chart Visualization</p>
              <p class="text-sm">30-day application and qualification trends</p>
            </div>
          </div>
        </div>
      </div>
    `
  }

  loadSettings() {
    const content = document.getElementById('settings-content')
    if (!content) return

    content.innerHTML = `
      <div class="space-y-8">
        <!-- System Settings -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">System Settings</h3>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Default Admin Password</label>
              <div class="flex space-x-4">
                <input type="password" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter new password">
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Update</button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Notifications</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked>
                  <span class="ml-2 text-sm text-gray-700">New application notifications</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked>
                  <span class="ml-2 text-sm text-gray-700">Daily summary reports</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">Weekly analytics reports</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Data Management</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">Export All Applications</h4>
                <p class="text-sm text-gray-500">Download CSV of all application data</p>
              </div>
              <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <i class="fas fa-download mr-2"></i>Export
              </button>
            </div>
            
            <div class="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 class="font-medium text-gray-900">System Backup</h4>
                <p class="text-sm text-gray-500">Create full system backup</p>
              </div>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <i class="fas fa-save mr-2"></i>Backup
              </button>
            </div>
            
            <div class="flex justify-between items-center p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 class="font-medium text-red-900">Clear Old Applications</h4>
                <p class="text-sm text-red-600">Remove applications older than 1 year</p>
              </div>
              <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700" onclick="confirm('Are you sure? This cannot be undone.') && alert('Feature not implemented')">
                <i class="fas fa-trash mr-2"></i>Clean Up
              </button>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">System Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Application Details</h4>
              <dl class="space-y-2">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Version:</dt>
                  <dd class="text-sm font-medium text-gray-900">1.0.0</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Environment:</dt>
                  <dd class="text-sm font-medium text-gray-900">Production</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Last Deploy:</dt>
                  <dd class="text-sm font-medium text-gray-900">${new Date().toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Database</h4>
              <dl class="space-y-2">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Provider:</dt>
                  <dd class="text-sm font-medium text-gray-900">Supabase PostgreSQL</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Status:</dt>
                  <dd class="text-sm font-medium text-green-600">Connected</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Tables:</dt>
                  <dd class="text-sm font-medium text-gray-900">12 active</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    `
  }

  async apiCall(endpoint, options = {}) {
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(endpoint, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        window.location.reload()
        return
      }
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return await response.json()
  }

  changePage(page) {
    this.currentPage = page
    this.loadApplications()
  }

  applyFilters() {
    const status = document.getElementById('status-filter').value
    const search = document.getElementById('search-input').value
    const sort = document.getElementById('sort-filter').value
    
    // Reset to first page when applying filters
    this.currentPage = 1
    
    // Build query string
    const params = new URLSearchParams({
      page: this.currentPage,
      limit: this.applicationsPerPage,
      status,
      search,
      sortBy: sort
    })

    // Make API call with filters
    this.apiCall(`/api/admin/applications?${params.toString()}`)
      .then(response => {
        if (response.success) {
          this.applications = response.applications
          this.renderApplications(response.applications, response.pagination)
        }
      })
      .catch(error => {
        console.error('Filter error:', error)
        this.showError('Failed to apply filters')
      })
  }

  async viewApplication(applicationId) {
    try {
      // Find the application in current data
      const app = this.applications.find(a => a.id === applicationId)
      if (!app) {
        throw new Error('Application not found')
      }

      this.showApplicationModal(app)
    } catch (error) {
      console.error('View application error:', error)
      this.showError('Failed to load application details')
    }
  }

  showApplicationModal(app) {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-4xl mx-auto max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Application Details</h2>
          <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Name:</dt>
                <dd class="text-sm font-medium text-gray-900">${app.personal_info?.firstName} ${app.personal_info?.lastName}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Email:</dt>
                <dd class="text-sm font-medium text-gray-900">${app.personal_info?.email}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Phone:</dt>
                <dd class="text-sm font-medium text-gray-900">${app.personal_info?.phone}</dd>
              </div>
            </dl>
          </div>

          <!-- Financial Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Monthly Income:</dt>
                <dd class="text-sm font-medium text-gray-900">$${app.employment?.monthlyIncome?.toLocaleString()}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Credit Score:</dt>
                <dd class="text-sm font-medium text-gray-900">${app.financial?.creditScore}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Down Payment:</dt>
                <dd class="text-sm font-medium text-gray-900">$${app.financial?.downPayment?.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          <!-- Property Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Value:</dt>
                <dd class="text-sm font-medium text-gray-900">$${app.property?.propertyValue?.toLocaleString()}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Location:</dt>
                <dd class="text-sm font-medium text-gray-900">${app.property?.city}, ${app.property?.state}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Type:</dt>
                <dd class="text-sm font-medium text-gray-900">${app.property?.propertyType}</dd>
              </div>
            </dl>
          </div>

          <!-- Qualification Results -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualification Status</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <span class="px-3 py-1 text-sm font-semibold rounded-full ${
                  app.qualification_results?.qualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">
                  ${app.qualification_results?.qualified ? 'QUALIFIED' : 'NOT QUALIFIED'}
                </span>
              </div>
              
              ${app.qualification_results?.qualified ? `
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-2">Approved Programs:</p>
                  <ul class="text-sm text-gray-600 space-y-1">
                    ${app.qualification_results.programs?.map(program => `
                      <li>• ${program.displayName} - ${program.rate}% rate</li>
                    `).join('') || ''}
                  </ul>
                </div>
              ` : `
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-2">Reasons:</p>
                  <ul class="text-sm text-gray-600 space-y-1">
                    ${app.qualification_results?.reasons?.map(reason => `<li>• ${reason}</li>`).join('') || ''}
                  </ul>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex space-x-4">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onclick="adminDashboard.addNote('${app.id}')">
              <i class="fas fa-sticky-note mr-2"></i>Add Note
            </button>
            <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <i class="fas fa-envelope mr-2"></i>Email Applicant
            </button>
            <button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700" onclick="this.closest('.fixed').remove()">
              Close
            </button>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
  }

  addNote(applicationId) {
    const note = prompt('Enter note for this application:')
    if (!note) return

    this.apiCall('/api/admin/applications', {
      method: 'POST',
      body: JSON.stringify({
        applicationId,
        action: 'add_note',
        note
      })
    })
    .then(response => {
      if (response.success) {
        alert('Note added successfully!')
        // Refresh applications if needed
        this.loadApplications()
      } else {
        alert('Failed to add note: ' + (response.error || 'Unknown error'))
      }
    })
    .catch(error => {
      console.error('Add note error:', error)
      alert('Failed to add note. Please try again.')
    })
  }

  showError(message) {
    alert('Error: ' + message)
  }
}

// Initialize admin dashboard
let adminDashboard
document.addEventListener('DOMContentLoaded', function() {
  const checkAdminContent = setInterval(() => {
    const adminContent = document.getElementById('admin-content')
    if (adminContent) {
      clearInterval(checkAdminContent)
      adminDashboard = new AdminDashboard()
    }
  }, 100)
})