import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://eykblnegsjeqqroxosjp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5a2JsbmVnc2plcXFyb3hvc2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDk4NjUsImV4cCI6MjA3ODA4NTg2NX0.x1EPoU-kduXk-ikEn-9SRLmtqUplg2QLEWXvt2wmoos'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
