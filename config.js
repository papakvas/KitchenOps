// ═══════════════════════════════════════════════════════════════════════════
// KitchenOPS — Configuration
// ═══════════════════════════════════════════════════════════════════════════
// Supabase project credentials. Get these from:
//   Supabase Dashboard → Project Settings → API
//
// NOTE: The anon key is SAFE to expose publicly. It only allows operations
// your Row-Level-Security (RLS) policies permit. Security comes from RLS,
// not from hiding this key. Do NOT put the service_role key here — that one
// is secret and must never reach the browser.
//
// To change projects/credentials later: edit the two values below, then
// bump CACHE_VERSION in sw.js so installed PWAs pick up the new config.
// ═══════════════════════════════════════════════════════════════════════════

window.KITCHENOPS_CONFIG = {
  SUPABASE_URL: 'https://ybpvjnkmubowqukjtjgh.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicHZqbmttdWJvd3F1a2p0amdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDM2MjMsImV4cCI6MjA5NDA3OTYyM30.ZMeBlokB5k6Eg4g-NwvlVGKsjX0w6lvXf0ErFT9fQq0',

  // Set to false to re-enable the 14-day trial gate (see also TRIAL handling
  // in the app + migration_disable_trial.sql on the server side).
  TRIAL_ENABLED: false,
};
