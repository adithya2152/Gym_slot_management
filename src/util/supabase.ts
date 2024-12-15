import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const adminkey  = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!;

console.log("url",process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("anion",process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log("admin key",process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE)

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const admin_supabase = createClient(supabaseUrl, adminkey);

export  {supabase,admin_supabase}
