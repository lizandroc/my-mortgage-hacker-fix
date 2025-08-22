-- Supabase Migration: Create all tables for My Mortgage Hacker
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC GRANT SELECT ON TABLES TO anon, authenticated;

-- Users table for applicant information
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table for qualification submissions
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  personal_info JSONB NOT NULL,
  employment JSONB NOT NULL,
  financial JSONB NOT NULL,
  property JSONB NOT NULL,
  qualification_results JSONB NOT NULL,
  admin_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table for detailed property information
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  property_value DECIMAL(12,2) NOT NULL,
  loan_amount DECIMAL(12,2) NOT NULL,
  down_payment DECIMAL(12,2) NOT NULL,
  ltv_ratio DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mortgage rates table for current rates by program and credit tier
CREATE TABLE IF NOT EXISTS mortgage_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_name VARCHAR(50) NOT NULL,
  credit_tier VARCHAR(20) NOT NULL,
  rate DECIMAL(5,3) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- State costs table for property tax and insurance rates
CREATE TABLE IF NOT EXISTS state_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code VARCHAR(2) UNIQUE NOT NULL,
  state_name VARCHAR(50) NOT NULL,
  property_tax_rate DECIMAL(6,4) NOT NULL,
  home_insurance_rate DECIMAL(6,4) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table for dashboard access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin notes table for application notes
CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  note TEXT NOT NULL,
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application exports table for tracking exports
CREATE TABLE IF NOT EXISTS application_exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  export_type VARCHAR(20) NOT NULL,
  exported_by VARCHAR(255),
  recipient_email VARCHAR(255),
  exported_at TIMESTAMPTZ DEFAULT NOW()
);

-- System configuration table for app settings
CREATE TABLE IF NOT EXISTS system_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting table for API protection
CREATE TABLE IF NOT EXISTS rate_limiting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance logs table for audit trail
CREATE TABLE IF NOT EXISTS compliance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_identifier VARCHAR(255),
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_admin_status ON applications(admin_status);
CREATE INDEX IF NOT EXISTS idx_properties_application_id ON properties(application_id);
CREATE INDEX IF NOT EXISTS idx_mortgage_rates_program_tier ON mortgage_rates(program_name, credit_tier);
CREATE INDEX IF NOT EXISTS idx_mortgage_rates_active ON mortgage_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_notes_application_id ON admin_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_event_type ON compliance_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_timestamp ON compliance_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_identifier ON rate_limiting(identifier, action);

-- Insert default mortgage rates
INSERT INTO mortgage_rates (program_name, credit_tier, rate) VALUES
('conventional', 'excellent', 6.875),
('conventional', 'good', 7.125),
('conventional', 'fair', 7.375),
('conventional', 'poor', 7.750),
('fha', 'excellent', 6.750),
('fha', 'good', 7.000),
('fha', 'fair', 7.250),
('fha', 'poor', 7.625),
('va', 'excellent', 6.625),
('va', 'good', 6.875),
('va', 'fair', 7.125),
('va', 'poor', 7.500),
('usda', 'excellent', 6.750),
('usda', 'good', 7.000),
('usda', 'fair', 7.250),
('usda', 'poor', 7.625),
('jumbo', 'excellent', 7.000),
('jumbo', 'good', 7.250),
('jumbo', 'fair', 7.500),
('jumbo', 'poor', 7.875)
ON CONFLICT (id) DO NOTHING;

-- Insert state cost data (sample for major states)
INSERT INTO state_costs (state_code, state_name, property_tax_rate, home_insurance_rate) VALUES
('CA', 'California', 0.0075, 0.0035),
('TX', 'Texas', 0.0181, 0.0045),
('FL', 'Florida', 0.0098, 0.0055),
('NY', 'New York', 0.0124, 0.0040),
('PA', 'Pennsylvania', 0.0154, 0.0038),
('IL', 'Illinois', 0.0228, 0.0042),
('OH', 'Ohio', 0.0157, 0.0040),
('GA', 'Georgia', 0.0092, 0.0048),
('NC', 'North Carolina', 0.0084, 0.0045),
('MI', 'Michigan', 0.0162, 0.0041),
('NJ', 'New Jersey', 0.0249, 0.0035),
('VA', 'Virginia', 0.0087, 0.0038),
('WA', 'Washington', 0.0094, 0.0040),
('AZ', 'Arizona', 0.0066, 0.0048),
('MA', 'Massachusetts', 0.0141, 0.0045),
('TN', 'Tennessee', 0.0064, 0.0050),
('IN', 'Indiana', 0.0086, 0.0042),
('MO', 'Missouri', 0.0097, 0.0048),
('MD', 'Maryland', 0.0111, 0.0040),
('WI', 'Wisconsin', 0.0194, 0.0038),
('CO', 'Colorado', 0.0060, 0.0045),
('MN', 'Minnesota', 0.0113, 0.0041),
('SC', 'South Carolina', 0.0057, 0.0052),
('AL', 'Alabama', 0.0041, 0.0055),
('LA', 'Louisiana', 0.0055, 0.0065),
('KY', 'Kentucky', 0.0086, 0.0048),
('OR', 'Oregon', 0.0087, 0.0042),
('OK', 'Oklahoma', 0.0090, 0.0058),
('CT', 'Connecticut', 0.0208, 0.0038),
('UT', 'Utah', 0.0061, 0.0045),
('IA', 'Iowa', 0.0159, 0.0040),
('NV', 'Nevada', 0.0084, 0.0045),
('AR', 'Arkansas', 0.0062, 0.0055),
('MS', 'Mississippi', 0.0081, 0.0062),
('KS', 'Kansas', 0.0141, 0.0048),
('NM', 'New Mexico', 0.0080, 0.0050),
('NE', 'Nebraska', 0.0176, 0.0045),
('WV', 'West Virginia', 0.0059, 0.0048),
('ID', 'Idaho', 0.0069, 0.0042),
('HI', 'Hawaii', 0.0030, 0.0035),
('NH', 'New Hampshire', 0.0218, 0.0038),
('ME', 'Maine', 0.0133, 0.0040),
('RI', 'Rhode Island', 0.0149, 0.0042),
('MT', 'Montana', 0.0083, 0.0048),
('DE', 'Delaware', 0.0062, 0.0040),
('SD', 'South Dakota', 0.0135, 0.0050),
('ND', 'North Dakota', 0.0098, 0.0045),
('AK', 'Alaska', 0.0113, 0.0038),
('VT', 'Vermont', 0.0189, 0.0040),
('WY', 'Wyoming', 0.0062, 0.0048)
ON CONFLICT (state_code) DO NOTHING;

-- Insert system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('app_name', 'My Mortgage Hacker', 'Application name'),
('company_name', 'MyMortgageHackers LLC', 'Company name'),
('nmls_id', '12345', 'NMLS license number'),
('contact_email', 'support@mymortgagehacker.com', 'Contact email'),
('contact_phone', '(555) 123-4567', 'Contact phone number'),
('max_applications_per_day', '10', 'Maximum applications per IP per day'),
('qualification_cache_hours', '24', 'Hours to cache qualification results')
ON CONFLICT (config_key) DO NOTHING;

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limiting ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for rates and state costs
CREATE POLICY "Allow public read access to mortgage_rates" ON mortgage_rates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to state_costs" ON state_costs
  FOR SELECT USING (true);

-- Allow public insert for applications (anonymous users can apply)
CREATE POLICY "Allow public insert to applications" ON applications
  FOR INSERT WITH CHECK (true);

-- Allow public insert to users (for application creation)
CREATE POLICY "Allow public insert to users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow public insert to properties (for application creation)
CREATE POLICY "Allow public insert to properties" ON properties
  FOR INSERT WITH CHECK (true);

-- Allow public insert to compliance_logs (for audit trail)
CREATE POLICY "Allow public insert to compliance_logs" ON compliance_logs
  FOR INSERT WITH CHECK (true);

-- Allow public insert to application_exports (for tracking exports)
CREATE POLICY "Allow public insert to application_exports" ON application_exports
  FOR INSERT WITH CHECK (true);

-- Service role has full access to all tables
CREATE POLICY "Service role has full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to applications" ON applications
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to properties" ON properties
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to admin_notes" ON admin_notes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to system_config" ON system_config
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to rate_limiting" ON rate_limiting
  FOR ALL USING (auth.role() = 'service_role');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mortgage_rates_updated_at BEFORE UPDATE ON mortgage_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_state_costs_updated_at BEFORE UPDATE ON state_costs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();