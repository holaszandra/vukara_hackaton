-- Donations table for tracking financial contributions
CREATE TABLE IF NOT EXISTS donations (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  creator_slug    VARCHAR(255) NOT NULL DEFAULT 'senamile-zungu',

  -- Donor info (for guests or signed-in)
  donor_name      VARCHAR(255),
  donor_email     VARCHAR(255),
  is_guest        BOOLEAN NOT NULL DEFAULT FALSE,

  -- Donation details
  amount_cents    INTEGER NOT NULL,
  currency        VARCHAR(3) NOT NULL DEFAULT 'EUR',
  frequency       VARCHAR(10) NOT NULL DEFAULT 'one-time',
  is_public       BOOLEAN NOT NULL DEFAULT FALSE,

  -- Status tracking (prototype: always 'completed')
  status          VARCHAR(50) NOT NULL DEFAULT 'completed',
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_creator ON donations(creator_slug);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
