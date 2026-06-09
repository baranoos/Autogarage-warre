import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const i = trimmed.indexOf("=");
      if (i === -1) continue;
      const key = trimmed.slice(0, i).trim();
      const value = trimmed.slice(i + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local is optional if vars are already exported
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL ?? "test@test.nl";
const password = process.env.ADMIN_PASSWORD ?? "admin1234";

if (!url || !serviceRoleKey) {
  console.error(
    "Ontbrekende omgevingsvariabelen. Voeg toe aan .env.local:\n" +
      "  NEXT_PUBLIC_SUPABASE_URL=...\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=...  (Supabase Dashboard → Settings → API → service_role)"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: listData } = await supabase.auth.admin.listUsers();
const existing = listData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

let userId = existing?.id;

if (!userId) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Gebruiker aanmaken mislukt:", error.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log("Gebruiker aangemaakt:", email);
} else {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Gebruiker bijwerken mislukt:", error.message);
    process.exit(1);
  }
  console.log("Bestaande gebruiker bijgewerkt:", email);
}

const { error: adminError } = await supabase.from("admins").upsert({ user_id: userId });
if (adminError) {
  console.error("Admin-rechten toekennen mislukt:", adminError.message);
  process.exit(1);
}

console.log("Admin-account klaar.");
console.log("  E-mail:  ", email);
console.log("  Wachtwoord:", password);
console.log("  Login:   /admin/login");
