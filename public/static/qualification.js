// public/static/qualification.js - Multi-step mortgage qualification form

class MortgageQualifier {
  constructor() {
    this.currentStep = 1
    this.totalSteps = 4
    this.formData = {}
    this.validationRules = {}
    this.qualificationResult = null
    
    this.init()
  }

  init() {
    this.setupValidationRules()
    this.renderForm()
    this.attachEventListeners()
  }

  setupValidationRules() {
    this.validationRules = {
      // Step 1: Personal Information
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { required: true, pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/ },
      dateOfBirth: { required: true },
      ssn: { required: true, pattern: /^\d{3}-?\d{2}-?\d{4}$/ },

      // Step 2: Employment & Income
      employmentStatus: { required: true },
      employer: { required: true, minLength: 2 },
      jobTitle: { required: true, minLength: 2 },
      monthlyIncome: { required: true, min: 1000 },
      employmentYears: { required: true, min: 0 },
      additionalIncome: { min: 0 },

      // Step 3: Financial Information
      creditScore: { required: true, min: 300, max: 850 },
      monthlyDebts: { required: true, min: 0 },
      assets: { required: true, min: 0 },
      downPayment: { required: true, min: 1000 },

      // Step 4: Property Information
      propertyType: { required: true },
      propertyValue: { required: true, min: 50000 },
      propertyAddress: { required: true, minLength: 5 },
      propertyCity: { required: true, minLength: 2 },
      propertyState: { required: true },
      propertyZip: { required: true, pattern: /^\d{5}(-\d{4})?$/ }
    }
  }

  renderForm() {
    const container = document.getElementById('qualification-form')
    
    container.innerHTML = `
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-blue-600">Step ${this.currentStep} of ${this.totalSteps}</span>
          <span class="text-sm text-gray-500">${Math.round((this.currentStep / this.totalSteps) * 100)}% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
        </div>
      </div>

      <!-- Step Content -->
      <div id="step-content">
        ${this.renderStep(this.currentStep)}
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8">
        <button 
          id="prev-btn" 
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 ${this.currentStep === 1 ? 'invisible' : ''}"
        >
          <i class="fas fa-arrow-left mr-2"></i>Previous
        </button>
        <button 
          id="next-btn" 
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ${this.currentStep === this.totalSteps ? '<i class="fas fa-calculator mr-2"></i>Calculate Qualification' : 'Next<i class="fas fa-arrow-right ml-2"></i>'}
        </button>
      </div>

      <!-- Loading Overlay -->
      <div id="loading-overlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="display: none;">
        <div class="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold mb-2">Calculating Your Qualification</h3>
          <p class="text-gray-600">Please wait while we analyze your information...</p>
        </div>
      </div>

      <!-- Results Modal -->
      <div id="results-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style="display: none;">
        <div class="bg-white rounded-lg p-8 max-w-4xl mx-auto max-h-screen overflow-y-auto">
          <div id="results-content"></div>
        </div>
      </div>
    `
  }

  renderStep(step) {
    switch (step) {
      case 1:
        return this.renderPersonalInfo()
      case 2:
        return this.renderEmploymentInfo()
      case 3:
        return this.renderFinancialInfo()
      case 4:
        return this.renderPropertyInfo()
      default:
        return '<div>Invalid step</div>'
    }
  }

  renderPersonalInfo() {
    return `
      <div class="space-y-6">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            <i class="fas fa-user text-blue-600 mr-2"></i>
            Personal Information
          </h3>
          <p class="text-gray-600">Let's start with some basic information about you</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input type="text" id="firstName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.firstName || ''}" placeholder="Enter your first name">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input type="text" id="lastName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.lastName || ''}" placeholder="Enter your last name">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input type="email" id="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.email || ''}" placeholder="your@email.com">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input type="tel" id="phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.phone || ''}" placeholder="(555) 123-4567">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
            <input type="date" id="dateOfBirth" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.dateOfBirth || ''}">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Social Security Number *</label>
            <input type="text" id="ssn" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.ssn || ''}" placeholder="XXX-XX-XXXX" maxlength="11">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
            <p class="text-xs text-gray-500 mt-1">Your SSN is encrypted and secure</p>
          </div>
        </div>
      </div>
    `
  }

  renderEmploymentInfo() {
    return `
      <div class="space-y-6">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            <i class="fas fa-briefcase text-blue-600 mr-2"></i>
            Employment & Income
          </h3>
          <p class="text-gray-600">Tell us about your employment and income</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Employment Status *</label>
            <select id="employmentStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select employment status</option>
              <option value="employed" ${this.formData.employmentStatus === 'employed' ? 'selected' : ''}>Full-time Employed</option>
              <option value="self-employed" ${this.formData.employmentStatus === 'self-employed' ? 'selected' : ''}>Self-employed</option>
              <option value="part-time" ${this.formData.employmentStatus === 'part-time' ? 'selected' : ''}>Part-time</option>
              <option value="contract" ${this.formData.employmentStatus === 'contract' ? 'selected' : ''}>Contract/1099</option>
              <option value="retired" ${this.formData.employmentStatus === 'retired' ? 'selected' : ''}>Retired</option>
            </select>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Employer Name *</label>
            <input type="text" id="employer" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.employer || ''}" placeholder="Your employer name">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input type="text" id="jobTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.jobTitle || ''}" placeholder="Your job title">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Years of Employment *</label>
            <input type="number" id="employmentYears" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.employmentYears || ''}" placeholder="2.5" step="0.1" min="0">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Gross Monthly Income *</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input type="number" id="monthlyIncome" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                     value="${this.formData.monthlyIncome || ''}" placeholder="5,000" min="0">
            </div>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
            <p class="text-xs text-gray-500 mt-1">Before taxes and deductions</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Additional Monthly Income</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input type="number" id="additionalIncome" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                     value="${this.formData.additionalIncome || ''}" placeholder="0" min="0">
            </div>
            <p class="text-xs text-gray-500 mt-1">Rental, investments, etc.</p>
          </div>
        </div>
      </div>
    `
  }

  renderFinancialInfo() {
    return `
      <div class="space-y-6">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            <i class="fas fa-chart-line text-blue-600 mr-2"></i>
            Financial Information
          </h3>
          <p class="text-gray-600">Help us understand your financial situation</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Credit Score *</label>
            <select id="creditScore" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select your credit score range</option>
              <option value="800" ${this.formData.creditScore == '800' ? 'selected' : ''}>800+ (Excellent)</option>
              <option value="750" ${this.formData.creditScore == '750' ? 'selected' : ''}>750-799 (Very Good)</option>
              <option value="700" ${this.formData.creditScore == '700' ? 'selected' : ''}>700-749 (Good)</option>
              <option value="650" ${this.formData.creditScore == '650' ? 'selected' : ''}>650-699 (Fair)</option>
              <option value="600" ${this.formData.creditScore == '600' ? 'selected' : ''}>600-649 (Poor)</option>
              <option value="550" ${this.formData.creditScore == '550' ? 'selected' : ''}>Below 600 (Very Poor)</option>
            </select>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Total Monthly Debt Payments *</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input type="number" id="monthlyDebts" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                     value="${this.formData.monthlyDebts || ''}" placeholder="500" min="0">
            </div>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
            <p class="text-xs text-gray-500 mt-1">Credit cards, auto loans, student loans, etc.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Total Assets *</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input type="number" id="assets" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                     value="${this.formData.assets || ''}" placeholder="25,000" min="0">
            </div>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
            <p class="text-xs text-gray-500 mt-1">Savings, checking, investments, retirement</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Available Down Payment *</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input type="number" id="downPayment" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                     value="${this.formData.downPayment || ''}" placeholder="20,000" min="0">
            </div>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div class="md:col-span-2">
            <div class="flex items-center">
              <input type="checkbox" id="hasCoSigner" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                     ${this.formData.hasCoSigner ? 'checked' : ''}>
              <label for="hasCoSigner" class="ml-2 block text-sm text-gray-700">
                I have a co-signer for this loan
              </label>
            </div>
          </div>

          <div class="md:col-span-2">
            <div class="flex items-center">
              <input type="checkbox" id="firstTimeHomeBuyer" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                     ${this.formData.firstTimeHomeBuyer ? 'checked' : ''}>
              <label for="firstTimeHomeBuyer" class="ml-2 block text-sm text-gray-700">
                I am a first-time home buyer
              </label>
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderPropertyInfo() {
    return `
      <div class="space-y-6">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            <i class="fas fa-home text-blue-600 mr-2"></i>
            Property Information
          </h3>
          <p class="text-gray-600">Tell us about the property you want to purchase</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
            <select id="propertyType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select property type</option>
              <option value="single-family" ${this.formData.propertyType === 'single-family' ? 'selected' : ''}>Single Family Home</option>
              <option value="condo" ${this.formData.propertyType === 'condo' ? 'selected' : ''}>Condominium</option>
              <option value="townhouse" ${this.formData.propertyType === 'townhouse' ? 'selected' : ''}>Townhouse</option>
              <option value="multi-family" ${this.formData.propertyType === 'multi-family' ? 'selected' : ''}>Multi-family (2-4 units)</option>
              <option value="manufactured" ${this.formData.propertyType === 'manufactured' ? 'selected' : ''}>Manufactured Home</option>
            </select>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Property Value *</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input type="number" id="propertyValue" class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                     value="${this.formData.propertyValue || ''}" placeholder="300,000" min="0">
            </div>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Property Address *</label>
            <input type="text" id="propertyAddress" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.propertyAddress || ''}" placeholder="123 Main Street">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input type="text" id="propertyCity" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.propertyCity || ''}" placeholder="Los Angeles">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <select id="propertyState" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select state</option>
              ${this.getStateOptions()}
            </select>
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
            <input type="text" id="propertyZip" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                   value="${this.formData.propertyZip || ''}" placeholder="90210" maxlength="10">
            <div class="error-message text-red-600 text-sm mt-1" style="display: none;"></div>
          </div>
        </div>
      </div>
    `
  }

  getStateOptions() {
    const states = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ]
    
    return states.map(state => 
      `<option value="${state}" ${this.formData.propertyState === state ? 'selected' : ''}>${state}</option>`
    ).join('')
  }

  attachEventListeners() {
    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', () => this.previousStep())
    document.getElementById('next-btn').addEventListener('click', () => this.nextStep())

    // Real-time validation
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, select')) {
        this.validateField(e.target)
      }
    })

    // SSN formatting
    document.addEventListener('input', (e) => {
      if (e.target.id === 'ssn') {
        this.formatSSN(e.target)
      }
    })

    // Phone formatting
    document.addEventListener('input', (e) => {
      if (e.target.id === 'phone') {
        this.formatPhone(e.target)
      }
    })
  }

  validateField(field) {
    const rule = this.validationRules[field.id]
    if (!rule) return true

    const value = field.value.trim()
    const errorElement = field.parentNode.querySelector('.error-message')
    let isValid = true
    let errorMessage = ''

    // Required field check
    if (rule.required && !value) {
      isValid = false
      errorMessage = 'This field is required'
    }
    // Pattern check
    else if (value && rule.pattern && !rule.pattern.test(value)) {
      isValid = false
      errorMessage = this.getPatternErrorMessage(field.id)
    }
    // Min length check
    else if (value && rule.minLength && value.length < rule.minLength) {
      isValid = false
      errorMessage = `Must be at least ${rule.minLength} characters`
    }
    // Min value check
    else if (value && rule.min !== undefined && parseFloat(value) < rule.min) {
      isValid = false
      errorMessage = `Must be at least ${rule.min}`
    }
    // Max value check
    else if (value && rule.max !== undefined && parseFloat(value) > rule.max) {
      isValid = false
      errorMessage = `Must be no more than ${rule.max}`
    }

    // Update UI
    if (isValid) {
      field.classList.remove('border-red-500')
      field.classList.add('border-green-500')
      if (errorElement) {
        errorElement.style.display = 'none'
      }
    } else {
      field.classList.remove('border-green-500')
      field.classList.add('border-red-500')
      if (errorElement) {
        errorElement.textContent = errorMessage
        errorElement.style.display = 'block'
      }
    }

    return isValid
  }

  getPatternErrorMessage(fieldId) {
    const messages = {
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      ssn: 'Please enter a valid SSN (XXX-XX-XXXX)',
      propertyZip: 'Please enter a valid ZIP code'
    }
    return messages[fieldId] || 'Invalid format'
  }

  formatSSN(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length >= 6) {
      value = value.substring(0, 3) + '-' + value.substring(3, 5) + '-' + value.substring(5, 9)
    } else if (value.length >= 4) {
      value = value.substring(0, 3) + '-' + value.substring(3)
    }
    input.value = value
  }

  formatPhone(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length >= 7) {
      value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10)
    } else if (value.length >= 4) {
      value = '(' + value.substring(0, 3) + ') ' + value.substring(3)
    } else if (value.length >= 1) {
      value = '(' + value
    }
    input.value = value
  }

  validateCurrentStep() {
    const stepFields = this.getStepFields(this.currentStep)
    let isValid = true

    stepFields.forEach(fieldId => {
      const field = document.getElementById(fieldId)
      if (field && !this.validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }

  getStepFields(step) {
    const stepFields = {
      1: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'ssn'],
      2: ['employmentStatus', 'employer', 'jobTitle', 'monthlyIncome', 'employmentYears'],
      3: ['creditScore', 'monthlyDebts', 'assets', 'downPayment'],
      4: ['propertyType', 'propertyValue', 'propertyAddress', 'propertyCity', 'propertyState', 'propertyZip']
    }
    return stepFields[step] || []
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.saveCurrentStepData()
      this.currentStep--
      this.renderForm()
      this.attachEventListeners()
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.saveCurrentStepData()
        this.currentStep++
        this.renderForm()
        this.attachEventListeners()
      }
    } else {
      // Final step - submit qualification
      if (this.validateCurrentStep()) {
        this.saveCurrentStepData()
        this.submitQualification()
      }
    }
  }

  saveCurrentStepData() {
    const fields = this.getStepFields(this.currentStep)
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId)
      if (field) {
        if (field.type === 'checkbox') {
          this.formData[fieldId] = field.checked
        } else {
          this.formData[fieldId] = field.value
        }
      }
    })
  }

  async submitQualification() {
    this.showLoading()

    try {
      const response = await fetch('/api/qualify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.formData)
      })

      const data = await response.json()

      if (data.success) {
        this.qualificationResult = data.qualification
        this.applicationId = data.applicationId
        this.showResults()
      } else {
        this.showError(data.error || 'Qualification failed')
      }
    } catch (error) {
      console.error('Qualification error:', error)
      this.showError('Network error. Please try again.')
    } finally {
      this.hideLoading()
    }
  }

  showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex'
  }

  hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none'
  }

  showResults() {
    const modal = document.getElementById('results-modal')
    const content = document.getElementById('results-content')
    
    content.innerHTML = this.renderResults()
    modal.style.display = 'flex'

    // Attach result action listeners
    this.attachResultListeners()
  }

  renderResults() {
    const result = this.qualificationResult
    const qualified = result.qualified

    return `
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${qualified ? 'bg-green-100' : 'bg-red-100'}">
          <i class="fas ${qualified ? 'fa-check-circle text-green-600' : 'fa-times-circle text-red-600'} text-3xl"></i>
        </div>
        <h2 class="text-3xl font-bold mb-2 ${qualified ? 'text-green-600' : 'text-red-600'}">
          ${qualified ? 'Congratulations! You Qualify!' : 'Additional Review Required'}
        </h2>
        <p class="text-gray-600">
          ${qualified ? 'Based on your information, you qualify for the following mortgage programs:' : 'Don\'t worry - there are steps you can take to improve your qualification:'}
        </p>
      </div>

      ${qualified ? this.renderQualifiedPrograms() : this.renderImprovementSuggestions()}

      <div class="border-t pt-6 mt-8">
        <div class="flex flex-wrap gap-4 justify-center">
          <button id="export-pdf" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <i class="fas fa-file-pdf mr-2"></i>Download PDF
          </button>
          <button id="email-results" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            <i class="fas fa-envelope mr-2"></i>Email Results
          </button>
          <button id="restart-qualification" class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
            <i class="fas fa-redo mr-2"></i>Start Over
          </button>
        </div>
      </div>

      <div class="text-center mt-6">
        <button id="close-results" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times mr-1"></i>Close
        </button>
      </div>
    `
  }

  renderQualifiedPrograms() {
    const programs = this.qualificationResult.programs || []
    
    return `
      <div class="space-y-4 mb-8">
        ${programs.map(program => `
          <div class="border rounded-lg p-6 bg-green-50">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">${program.displayName}</h3>
                <p class="text-green-600 font-medium">${program.rate}% Interest Rate</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">$${program.monthlyPayment?.toLocaleString()}</p>
                <p class="text-sm text-gray-600">Principal & Interest</p>
              </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Total Monthly Payment</p>
                <p class="font-semibold">$${program.totalMonthlyPayment?.toLocaleString()}</p>
              </div>
              <div>
                <p class="text-gray-600">Front-end DTI</p>
                <p class="font-semibold">${program.frontEndDTI}%</p>
              </div>
              <div>
                <p class="text-gray-600">Back-end DTI</p>
                <p class="font-semibold">${program.backEndDTI}%</p>
              </div>
            </div>
            
            ${program.requiresPMI ? `
              <div class="mt-4 p-3 bg-yellow-50 rounded">
                <p class="text-sm text-yellow-800">
                  <i class="fas fa-info-circle mr-1"></i>
                  PMI Required: $${program.pmiAmount?.toLocaleString()}/month (included in total payment)
                </p>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <div class="bg-blue-50 rounded-lg p-6">
        <h4 class="font-semibold text-blue-900 mb-3">Next Steps:</h4>
        <ol class="list-decimal list-inside space-y-2 text-blue-800">
          <li>Contact one of our approved lenders to begin the formal application process</li>
          <li>Gather required documentation (pay stubs, tax returns, bank statements)</li>
          <li>Schedule a property appraisal once you find your home</li>
          <li>Review and sign your loan documents</li>
        </ol>
      </div>
    `
  }

  renderImprovementSuggestions() {
    const reasons = this.qualificationResult.reasons || []
    
    return `
      <div class="bg-red-50 rounded-lg p-6 mb-8">
        <h4 class="font-semibold text-red-900 mb-3">Areas for Improvement:</h4>
        <ul class="list-disc list-inside space-y-2 text-red-800">
          ${reasons.map(reason => `<li>${reason}</li>`).join('')}
        </ul>
      </div>

      <div class="bg-blue-50 rounded-lg p-6">
        <h4 class="font-semibold text-blue-900 mb-3">Recommended Next Steps:</h4>
        <ol class="list-decimal list-inside space-y-2 text-blue-800">
          <li>Work on improving your credit score</li>
          <li>Consider increasing your down payment</li>
          <li>Pay down existing debts to improve your debt-to-income ratio</li>
          <li>Speak with one of our mortgage consultants for personalized advice</li>
        </ol>
      </div>
    `
  }

  attachResultListeners() {
    document.getElementById('close-results').addEventListener('click', () => {
      document.getElementById('results-modal').style.display = 'none'
    })

    document.getElementById('export-pdf').addEventListener('click', () => this.exportToPDF())
    document.getElementById('email-results').addEventListener('click', () => this.emailResults())
    document.getElementById('restart-qualification').addEventListener('click', () => this.restartQualification())
  }

  async exportToPDF() {
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId: this.applicationId,
          email: this.formData.email
        })
      })

      const data = await response.json()

      if (data.success) {
        // Create a blob from the HTML content and trigger download
        const blob = new Blob([data.content], { type: 'text/html' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = data.filename.replace('.pdf', '.html')
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        alert('Results downloaded successfully!')
      } else {
        alert('Failed to generate PDF: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  async emailResults() {
    const email = prompt('Enter email address to send results to:', this.formData.email)
    if (!email) return

    try {
      const response = await fetch('/api/export/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId: this.applicationId,
          email: this.formData.email,
          recipientEmail: email
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Results sent successfully to ${email}!`)
      } else {
        alert('Failed to send email: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Email export error:', error)
      alert('Failed to send email. Please try again.')
    }
  }

  restartQualification() {
    if (confirm('Are you sure you want to start over? This will clear all your information.')) {
      this.currentStep = 1
      this.formData = {}
      this.qualificationResult = null
      this.applicationId = null
      
      document.getElementById('results-modal').style.display = 'none'
      this.renderForm()
      this.attachEventListeners()
    }
  }

  showError(message) {
    alert('Error: ' + message)
  }
}

// Initialize the qualification form when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the form container to be available
  const checkContainer = setInterval(() => {
    const container = document.getElementById('qualification-form')
    if (container) {
      clearInterval(checkContainer)
      new MortgageQualifier()
    }
  }, 100)
})