// pages/api/admin/applications.js - Admin applications management
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify admin authentication
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if (!decoded.username || !decoded.role) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    if (req.method === 'GET') {
      return handleGetApplications(req, res, decoded)
    } else if (req.method === 'POST') {
      return handleUpdateApplication(req, res, decoded)
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Admin applications error:', error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function handleGetApplications(req, res, admin) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status = 'all', 
      search = '', 
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query

    let query = supabase
      .from('applications')
      .select(`
        *,
        admin_notes (
          id,
          note,
          created_by,
          created_at
        )
      `)

    // Filter by status if specified
    if (status !== 'all') {
      if (status === 'qualified') {
        query = query.eq('qualification_results->qualified', true)
      } else if (status === 'not_qualified') {
        query = query.eq('qualification_results->qualified', false)
      }
    }

    // Search functionality
    if (search) {
      query = query.or(`
        personal_info->firstName.ilike.%${search}%,
        personal_info->lastName.ilike.%${search}%,
        personal_info->email.ilike.%${search}%
      `)
    }

    // Sorting
    const validSortFields = ['created_at', 'updated_at', 'qualification_results->qualified']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const order = sortOrder === 'asc' ? 'asc' : 'desc'
    
    query = query.order(sortField, { ascending: order === 'asc' })

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit)
    query = query.range(offset, offset + parseInt(limit) - 1)

    const { data: applications, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to fetch applications' })
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    // Log admin access
    await supabase.from('compliance_logs').insert({
      event_type: 'admin_view_applications',
      user_identifier: admin.username,
      event_data: { 
        page: parseInt(page),
        limit: parseInt(limit),
        applicationsCount: applications?.length || 0
      },
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    res.status(200).json({
      success: true,
      applications: applications || [],
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil((totalCount || 0) / parseInt(limit)),
        totalCount: totalCount || 0,
        hasNext: offset + parseInt(limit) < (totalCount || 0),
        hasPrev: parseInt(page) > 1
      }
    })

  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
}

async function handleUpdateApplication(req, res, admin) {
  try {
    const { applicationId, action, note, status } = req.body

    if (!applicationId || !action) {
      return res.status(400).json({ error: 'Application ID and action required' })
    }

    // Handle different actions
    if (action === 'add_note') {
      if (!note) {
        return res.status(400).json({ error: 'Note content required' })
      }

      const { data: noteData, error: noteError } = await supabase
        .from('admin_notes')
        .insert({
          application_id: applicationId,
          note,
          created_by: admin.username,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (noteError) {
        console.error('Note creation error:', noteError)
        return res.status(500).json({ error: 'Failed to add note' })
      }

      // Log admin action
      await supabase.from('compliance_logs').insert({
        event_type: 'admin_add_note',
        user_identifier: admin.username,
        event_data: { 
          applicationId,
          noteId: noteData.id
        },
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      })

      return res.status(200).json({
        success: true,
        message: 'Note added successfully',
        note: noteData
      })
    }

    if (action === 'update_status') {
      if (!status) {
        return res.status(400).json({ error: 'Status required' })
      }

      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          admin_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (updateError) {
        console.error('Status update error:', updateError)
        return res.status(500).json({ error: 'Failed to update status' })
      }

      // Log admin action
      await supabase.from('compliance_logs').insert({
        event_type: 'admin_update_status',
        user_identifier: admin.username,
        event_data: { 
          applicationId,
          newStatus: status
        },
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      })

      return res.status(200).json({
        success: true,
        message: 'Status updated successfully'
      })
    }

    return res.status(400).json({ error: 'Invalid action' })

  } catch (error) {
    console.error('Update application error:', error)
    res.status(500).json({ error: 'Failed to update application' })
  }
}