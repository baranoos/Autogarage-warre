-- ============================================================
--  Volledige productupdate: afbeeldingen + beschrijvingen
--  Voer uit in Supabase SQL Editor
-- ============================================================

-- Stap 1: Verwijder oude gallery-afbeeldingen zodat de
-- hoofd-image (products.image) gebruikt wordt
DELETE FROM product_images
WHERE product_id IN (SELECT id FROM products);

-- ============================================================
--  Pro-Series Slagmoersleutel
-- ============================================================
UPDATE products SET
  image            = '/Pro-Series Slagmoersleute.png',
  description      = 'Krachtige pneumatische slagmoersleutel met 900 Nm koppel. Ideaal voor snel wisselen van wielen en zwaar onderhoud in de werkplaats.',
  long_description = 'De Pro-Series Slagmoersleutel is gebouwd voor intensief professioneel gebruik. Met een maximumkoppel van 900 Nm verwijdert u de zwaarste wielmoeren in enkele seconden. De twin-hammer slagmechanisme zorgt voor krachtige en consistente slagen, terwijl het composietbehuizing het gewicht beperkt tot slechts 2,1 kg. Ergonomisch gevormd handvat met anti-slipprofiel vermindert de vermoeidheid bij langdurig gebruik.',
  features         = ARRAY[
    '900 Nm maximumkoppel',
    '1/2" vierkante aansluiting',
    'Twin hammer slagmechanisme',
    'Voorwaarts en achterwaarts rotatie',
    'Ergonomisch antislip handvat',
    'Duurzame composietbehuizing'
  ],
  specs = '{
    "Koppel": "900 Nm",
    "Aansluiting": "1/2 inch",
    "Luchtdruk": "6,2 bar",
    "Luchtverbruik": "185 l/min",
    "Gewicht": "2,1 kg",
    "Slagmechanisme": "Twin hammer"
  }'::jsonb
WHERE name ILIKE '%slagmoer%';

-- ============================================================
--  Digitale Momentsleutel 1/2"
-- ============================================================
UPDATE products SET
  image            = '/Digitale Momentsleutel 0.5.png',
  description      = 'Professionele digitale momentsleutel met LCD-display voor nauwkeurige torquewaarden van 10 tot 200 Nm. Signaleert hoorbaar en visueel zodra het ingestelde moment bereikt is.',
  long_description = 'Precisie is essentieel bij het aandraaien van wielbouten, koppakkingen en motoronderdelen. De Digitale Momentsleutel registreert het exact ingestelde koppel via het LCD-display en geeft een dubbel signaal — LED én geluid — zodra de doelwaarde bereikt is. Inclusief kalibratieattest voor gebruik in gecertificeerde werkplaatsen.',
  features         = ARRAY[
    'Nauwkeurigheid ±2%',
    'Bereik 10 tot 200 Nm',
    'Hoorbaar en visueel signaalsysteem',
    'Geheugen voor 10 instelwaarden',
    'Inclusief kalibratieattest',
    '1/2" vierkante aansluiting'
  ],
  specs = '{
    "Torquebereik": "10–200 Nm",
    "Nauwkeurigheid": "±2%",
    "Aansluiting": "1/2 inch",
    "Display": "LCD digitaal",
    "Batterij": "2× AAA",
    "Gewicht": "0,9 kg"
  }'::jsonb
WHERE name ILIKE '%momentsleutel%';

-- ============================================================
--  Dopsleutelset 120-delig
-- ============================================================
UPDATE products SET
  image            = '/Dopsleutelset 120-delig.png',
  description      = 'Complete 120-delige dopsleutelset in robuuste koffer. Chroom-vanadium staal voor maximale duurzaamheid, metrisch en imperiaal assortiment.',
  long_description = 'Met 120 stuks in één stevige koffer heeft u altijd het juiste gereedschap bij de hand. De set bevat diepe en ondiepe doppen in metrische (6–32 mm) en imperiale maten, verlengstukken, hoekstukken en een snelspanner. Vervaardigd uit gehard chroom-vanadium staal met satijnen chroomafwerking die corrosie tegengaat.',
  features         = ARRAY[
    '120 stuks volledig assortiment',
    'Chroom-Vanadium staal (CrV)',
    'Metrisch én imperiaal',
    'Inclusief 1/4, 3/8 en 1/2 inch aandrijving',
    'Stevige kunststof opbergkoffer',
    'Levenslange garantie tegen materiaalfouten'
  ],
  specs = '{
    "Aantal onderdelen": "120 stuks",
    "Materiaal": "Chroom-Vanadium staal",
    "Aandrijving": "1/4, 3/8 en 1/2 inch",
    "Dopsreeks metrisch": "6–32 mm",
    "Oppervlak": "Satijn verchroomd",
    "Hardheid": "HRC 40–45"
  }'::jsonb
WHERE name ILIKE '%dopsleutelset%';

-- ============================================================
--  OBDII Master Scanner Pro
-- ============================================================
UPDATE products SET
  image            = '/DiagnostiekOBDII Master Scanner Pro.png',
  description      = 'Geavanceerde OBD-II diagnosescanner voor alle voertuigen. Leest en wist foutcodes, meet live sensordata en ondersteunt ABS- en airbagdiagnose.',
  long_description = 'De OBDII Master Scanner Pro is een all-in-one diagnosesysteem voor de professionele werkplaats. Via het 7-inch touchscreen werkt u snel en intuïtief. Wi-Fi-updates zorgen ervoor dat u altijd de nieuwste voertuigmodellen ondersteunt. Naast standaard OBD-II functies ondersteunt de scanner ook uitgebreide systeemdiagnose: ABS, airbag, transmissie en klimaatregeling.',
  features         = ARRAY[
    'Compatibel met alle OBD-II / EOBD voertuigen',
    'Live sensordata op grafiek of tabel',
    'DTC foutcodes lezen, wissen en registreren',
    'ABS- en airbagdiagnose',
    'Automatische voertuigidentificatie via VIN',
    'Online updates via Wi-Fi'
  ],
  specs = '{
    "Protocol": "OBD-II / EOBD / CAN",
    "Display": "7 inch TFT touchscreen",
    "Verbinding": "USB, Wi-Fi, Bluetooth",
    "Talen": "NL, FR, EN, DE",
    "Update": "Online via Wi-Fi",
    "Garantie": "2 jaar"
  }'::jsonb
WHERE name ILIKE '%obdii%' OR name ILIKE '%obd%scanner%' OR name ILIKE '%master scanner%';

-- ============================================================
--  Ultra-Bright LED Werklamp
-- ============================================================
UPDATE products SET
  image            = '/Ultra-Bright LED werklamp.png',
  description      = 'Oplaadbare LED-werklamp met 2000 lumen, magnetische voet en flexibele ophanghaak. Draadloos en spatwaterdicht voor gebruik in elke werkplaats.',
  long_description = 'De Ultra-Bright LED Werklamp biedt met 2000 lumen uitzonderlijk veel licht op elke werkplek. De ingebouwde magneet maakt bevestiging op carrosserie of metalen oppervlakken eenvoudig, terwijl de haak hem overal ophangbaar maakt. Drie verlichtingsmodi (vol / eco / stroboscoop) en een looptijd tot 8 uur maken hem de ideale metgezel voor nacht- en weekendwerken.',
  features         = ARRAY[
    '2000 lumen maximale helderheid',
    'Magnetische voet voor handsfree gebruik',
    'Drie verlichtingsmodi',
    'Draadloos oplaadbaar via USB-C',
    'IP54 spatwaterdicht',
    'Tot 8 uur autonomie'
  ],
  specs = '{
    "Lichtopbrengst": "2000 lumen",
    "Batterijcapaciteit": "4000 mAh lithium-ion",
    "Autonomie": "Tot 8 uur (eco-modus)",
    "Oplaadtijd": "3 uur via USB-C",
    "Beschermingsklasse": "IP54",
    "Gewicht": "0,6 kg"
  }'::jsonb
WHERE name ILIKE '%led%lamp%' OR name ILIKE '%werklamp%';

-- ============================================================
--  Lage Hydraulische Krik 3T
-- ============================================================
UPDATE products SET
  image            = '/Lage Hydraulische Krik 3T Hefgereedsschap.png',
  description      = 'Professionele lage hydraulische krik met 3 ton hefvermogen en minimale inrijhoogte van 85 mm. Geschikt voor sportieve en laaggebouwde voertuigen.',
  long_description = 'Met een minimale inrijhoogte van slechts 85 mm rijdt deze krik moeiteloos onder de laagste sportwagens. Het ingebouwde overdrukventiel en veiligheidsvergrendeling beschermen u en uw voertuig bij elke hefbeurt. Robuuste staalconstructie met draaiwielen aan voor- en achterkant voor optimale manoeuvreerbaarheid in de werkplaats.',
  features         = ARRAY[
    '3 ton hefvermogen',
    'Minimale inrijhoogte: 85 mm',
    'Maximale hefhoogte: 500 mm',
    'Veiligheidsovertredingsklep',
    'Zwenkwielen voor makkelijke manoeuvreerbaarheid',
    'Gesmeed stalen constructie'
  ],
  specs = '{
    "Hefvermogen": "3 ton",
    "Min. inrijhoogte": "85 mm",
    "Max. hefhoogte": "500 mm",
    "Hefbereik": "415 mm",
    "Gewicht": "12 kg",
    "Materiaal": "Gesmeed staal"
  }'::jsonb
WHERE name ILIKE '%krik%';

-- ============================================================
--  Precisie Schroevendraaierset
-- ============================================================
UPDATE products SET
  image            = '/Precisie Schroevendraaierset.png',
  description      = 'Complete set van 12 precisie-schroevendraaiers in S2-gereedschapsstaal, met magnetische tips. Ideaal voor elektronica, fijnmechaniek en horlogewerk.',
  long_description = 'Fijnmechanisch werk vraagt om gereedschap dat even precies is als de taak zelf. De 12-delige precisieset bevat schroevendraaiers voor elk gangbaar schroeftype: plat, Phillips, Torx en Pozidriv. Ergonomische bi-materiaal handgrepen met anti-rolfunctie zorgen voor comfort bij langdurig gebruik. Elke tip is magnetisch voor betere controle.',
  features         = ARRAY[
    '12-delig volledig assortiment',
    'S2 gereedschapsstaal voor maximale hardheid',
    'Magnetische tips',
    'Anti-rol ontwerp',
    'Bi-materiaal ergonomische handgrepen',
    'Plat, Phillips, Torx en Pozidriv bits'
  ],
  specs = '{
    "Aantal": "12 stuks",
    "Materiaal bit": "S2 gereedschapsstaal",
    "Bittypen": "Plat, Phillips, Torx, Pozidriv",
    "Handgreep": "Bi-materiaal rubber",
    "Magneetsterkte": "≥10 mT",
    "Schachtlengte": "75–150 mm"
  }'::jsonb
WHERE name ILIKE '%schroevendraaier%';

-- ============================================================
--  Silent Air Compressor 50L
-- ============================================================
UPDATE products SET
  image            = '/Silent Air Compressor 50L.png',
  description      = 'Fluisterstille 50-liter olievrije compressor voor intensief werkplaatsgebruik. Slechts 59 dB(A) en onderhoudsvrije pomp voor dagelijks professioneel gebruik.',
  long_description = 'De Silent Air Compressor onderscheidt zich door zijn exceptioneel laag geluidsniveau van slechts 59 dB(A) — aangenaam voor langdurig gebruik in gesloten werkplaatsen. De olievrije pomp vereist geen periodieke olieverversing en levert altijd schone, olievrije lucht. Geschikt voor pneumatisch gereedschap, spuitpistolen en bandenservice.',
  features         = ARRAY[
    'Slechts 59 dB(A) geluidsniveau',
    '50 liter tankinhoud',
    'Olievrije pomp (onderhoudsvrij)',
    'Maximale druk 8 bar',
    'Thermische overbelastingsbeveiliging',
    'Twee snelkoppelingen'
  ],
  specs = '{
    "Tankinhoud": "50 liter",
    "Max. druk": "8 bar",
    "Geluidsniveau": "59 dB(A)",
    "Motorvermogen": "1,5 kW",
    "Debiet": "180 l/min",
    "Gewicht": "28 kg"
  }'::jsonb
WHERE name ILIKE '%compressor%' OR name ILIKE '%silent air%';

-- ============================================================
--  Hydraulische Hefbrug 4T
-- ============================================================
UPDATE products SET
  image            = '/image.png',
  description      = 'Professionele hydraulische hefbrug met 4 ton hefvermogen. Ideaal voor personenwagens en lichte bedrijfsvoertuigen in de professionele werkplaats.',
  long_description = 'De Hydraulische Hefbrug 4T is gebouwd voor intensief dagelijks gebruik in de professionele garage. Met een hefvermogen van 4 ton tilt u eenvoudig personenwagens en lichte bestelwagens op voor onderhoud, remwerk en uitlaatreparaties. Het dubbele veiligheidssysteem met mechanische vergrendeling zorgt voor maximale veiligheid bij elk gebruik.',
  features         = ARRAY[
    '4 ton hefvermogen',
    'Dubbele mechanische veiligheidsvergrendeling',
    'Verstelbare hefpunten voor alle voertuigtypes',
    'Automatische gelijkloopregeling',
    'Elektrisch-hydraulische bediening',
    'Laag rijprofiel voor lage voertuigen'
  ],
  specs = '{
    "Hefvermogen": "4 ton",
    "Min. rijhoogte": "100 mm",
    "Max. hefhoogte": "1900 mm",
    "Motorvermogen": "2,2 kW",
    "Spanning": "400V / 3-fase",
    "Gewicht": "580 kg"
  }'::jsonb
WHERE name ILIKE '%hefbrug%';

-- ============================================================
--  Momentsleutel Pro-Series
-- ============================================================
UPDATE products SET
  image            = '/Pro momentsleutel.webp',
  description      = 'Professionele Pro-Series momentsleutel met klikdempingsmechanisme en ergonomisch handvat. Nauwkeurig torque van 40 tot 210 Nm voor zwaar werkplaatsgebruik.',
  long_description = 'De Momentsleutel Pro-Series is ontworpen voor de veeleisende werkplaatsprofessional. Het klikdempingsmechanisme geeft een duidelijk hoorbaar én voelbaar signaal op het ingestelde koppel, waarna de sleutel automatisch vrijloopt om overtorque te voorkomen. De schaalverdeling is dubbelzijdig leesbaar — zowel in Nm als ft-lb. Inclusief bewaarkoffer en kalibratieattest.',
  features         = ARRAY[
    'Bereik 40–210 Nm',
    'Nauwkeurigheid ±3%',
    'Klikdempingsmechanisme met automatische vrijloop',
    'Schaalverdeling in Nm en ft-lb',
    'Ergonomisch bi-materiaal handvat',
    'Inclusief bewaarkoffer en kalibratieattest'
  ],
  specs = '{
    "Torquebereik": "40–210 Nm",
    "Nauwkeurigheid": "±3%",
    "Aansluiting": "1/2 inch",
    "Schaalindeling": "2 Nm",
    "Lengte": "450 mm",
    "Gewicht": "1,1 kg"
  }'::jsonb
WHERE name ILIKE '%pro-series%' AND name ILIKE '%momentsleutel%';

-- ============================================================
--  Slagmoersleutel 18V XR
-- ============================================================
UPDATE products SET
  image            = '/Slagmoersleutel.png',
  description      = 'Krachtige 18V accu-slagmoersleutel uit de XR-serie met 400 Nm koppel en borstelloze motor. Compact, licht en ideaal voor wisselen van wielen en chassiswerk.',
  long_description = 'De Slagmoersleutel 18V XR combineert het maximale koppel van een pneumatische sleutel met het gemak van een accusysteem. De borstelloze motor levert meer vermogen, minder hitte en een langere levensduur. Drie koppelmodi (laag / normaal / hoog) maken hem geschikt voor zowel delicaat als zwaar werk. Compatibel met alle 18V XR accu-platformen.',
  features         = ARRAY[
    '400 Nm maximumkoppel',
    'Borstelloze motor voor langere levensduur',
    'Drie koppelmodi instelbaar',
    '1/2" vierkante aansluiting',
    'Led werklicht',
    'Compatibel met 18V XR accuplatform'
  ],
  specs = '{
    "Koppel": "400 Nm",
    "Voltage": "18V",
    "Aansluiting": "1/2 inch",
    "Slagen per minuut": "2800/min",
    "Gewicht (zonder accu)": "1,8 kg",
    "Motor": "Borstelloze DC"
  }'::jsonb
WHERE name ILIKE '%18v%' OR name ILIKE '%18 v%xr%';

-- ============================================================
--  Gereedschapwagen 7 laden
-- ============================================================
UPDATE products SET
  image            = '/Gereedschapwagen.png',
  description      = 'Professionele gereedschapwagen met 7 laden en centraal slot. Solide staalconstructie op zwenkwielen voor maximale mobiliteit in de werkplaats.',
  long_description = 'De gereedschapwagen met 7 laden biedt ruimte voor een volledig assortiment professioneel gereedschap. Alle laden zijn voorzien van kogellager-geleiders voor soepel openen en een zachte stop. Het centrale slot beveiligt alle laden tegelijk. De antistatische werkblad bovenkant beschermt gevoelige onderdelen en is eenvoudig schoon te maken. Dankzij de vier 125 mm zwenkwielen — twee met rem — verplaatst u de wagen moeiteloos door de werkplaats.',
  features         = ARRAY[
    '7 laden met kogellager-geleiders',
    'Centraal slot voor alle laden tegelijk',
    'Antistatisch werkblad bovenkant',
    'Vier 125 mm zwenkwielen (2 met rem)',
    'Stalen constructie poedercoat afwerking',
    'Inclusief anti-slip laadmatten'
  ],
  specs = '{
    "Aantal laden": "7",
    "Materiaal": "Koudgewalst staal",
    "Afwerking": "Poedercoat",
    "Wielen": "4× 125 mm zwenkwielen",
    "Slot": "Centraal cilinderslot",
    "Draagvermogen per laad": "25 kg"
  }'::jsonb
WHERE name ILIKE '%gereedschapswagen%' OR name ILIKE '%gereedschap wagen%';

-- ============================================================
--  Master Mechanic Kit (SPECIAL DEAL – nieuw product)
-- ============================================================
INSERT INTO products (id, name, category, price, price_ex_vat, description, long_description, features, stock, image, specs, rating, review_count)
VALUES (
  'master-mechanic-kit',
  'Master Mechanic Kit',
  'Sets',
  349.00,
  288.43,
  'Complete professionele gereedschapsset met slagmoersleutel, momentsleutel en doppenset. Bespaar tot 15% ten opzichte van individuele aankoop.',
  'De Master Mechanic Kit bundelt de drie meest gevraagde tools uit ons assortiment in één voordelig pakket. Inclusief de Pro-Series Slagmoersleutel (900 Nm), de Digitale Momentsleutel en de Dopsleutelset 120-delig. Alles zit in een robuuste draagkoffer — klaar voor dagelijks professioneel gebruik.',
  ARRAY[
    'Pro-Series Slagmoersleutel 900 Nm',
    'Digitale Momentsleutel 10–200 Nm',
    'Dopsleutelset 120-delig (CrV staal)',
    'Robuuste draagkoffer inbegrepen',
    'Bespaar 15% t.o.v. individuele aankoop',
    'Ideaal als starterskit of cadeau'
  ],
  'populair',
  '/Special deal. Master Mechanic Kit. Bespaar tot 15% op complete sets..png',
  '{
    "Inhoud": "3 tools + koffer",
    "Slagmoersleutel": "900 Nm / 1/2 inch",
    "Momentsleutel": "10–200 Nm",
    "Doppenset": "120-delig CrV",
    "Korting": "15% t.o.v. los",
    "Garantie": "2 jaar"
  }'::jsonb,
  4.9,
  38
)
ON CONFLICT (id) DO UPDATE SET
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  features = EXCLUDED.features,
  specs = EXCLUDED.specs;

-- ============================================================
--  Controleer resultaat
-- ============================================================
SELECT name, category, price, image, description
FROM products
ORDER BY name;
