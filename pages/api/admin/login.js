// pages/api/admin/login.js - Admin authentication
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    // Check for default admin (for initial setup)
    if (username === 'admin' && password === process.env.ADMIN_DEFAULT_PASSWORD) {
      // Create or update default admin user
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', 'admin')
        .single()

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD, 12)
        await supabase.from('admin_users').insert({
          username: 'admin',
          email: 'admin@mymortgagehacker.com',
          password_hash: hashedPassword,
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString()
        })
      }

      const token = jwt.sign(
        { 
          username: 'admin', 
          role: 'super_admin',
          userId: existingAdmin?.id || 'admin'
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      )

      // Log successful admin login
      await supabase.from('compliance_logs').insert({
        event_type: 'admin_login',
        user_identifier: username,
        event_data: { loginMethod: 'default_admin' },
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      })

      return res.status(200).json({
        success: true,
        token,
        user: {
          username: 'admin',
          role: 'super_admin',
          email: 'admin@mymortgagehacker.com'
        }
      })
    }

    // Check database for admin user
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      // Log failed login attempt
      await supabase.from('compliance_logs').insert({
        event_type: 'admin_login_failed',
        user_identifier: username,
        event_data: { reason: 'user_not_found' },
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      })

      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    
    if (!isValidPassword) {
      // Log failed login attempt
      await supabase.from('compliance_logs').insert({
        event_type: 'admin_login_failed',
        user_identifier: username,
        event_data: { reason: 'invalid_password' },
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      })

      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ 
        last_login: new Date().toISOString(),
        login_count: (admin.login_count || 0) + 1
      })
      .eq('id', admin.id)

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: admin.username, 
        role: admin.role,
        userId: admin.id
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    // Log successful admin login
    await supabase.from('compliance_logs').insert({
      event_type: 'admin_login',
      user_identifier: username,
      event_data: { 
        userId: admin.id,
        role: admin.role 
      },
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.last_login
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}