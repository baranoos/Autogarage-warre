-- Autogarage Warre – Supabase schema (PRODUCTIE)
-- Stap 1: plak dit in de Supabase SQL Editor en klik "Run"
-- Stap 2: maak een admin-gebruiker aan via:
--         Dashboard → Authentication → Users → "Add user" (geen uitnodiging)
--         Gebruik het e-mailadres en wachtwoord waarmee je in /admin/login wilt inloggen

-- ============================================================
-- Tabel: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  price_ex_vat NUMERIC(10,2),
  description TEXT,
  long_description TEXT,
  features TEXT[],
  stock TEXT NOT NULL DEFAULT 'op-voorraad',
  image TEXT,
  specs JSONB DEFAULT '{}',
  rating NUMERIC(3,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Iedereen mag producten LEZEN (websitebezoekers)
CREATE POLICY "Publiek kan producten lezen"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Alleen ingelogde admins mogen producten AANMAKEN
CREATE POLICY "Admins kunnen producten aanmaken"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Alleen ingelogde admins mogen producten BIJWERKEN
CREATE POLICY "Admins kunnen producten bijwerken"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Alleen ingelogde admins mogen producten VERWIJDEREN
CREATE POLICY "Admins kunnen producten verwijderen"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Voorbeelddata (12 producten)
-- ============================================================
INSERT INTO products (id, name, category, price, price_ex_vat, description, long_description, features, stock, image, specs, rating, review_count)
VALUES

('momentsleutel-pro-series', 'Momentsleutel Pro-Series', 'Handgereedschap', 149.95, 123.93,
 'Gekalibreerde momentsleutel met digitale aflezing voor uiterste precisie.',
 'De Momentsleutel Pro-Series is ontwikkeld voor de veeleisende professional die geen concessies doet aan precisie. Met een bereik van 20-200 Nm en een nauwkeurigheid van 3% is dit instrument onmisbaar in elke professionele werkplaats.',
 ARRAY['Digitale LCD-aflezing met backlight', '72-tands ratel voor nauwkeurig werk', 'CrV chroomvanadiuumstaal kwaliteit', 'Klikfunctie bij bereikt koppel'],
 'op-voorraad', 'https://picsum.photos/seed/wrench11/800/600',
 '{"Materiaal": "CrV Staal", "Bereik": "20-200 Nm", "Aandrijving": "1/2 inch", "Gewicht": "850 g", "Nauwkeurigheid": "3%"}'::jsonb,
 4.7, 89),

('slagmoersleutel-18v-xr', 'Slagmoersleutel 18V XR', 'Elektrisch', 289.00, 238.84,
 'Krachtige accugedreven slagmoersleutel met maximaal 450 Nm koppel.',
 'De Slagmoersleutel 18V XR is de keuze voor snelle en krachtige bevestigingen. Met 3 instelbare krachtstanden en een maximaal koppel van 450 Nm is dit de standaard van elke professionele monteur.',
 ARRAY['450 Nm maximaal koppel', '3 krachtstanden instelbaar', 'LED werkverlichting ingebouwd', '18V Li-Ion technologie'],
 'op-voorraad', 'https://picsum.photos/seed/drill18v/800/600',
 '{"Voltage": "18V", "Koppel": "450 Nm", "Snelheid": "2400 rpm", "Gewicht": "1.8 kg", "Accu": "5.0 Ah"}'::jsonb,
 4.9, 156),

('gereedschapswagen-7-laden', 'Gereedschapswagen 7 Laden', 'Garage', 545.00, 450.41,
 'Robuuste gereedschapswagen met 7 laden en centrale vergrendeling.',
 'Bewaar en vervoer uw gereedschap veilig met deze 7-laden wagon. Glijdende lades met kogellagers, anti-tip systeem en centrale vergrendeling voor maximale veiligheid.',
 ARRAY['Centrale vergrendeling met sleutel', 'Anti-tip beveiligingssysteem', 'Kogellagers in elke lade', 'Maximum belasting 300 kg'],
 'nabestelling', 'https://picsum.photos/seed/toolcart7/800/600',
 '{"Afmetingen": "102x46x100 cm", "Gewicht": "58 kg", "Capaciteit": "300 kg", "Laden": "7 stuks", "Materiaal": "Staal"}'::jsonb,
 4.5, 43),

('pro-series-slagmoersleutel', 'Pro-Series Slagmoersleutel', 'Pneumatisch', 289.00, 238.84,
 'Professionele pneumatische slagmoersleutel voor zwaar gebruik.',
 'Pneumatische slagmoersleutel voor de zware werkplaats met 980 Nm koppel en variabele snelheidsregeling.',
 ARRAY['980 Nm maximaal koppel', 'Variabele snelheidsregeling', 'Dubbelrichting schakelaar', 'Ergonomische rubber grip'],
 'op-voorraad', 'https://picsum.photos/seed/pneum11/800/600',
 '{"Koppel": "980 Nm", "Luchtdruk": "6.2 bar", "Aansluiting": "1/4 inch", "Gewicht": "2.1 kg"}'::jsonb,
 4.6, 71),

('momentsleutel-digitaal', 'Digitale Momentsleutel 1/2 inch', 'Handgereedschap', 145.50, 120.25,
 'Digitale momentsleutel met LCD display voor nauwkeurig aandraaien.',
 'Digitale momentsleutel met LCD backlight display, buzzer bij bereikt koppel en 2% nauwkeurigheid.',
 ARRAY['LCD display met backlight', 'Akoestisch signaal bij bereik', '2% nauwkeurigheid', 'Datageheugen 50 waarden'],
 'laatste-items', 'https://picsum.photos/seed/torq22/800/600',
 '{"Bereik": "10-200 Nm", "Nauwkeurigheid": "2%", "Display": "LCD backlight", "Aandrijving": "1/2 inch"}'::jsonb,
 4.3, 28),

('dopsleutelset-120-delig', 'Dopsleutelset 120-delig', 'Sets', 399.00, 329.75,
 'Complete dopsleutelset met 120 stuks in stevige ABS koffer.',
 'Volledige dopsleutelset voor de professionele monteur, met 120 stuks CrV staal in metrische en inch maten.',
 ARRAY['120 stuks volledig assortiment', 'CrV chroomvanadiuumstaal', 'Foam inlegger voor overzicht', 'Metrisch & inch maten'],
 'op-voorraad', 'https://picsum.photos/seed/sockset1/800/600',
 '{"Stuks": "120", "Materiaal": "CrV Staal", "Maten": "4-32 mm", "Koffer": "ABS plastic"}'::jsonb,
 4.8, 203),

('obdii-master-scanner', 'OBDII Master Scanner Pro', 'Diagnostiek', 1150.00, 950.41,
 'Professionele OBD2 scanner voor alle Europese merken.',
 'De OBDII Master Scanner Pro leest alle foutcodes van Europese voertuigen, toont live data en biedt gratis software updates voor 2 jaar.',
 ARRAY['Compatibel met alle Europese merken', 'Live data stream weergave', 'DTC foutcodes uitlezen en wissen', 'Gratis software updates 2 jaar'],
 'nabestelling', 'https://picsum.photos/seed/scanner11/800/600',
 '{"Protocol": "OBD2/CAN", "Display": "7 inch touchscreen", "Connectiviteit": "WiFi/Bluetooth", "Updates": "Gratis 2 jaar"}'::jsonb,
 4.4, 55),

('led-werklamp', 'Ultra-Bright LED Werklamp', 'Verlichting', 79.00, 65.29,
 'Heldere LED werklamp met 3000 lumen voor werkplaats en buiten.',
 'IP65-gecertificeerde LED werklamp met 3000 lumen output, instelbare kantelarm en gebruik op 230V of accu.',
 ARRAY['3000 lumen lichtopbrengst', 'IP65 stof- en waterdicht', 'Instelbare kantelarm', '230V of accuvoeding'],
 'op-voorraad', 'https://picsum.photos/seed/lamp11/800/600',
 '{"Lumen": "3000 lm", "Kleurtemperatuur": "6500 K", "IP": "IP65", "Levensduur": "50.000 uur"}'::jsonb,
 4.5, 67),

('hydraulische-krik-3t', 'Lage Hydraulische Krik 3T', 'Hefgereedschap', 225.00, 185.95,
 'Lage profiel hydraulische krik voor sportwagens.',
 'Hydraulische krik met lage insteekhoogte van 85 mm, geschikt voor sportwagens en laaghangende voertuigen. Capaciteit 3 ton.',
 ARRAY['3 ton hefvermogen', 'Lage insteekhoogte: 85 mm', 'Dubbele pompslag', 'Ingebouwd veiligheidsventiel'],
 'op-voorraad', 'https://picsum.photos/seed/jack3t1/800/600',
 '{"Capaciteit": "3000 kg", "Min. hoogte": "85 mm", "Max. hoogte": "500 mm", "Gewicht": "14 kg"}'::jsonb,
 4.7, 91),

('schroevendraaier-set', 'Precisie Schroevendraaierset', 'Handgereedschap', 54.95, 45.41,
 'Complete precisie schroevendraaierset voor elektrisch werk.',
 '32-delige precisie schroevendraaierset met magnetische S2 staal bits en ergonomische anti-slip greep.',
 ARRAY['32 bits inbegrepen', 'Magnetische precisie bits S2 staal', 'Draaibare top voor precisiewerk', 'Anti-slip rubber grip'],
 'op-voorraad', 'https://picsum.photos/seed/screwdriv1/800/600',
 '{"Stuks": "32 bits", "Materiaal": "S2 Staal", "Grip": "Rubber anti-slip", "Opbergcase": "Inclusief"}'::jsonb,
 4.6, 144),

('silent-compressor-50l', 'Silent Air Compressor 50L', 'Pneumatisch', 649.00, 536.36,
 'Geluidsarme compressor voor continu gebruik in de werkplaats.',
 'Olievrije compressor met 50 liter tank, slechts 68 dB geluid en maximaal 8 bar werkdruk voor continu professioneel gebruik.',
 ARRAY['50 liter tank', 'Slechts 68 dB geluidsarm', 'Olievrij zuigerpomp', 'Maximaal 8 bar werkdruk'],
 'populair', 'https://picsum.photos/seed/comp501/800/600',
 '{"Tank": "50 liter", "Druk": "8 bar", "Geluidsniveau": "68 dB", "Motorvermogen": "1.5 kW"}'::jsonb,
 4.8, 112),

('hydraulische-hefbrug-4t', 'Hydraulische Hefbrug 4T', 'Hefgereedschap', 2450.00, 2024.79,
 'Professionele 2-koloms hefbrug met automatische vergrendeling. CE gecertificeerd.',
 'De Hydraulische Hefbrug 4T is de keuze voor elke professionele autogarage. Met een hefvermogen van 4 ton, automatische veiligheidsvergrendeling en CE certificering voldoet deze brug aan alle Europese veiligheidsnormen.',
 ARRAY['4 ton hefvermogen', 'CE gecertificeerd conform EN-1493', 'Automatische veiligheidsvergrendeling', 'Ingebouwde LED verlichting'],
 'nabestelling', 'https://picsum.photos/seed/carlift41/800/600',
 '{"Capaciteit": "4000 kg", "Hefhoogte": "1880 mm", "Motorvermogen": "2.2 kW", "Vloerruimte": "320 cm"}'::jsonb,
 4.9, 38)

ON CONFLICT (id) DO NOTHING;
