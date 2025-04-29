const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,       // Your Supabase URL (add it to your .env)
    process.env.SUPABASE_SERVICE_KEY // Your Supabase Service Role Key (add it to your .env)
);

module.exports = supabase;
