-- Table pour stocker les liens magiques
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_magic_links_token_hash ON magic_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_magic_links_user_id ON magic_links(user_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires_at ON magic_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_magic_links_email_unused ON magic_links(email) WHERE NOT used;

-- RLS - Policy pour les API (service role)
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;

-- Pas d'accès direct aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Magic links are not accessible to authenticated users" ON magic_links;
DROP POLICY IF EXISTS "Magic links can be created" ON magic_links;
DROP POLICY IF EXISTS "Magic links can be updated" ON magic_links;

CREATE POLICY "Service role only" 
  ON magic_links
  USING (auth.role() = 'service_role');

-- Fonction pour nettoyer les tokens expiérés
CREATE OR REPLACE FUNCTION cleanup_expired_magic_links()
RETURNS void AS $$
BEGIN
  DELETE FROM magic_links 
  WHERE expires_at < NOW() AND NOT used;
END;
$$ LANGUAGE plpgsql;
