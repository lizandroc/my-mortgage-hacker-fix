// pages/api/admin/statistics.js - Admin dashboard statistics
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
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

    // Calculate date ranges
    const today = new Date()
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

    // Get total applications
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    // Get applications this week
    const { count: weeklyApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisWeek.toISOString())

    // Get applications this month
    const { count: monthlyApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonth.toISOString())

    // Get applications last month
    const { count: lastMonthApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', thisMonth.toISOString())

    // Get qualified applications
    const { count: qualifiedTotal } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('qualification_results->qualified', true)

    const { count: qualifiedThisMonth } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('qualification_results->qualified', true)
      .gte('created_at', thisMonth.toISOString())

    // Calculate qualification rate
    const qualificationRate = totalApplications > 0 ? 
      ((qualifiedTotal || 0) / totalApplications * 100) : 0

    const monthlyQualificationRate = monthlyApplications > 0 ? 
      ((qualifiedThisMonth || 0) / monthlyApplications * 100) : 0

    // Get recent applications for activity feed
    const { data: recentApplications } = await supabase
      .from('applications')
      .select(`
        id,
        personal_info,
        qualification_results,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get program distribution
    const { data: allApplications } = await supabase
      .from('applications')
      .select('qualification_results')
      .eq('qualification_results->qualified', true)

    const programStats = {}
    allApplications?.forEach(app => {
      const programs = app.qualification_results?.programs || []
      programs.forEach(program => {
        const name = program.displayName || program.name
        programStats[name] = (programStats[name] || 0) + 1
      })
    })

    // Get daily applications for the last 30 days
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const { data: dailyData } = await supabase
      .from('applications')
      .select('created_at, qualification_results')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at')

    // Process daily statistics
    const dailyStats = {}
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      dailyStats[dateStr] = { total: 0, qualified: 0 }
    }

    dailyData?.forEach(app => {
      const dateStr = app.created_at.split('T')[0]
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].total++
        if (app.qualification_results?.qualified) {
          dailyStats[dateStr].qualified++
        }
      }
    })

    const chartData = Object.keys(dailyStats)
      .sort()
      .map(date => ({
        date,
        total: dailyStats[date].total,
        qualified: dailyStats[date].qualified
      }))

    // Calculate growth rates
    const weeklyGrowth = lastMonthApplications > 0 ? 
      (((weeklyApplications || 0) * 4 - lastMonthApplications) / lastMonthApplications * 100) : 0

    const monthlyGrowth = lastMonthApplications > 0 ? 
      (((monthlyApplications || 0) - lastMonthApplications) / lastMonthApplications * 100) : 0

    // Log admin access
    await supabase.from('compliance_logs').insert({
      event_type: 'admin_view_statistics',
      user_identifier: decoded.username,
      event_data: { 
        totalApplications: totalApplications || 0,
        qualificationRate: Math.round(qualificationRate * 100) / 100
      },
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    res.status(200).json({
      success: true,
      statistics: {
        totals: {
          applications: totalApplications || 0,
          qualified: qualifiedTotal || 0,
          qualificationRate: Math.round(qualificationRate * 100) / 100
        },
        periods: {
          thisWeek: {
            applications: weeklyApplications || 0,
            growth: Math.round(weeklyGrowth * 100) / 100
          },
          thisMonth: {
            applications: monthlyApplications || 0,
            qualified: qualifiedThisMonth || 0,
            qualificationRate: Math.round(monthlyQualificationRate * 100) / 100,
            growth: Math.round(monthlyGrowth * 100) / 100
          },
          lastMonth: {
            applications: lastMonthApplications || 0
          }
        },
        programs: programStats,
        chartData,
        recentActivity: recentApplications?.map(app => ({
          id: app.id,
          name: `${app.personal_info?.firstName} ${app.personal_info?.lastName}`,
          email: app.personal_info?.email,
          qualified: app.qualification_results?.qualified || false,
          createdAt: app.created_at
        })) || []
      }
    })

  } catch (error) {
    console.error('Statistics error:', error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
}