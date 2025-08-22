// pages/api/rates.js - Get current mortgage rates
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch current rates from database
    const { data: rates, error } = await supabase
      .from('mortgage_rates')
      .select('*')
      .eq('is_active', true)
      .order('program_name')

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to fetch rates' })
    }

    // If no rates in database, return default rates
    if (!rates || rates.length === 0) {
      const defaultRates = {
        conventional: {
          excellent: 6.875,
          good: 7.125,
          fair: 7.375,
          poor: 7.750
        },
        fha: {
          excellent: 6.750,
          good: 7.000,
          fair: 7.250,
          poor: 7.625
        },
        va: {
          excellent: 6.625,
          good: 6.875,
          fair: 7.125,
          poor: 7.500
        },
        usda: {
          excellent: 6.750,
          good: 7.000,
          fair: 7.250,
          poor: 7.625
        },
        jumbo: {
          excellent: 7.000,
          good: 7.250,
          fair: 7.500,
          poor: 7.875
        }
      }

      return res.status(200).json({
        success: true,
        rates: defaultRates,
        lastUpdated: new Date().toISOString(),
        source: 'default'
      })
    }

    // Transform database rates to expected format
    const formattedRates = {}
    
    rates.forEach(rate => {
      if (!formattedRates[rate.program_name]) {
        formattedRates[rate.program_name] = {}
      }
      formattedRates[rate.program_name][rate.credit_tier] = rate.rate
    })

    res.status(200).json({
      success: true,
      rates: formattedRates,
      lastUpdated: rates[0]?.updated_at || new Date().toISOString(),
      source: 'database'
    })

  } catch (error) {
    console.error('Rates API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}