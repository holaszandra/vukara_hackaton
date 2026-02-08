-- Users table (stores Google SSO profile data)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  google_id     VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  image_url     TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill applications
CREATE TABLE IF NOT EXISTS skill_applications (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creator_slug      VARCHAR(255) NOT NULL DEFAULT 'senamile-zungu',

  -- Profile info (Step 2)
  display_name      VARCHAR(255) NOT NULL,
  resume_filename   VARCHAR(255),
  resume_mimetype   VARCHAR(100),
  resume_data       BYTEA,
  linkedin_url      TEXT,
  portfolio_url     TEXT,
  skill_area        VARCHAR(100) NOT NULL,

  -- Application letter (Step 3)
  application_letter TEXT NOT NULL,

  -- Status tracking
  status            VARCHAR(50) DEFAULT 'pending',
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_skill_applications_user_id ON skill_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_applications_creator ON skill_applications(creator_slug);
CREATE INDEX IF NOT EXISTS idx_skill_applications_status ON skill_applications(status);
