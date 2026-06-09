-- Admin-account: test@test.nl / admin1234
-- Voer uit in Supabase Dashboard → SQL Editor → Run

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'test@test.nl';

INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'test@test.nl'
ON CONFLICT (user_id) DO NOTHING;
