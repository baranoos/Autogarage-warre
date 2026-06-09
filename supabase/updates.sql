-- Autogarage Warre – Database updates
-- Voer dit uit in de Supabase SQL Editor (na schema.sql)

-- ============================================================
-- 1. Klantprofielen (gekoppeld aan Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gebruikers zien eigen profiel"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Gebruikers kunnen eigen profiel bijwerken"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiel aanmaken bij registratie"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trigger: maak automatisch een profiel aan bij registratie
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. Product afbeeldingen (meerdere per product)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Iedereen kan productfotos zien"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins kunnen productfotos beheren"
  ON product_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 3. Admins tabel
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Ingelogde gebruikers mogen alleen hun EIGEN admin-status opvragen
CREATE POLICY "Gebruikers kunnen eigen admin status zien"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── Na het aanmaken van de admin-gebruiker via Authentication > Users ───
-- Zoek het UUID van de admin op en voeg hem toe:
--
--   SELECT id, email FROM auth.users WHERE email = 'admin@autogaragewarre.be';
--
--   INSERT INTO admins (user_id)
--   SELECT id FROM auth.users WHERE email = 'admin@autogaragewarre.be';

-- ============================================================
-- 4. Reviews (klanten)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Iedereen kan reviews lezen"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Ingelogde klanten kunnen review schrijven"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Klanten kunnen eigen review aanpassen"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Klanten kunnen eigen review verwijderen"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
