// US Cities and ZIP Code validation data (same as before)
const US_CITIES_ZIP_MAP = {
  'CA': {
    'LOS ANGELES': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90010', '90011', '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019', '90020', '90021', '90022', '90023', '90024', '90025', '90026', '90027', '90028', '90029', '90031', '90032', '90033', '90034', '90035', '90036', '90037', '90038', '90039', '90040', '90041', '90042', '90043', '90044', '90045', '90046', '90047', '90048', '90049', '90056', '90057', '90058', '90059', '90061', '90062', '90063', '90064', '90065', '90066', '90067', '90068', '90069', '90071', '90272', '90290', '90291', '90292', '90293', '90294', '90295'],
    'SANTA MONICA': ['90401', '90402', '90403', '90404', '90405', '90406', '90407', '90408', '90409', '90410', '90411'],
    'BEVERLY HILLS': ['90209', '90210', '90211', '90212', '90213'],
    'HOLLYWOOD': ['90028', '90038', '90046', '90068'],
    'DOWNEY': ['90239', '90240', '90241', '90242'],
    'PASADENA': ['91101', '91102', '91103', '91104', '91105', '91106', '91107', '91108', '91109', '91110', '91114', '91115', '91116', '91117', '91118', '91121', '91123', '91124', '91125', '91126', '91129', '91131', '91182', '91184', '91185', '91188', '91189', '91199'],
    'LONG BEACH': ['90801', '90802', '90803', '90804', '90805', '90806', '90807', '90808', '90809', '90810', '90813', '90814', '90815', '90822', '90831', '90832', '90833', '90834', '90835', '90840', '90842', '90844', '90846', '90847', '90848', '90853']
  },
  'TX': {
    'HOUSTON': ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010', '77011', '77012', '77013', '77014', '77015', '77016', '77017', '77018', '77019', '77020', '77021', '77022', '77023', '77024', '77025', '77026', '77027', '77028', '77029', '77030'],
    'DALLAS': ['75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210', '75211', '75212', '75214', '75215', '75216', '75217', '75218', '75219', '75220', '75221', '75222', '75223', '75224', '75225', '75226', '75227', '75228', '75229', '75230'],
    'SAN ANTONIO': ['78201', '78202', '78203', '78204', '78205', '78207', '78208', '78209', '78210', '78211', '78212', '78213', '78214', '78215', '78216', '78217', '78218', '78219', '78220', '78221', '78222', '78223', '78224', '78225', '78226', '78227', '78228', '78229', '78230'],
    'AUSTIN': ['73301', '73344', '78701', '78702', '78703', '78704', '78705', '78712', '78717', '78719', '78721', '78722', '78723', '78724', '78725', '78726', '78727', '78728', '78729', '78730', '78731', '78732', '78733', '78734', '78735', '78736', '78737', '78738', '78739']
  },
  'NY': {
    'NEW YORK': ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10009', '10010', '10011', '10012', '10013', '10014', '10016', '10017', '10018', '10019', '10020', '10021', '10022', '10023', '10024', '10025', '10026', '10027', '10028', '10029', '10030'],
    'BROOKLYN': ['11201', '11202', '11203', '11204', '11205', '11206', '11207', '11208', '11209', '11210', '11211', '11212', '11213', '11214', '11215', '11216', '11217', '11218', '11219', '11220', '11221', '11222', '11223', '11224', '11225', '11226', '11228', '11229', '11230']
  },
  'FL': {
    'MIAMI': ['33101', '33102', '33109', '33111', '33112', '33114', '33116', '33119', '33122', '33124', '33125', '33126', '33127', '33128', '33129', '33130', '33131', '33132', '33133', '33134', '33135', '33136', '33137', '33138', '33139', '33140'],
    'TAMPA': ['33601', '33602', '33603', '33604', '33605', '33606', '33607', '33608', '33609', '33610', '33611', '33612', '33613', '33614', '33615', '33616', '33617', '33618', '33619', '33620', '33621', '33622', '33623', '33624', '33625', '33626']
  }
}

export class InputValidator {
  static sanitizeString(input) {
    if (typeof input !== 'string') return ''
    return input.trim().replace(/[<>"'&]/g, (char) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;'
      }
      return entities[char] || char
    })
  }

  static validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email) && email.length <= 100
  }

  static validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
    const usPhoneRegex = /^(\+?1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/
    const intlPhoneRegex = /^\+[1-9]\d{1,14}$/
    return usPhoneRegex.test(cleaned) || intlPhoneRegex.test(cleaned)
  }

  static validateZip(zip) {
    const zipRegex = /^\d{5}(-\d{4})?$/
    return zipRegex.test(zip)
  }

  static validateState(state) {
    const validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    return validStates.includes(state.toUpperCase())
  }

  static validateCityZipMatch(city, zip, state) {
    const normalizedCity = city.toUpperCase().trim()
    const normalizedState = state.toUpperCase().trim()
    const cleanZip = zip.replace(/-.*/, '')
    
    const stateData = US_CITIES_ZIP_MAP[normalizedState]
    if (!stateData) return true
    
    const cityZips = stateData[normalizedCity]
    if (!cityZips) return true
    
    return cityZips.includes(cleanZip)
  }

  static getZipCodesForCity(city, state) {
    const normalizedCity = city.toUpperCase().trim()
    const normalizedState = state.toUpperCase().trim()
    const stateData = US_CITIES_ZIP_MAP[normalizedState]
    
    if (!stateData || !stateData[normalizedCity]) return []
    return stateData[normalizedCity]
  }

  static validateQualificationInput(data) {
    const errors = []
    const sanitized = {}

    // Required string fields
    const stringFields = ['name', 'street', 'city', 'loan_type', 'term', 'credit_tier']
    for (const field of stringFields) {
      if (!data[field] || typeof data[field] !== 'string') {
        errors.push(`${field} is required and must be a string`)
        continue
      }
      sanitized[field] = this.sanitizeString(data[field])
    }

    // Email validation
    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('Valid email is required')
    } else {
      sanitized.email = this.sanitizeString(data.email.toLowerCase())
    }

    // Phone validation
    if (!data.phone || !this.validatePhone(data.phone)) {
      errors.push('Valid phone number is required')
    } else {
      sanitized.phone = this.sanitizeString(data.phone)
    }

    // State validation
    if (!data.state || !this.validateState(data.state)) {
      errors.push('Valid US state code is required')
    } else {
      sanitized.state = data.state.toUpperCase()
    }

    // ZIP validation
    if (!data.zip || !this.validateZip(data.zip)) {
      errors.push('Valid ZIP code is required')
    } else {
      sanitized.zip = this.sanitizeString(data.zip)
    }

    // City and ZIP match validation
    if (sanitized.city && sanitized.zip && sanitized.state) {
      if (!this.validateCityZipMatch(sanitized.city, sanitized.zip, sanitized.state)) {
        const validZips = this.getZipCodesForCity(sanitized.city, sanitized.state)
        if (validZips.length > 0) {
          errors.push(`ZIP code ${sanitized.zip} does not match ${sanitized.city}, ${sanitized.state}. Valid ZIP codes include: ${validZips.slice(0, 5).join(', ')}`)
        }
      }
    }

    // Amount validations
    const amountFields = ['requested_amount', 'income_annual']
    for (const field of amountFields) {
      if (!data[field]) {
        errors.push(`${field} is required`)
        continue
      }
      const num = parseFloat(data[field])
      if (isNaN(num) || num <= 0) {
        errors.push(`${field} must be a positive number`)
      } else {
        sanitized[field] = num
      }
    }

    // Optional amount fields
    const optionalAmounts = ['property_value', 'debt_monthly', 'down_payment']
    for (const field of optionalAmounts) {
      if (data[field]) {
        const num = parseFloat(data[field])
        if (!isNaN(num) && num >= 0) {
          sanitized[field] = num
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized: errors.length === 0 ? sanitized : undefined
    }
  }
}