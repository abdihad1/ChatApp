import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://wkmqzwmcjokszemlcwhk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbXF6d21jam9rc3plbWxjd2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjUwMDYsImV4cCI6MjEwMDIwMTAwNn0.NXpJA-nInLfs7dnizOppPDYApT07DBYNP4je2ff6qD8";

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);