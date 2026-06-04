-- Autogarage Warre – Supabase Storage setup
-- Voer dit uit in de Supabase SQL Editor (apart van schema.sql)

-- 1. Maak de storage bucket aan
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB max per foto
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Iedereen mag fotos bekijken (publieke webshop)
CREATE POLICY "Publiek kan fotos bekijken"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- 3. Alleen ingelogde admins mogen fotos uploaden
CREATE POLICY "Admins kunnen fotos uploaden"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- 4. Admins mogen fotos vervangen
CREATE POLICY "Admins kunnen fotos bijwerken"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

-- 5. Admins mogen fotos verwijderen
CREATE POLICY "Admins kunnen fotos verwijderen"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
