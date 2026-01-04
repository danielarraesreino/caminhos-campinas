import { createClient } from "@supabase/supabase-js";

// Use environment variables or fallback for build safety
// In production, these MUST be set in .env.local
const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey);
