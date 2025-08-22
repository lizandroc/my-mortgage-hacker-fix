import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// Client for frontend (public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for backend operations (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database helper functions
export const db = {
  // Users
  async createUser(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Applications
  async createApplication(applicationData) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert([applicationData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getApplications(limit = 100) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        users (
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  async getApplicationById(id) {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        users (
          name,
          email,
          phone
        ),
        properties (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Statistics
  async getApplicationStats() {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('status, requested_amount, income_annual, created_at')
    
    if (error) throw error

    const stats = {
      total_applications: data.length,
      qualified: data.filter(app => app.status === 'qualified').length,
      conditionally_qualified: data.filter(app => app.status === 'conditionally_qualified').length,
      not_qualified: data.filter(app => app.status === 'not_qualified').length,
      avg_loan_amount: data.reduce((sum, app) => sum + (app.requested_amount || 0), 0) / data.length,
      avg_income: data.reduce((sum, app) => sum + (app.income_annual || 0), 0) / data.length,
      today_applications: data.filter(app => {
        const today = new Date().toDateString()
        return new Date(app.created_at).toDateString() === today
      }).length,
      this_week: data.filter(app => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(app.created_at) >= weekAgo
      }).length
    }

    stats.conversion_rate = stats.total_applications > 0 
      ? ((stats.qualified + stats.conditionally_qualified) / stats.total_applications * 100) 
      : 0

    return stats
  },

  // Compliance logging
  async logCompliance(eventType, clientIP, userEmail, eventData) {
    const { error } = await supabaseAdmin
      .from('compliance_logs')
      .insert([{
        event_type: eventType,
        client_ip: clientIP,
        user_email: userEmail,
        event_data: eventData,
        created_at: new Date().toISOString()
      }])
    
    if (error) throw error
  }
}