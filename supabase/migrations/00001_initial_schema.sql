-- ============================================
-- CompliPilot — Initial Schema & RLS Policies
-- ============================================

-- === ENUMS ===

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE org_plan AS ENUM ('free', 'starter', 'growth', 'enterprise');
CREATE TYPE ai_tool_category AS ENUM ('chatbot', 'recruitment', 'scoring', 'content', 'analytics', 'automation', 'other');
CREATE TYPE risk_level AS ENUM ('unacceptable', 'high', 'limited', 'minimal', 'not_assessed');
CREATE TYPE tool_status AS ENUM ('active', 'under_review', 'deprecated', 'blocked');
CREATE TYPE regulation_code AS ENUM ('eu_ai_act', 'gdpr', 'nis2', 'dora');
CREATE TYPE assessment_source AS ENUM ('ai', 'manual', 'auditor');
CREATE TYPE document_type AS ENUM ('impact_assessment', 'transparency_notice', 'technical_doc', 'risk_register', 'bias_audit', 'data_processing_record', 'conformity_declaration', 'custom');
CREATE TYPE document_regulation AS ENUM ('eu_ai_act', 'gdpr', 'nis2', 'dora', 'multi');
CREATE TYPE document_status AS ENUM ('draft', 'review', 'approved', 'expired', 'archived');
CREATE TYPE document_source AS ENUM ('ai', 'manual');
CREATE TYPE check_status AS ENUM ('compliant', 'non_compliant', 'partial', 'not_applicable', 'not_checked');
CREATE TYPE alert_type AS ENUM ('regulation_update', 'deadline_approaching', 'score_dropped', 'document_expired', 'new_requirement', 'tool_risk_changed');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');

-- === TABLES ===

-- 1. Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  industry text,
  country text DEFAULT 'FR',
  employee_count integer,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  plan org_plan DEFAULT 'free',
  plan_period_end timestamptz,
  compliance_score integer DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Profiles (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'member',
  org_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. AI Tools
CREATE TABLE ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  provider text,
  category ai_tool_category DEFAULT 'other',
  description text,
  url text,
  usage_context text,
  data_types_processed text[] DEFAULT '{}',
  user_count integer,
  is_customer_facing boolean DEFAULT false,
  automated_decisions boolean DEFAULT false,
  risk_level risk_level DEFAULT 'not_assessed',
  risk_score integer CHECK (risk_score IS NULL OR (risk_score >= 0 AND risk_score <= 100)),
  last_assessed_at timestamptz,
  status tool_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Risk Assessments
CREATE TABLE risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ai_tool_id uuid NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
  regulation_code regulation_code NOT NULL,
  risk_level risk_level NOT NULL,
  risk_score integer CHECK (risk_score >= 0 AND risk_score <= 100),
  findings jsonb DEFAULT '{}',
  recommendations jsonb DEFAULT '{}',
  assessed_by assessment_source DEFAULT 'ai',
  assessed_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 5. Compliance Documents
CREATE TABLE compliance_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ai_tool_id uuid REFERENCES ai_tools(id) ON DELETE SET NULL,
  title text NOT NULL,
  type document_type NOT NULL,
  regulation document_regulation NOT NULL,
  content jsonb DEFAULT '{}',
  content_markdown text,
  status document_status DEFAULT 'draft',
  version integer DEFAULT 1,
  generated_by document_source DEFAULT 'ai',
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  expires_at timestamptz,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Regulations (reference table — public read)
CREATE TABLE regulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  full_name text,
  jurisdiction text,
  description text,
  effective_date date,
  last_updated date,
  requirements jsonb DEFAULT '[]',
  penalties jsonb DEFAULT '{}',
  source_url text,
  created_at timestamptz DEFAULT now()
);

-- 7. Compliance Checks
CREATE TABLE compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  regulation_id uuid NOT NULL REFERENCES regulations(id) ON DELETE CASCADE,
  ai_tool_id uuid REFERENCES ai_tools(id) ON DELETE SET NULL,
  requirement_key text NOT NULL,
  requirement_label text NOT NULL,
  status check_status DEFAULT 'not_checked',
  evidence text,
  notes text,
  checked_at timestamptz,
  checked_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Alerts
CREATE TABLE alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  severity alert_severity DEFAULT 'info',
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 9. Audit Logs
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- 10. Invitations
CREATE TABLE invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role user_role DEFAULT 'member',
  invited_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status invitation_status DEFAULT 'pending',
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- === INDEXES ===

CREATE INDEX idx_ai_tools_org_id ON ai_tools(org_id);
CREATE INDEX idx_risk_assessments_org_tool ON risk_assessments(org_id, ai_tool_id);
CREATE INDEX idx_documents_org_id ON compliance_documents(org_id);
CREATE INDEX idx_documents_type ON compliance_documents(org_id, type);
CREATE INDEX idx_checks_org_regulation ON compliance_checks(org_id, regulation_id);
CREATE INDEX idx_alerts_org_unread ON alerts(org_id, is_read) WHERE is_read = false;
CREATE INDEX idx_audit_logs_org_date ON audit_logs(org_id, created_at DESC);
CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_invitations_token ON invitations(token);

-- === RLS POLICIES ===

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
-- regulations: public read, no RLS needed

-- Helper: extract org_id from JWT
CREATE OR REPLACE FUNCTION auth.org_id() RETURNS uuid AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid;
$$ LANGUAGE sql STABLE;

-- Organizations: users can only see their own org
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id = auth.org_id());

CREATE POLICY "Users can update own organization"
  ON organizations FOR UPDATE
  USING (id = auth.org_id());

-- Profiles: users can see profiles in their org
CREATE POLICY "Users can view profiles in own org"
  ON profiles FOR SELECT
  USING (org_id = auth.org_id());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- AI Tools: org-scoped
CREATE POLICY "Users can view own org tools"
  ON ai_tools FOR SELECT USING (org_id = auth.org_id());
CREATE POLICY "Users can insert tools in own org"
  ON ai_tools FOR INSERT WITH CHECK (org_id = auth.org_id());
CREATE POLICY "Users can update own org tools"
  ON ai_tools FOR UPDATE USING (org_id = auth.org_id());
CREATE POLICY "Users can delete own org tools"
  ON ai_tools FOR DELETE USING (org_id = auth.org_id());

-- Risk Assessments: org-scoped
CREATE POLICY "Users can view own org assessments"
  ON risk_assessments FOR SELECT USING (org_id = auth.org_id());
CREATE POLICY "Users can insert assessments in own org"
  ON risk_assessments FOR INSERT WITH CHECK (org_id = auth.org_id());

-- Compliance Documents: org-scoped
CREATE POLICY "Users can view own org documents"
  ON compliance_documents FOR SELECT USING (org_id = auth.org_id());
CREATE POLICY "Users can insert documents in own org"
  ON compliance_documents FOR INSERT WITH CHECK (org_id = auth.org_id());
CREATE POLICY "Users can update own org documents"
  ON compliance_documents FOR UPDATE USING (org_id = auth.org_id());
CREATE POLICY "Users can delete own org documents"
  ON compliance_documents FOR DELETE USING (org_id = auth.org_id());

-- Compliance Checks: org-scoped
CREATE POLICY "Users can view own org checks"
  ON compliance_checks FOR SELECT USING (org_id = auth.org_id());
CREATE POLICY "Users can insert checks in own org"
  ON compliance_checks FOR INSERT WITH CHECK (org_id = auth.org_id());
CREATE POLICY "Users can update own org checks"
  ON compliance_checks FOR UPDATE USING (org_id = auth.org_id());

-- Alerts: org-scoped
CREATE POLICY "Users can view own org alerts"
  ON alerts FOR SELECT USING (org_id = auth.org_id());
CREATE POLICY "Users can update own org alerts"
  ON alerts FOR UPDATE USING (org_id = auth.org_id());

-- Audit Logs: org-scoped
CREATE POLICY "Users can view own org audit logs"
  ON audit_logs FOR SELECT USING (org_id = auth.org_id());
CREATE POLICY "Users can insert audit logs in own org"
  ON audit_logs FOR INSERT WITH CHECK (org_id = auth.org_id());

-- Invitations: org-scoped
CREATE POLICY "Users can view own org invitations"
  ON invitations FOR SELECT USING (org_id = auth.org_id());
CREATE POLICY "Users can insert invitations in own org"
  ON invitations FOR INSERT WITH CHECK (org_id = auth.org_id());
CREATE POLICY "Users can update own org invitations"
  ON invitations FOR UPDATE USING (org_id = auth.org_id());

-- Regulations: public read for all authenticated users
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read regulations"
  ON regulations FOR SELECT
  USING (auth.role() = 'authenticated');

-- === TRIGGER: handle_new_user ===
-- Sets org_id in app_metadata when a profile is created/updated

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert a profile row when a new auth user is created
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- === TRIGGER: sync org_id to JWT ===
-- When a profile's org_id is updated, sync it to auth.users app_metadata

CREATE OR REPLACE FUNCTION public.sync_org_id_to_jwt()
RETURNS trigger AS $$
BEGIN
  IF NEW.org_id IS DISTINCT FROM OLD.org_id THEN
    UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('org_id', NEW.org_id)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_org_updated
  AFTER UPDATE OF org_id ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_org_id_to_jwt();

-- === updated_at trigger ===

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_ai_tools_updated_at BEFORE UPDATE ON ai_tools FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_documents_updated_at BEFORE UPDATE ON compliance_documents FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_checks_updated_at BEFORE UPDATE ON compliance_checks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
