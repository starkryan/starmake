import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://fbsngwybykobnfprgbnc.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZic25nd3lieWtvYm5mcHJnYm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDAwMTksImV4cCI6MjA3MTcxNjAxOX0.Ym7FJGeeI57t9GPB9GAxcqaXonzzOjf6Zk_5db6n0yk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
