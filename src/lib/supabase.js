import { createClient } from  ' @supabase/supabase-js'

export const supabase = createClient(
    "https://jndbqguouxqbvxbgbxqq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZGJxZ3VvdXhxYnZ4YmdieHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA4ODY5OTUsImV4cCI6MTk5NjQ2Mjk5NX0.IQonH3PK-NTcctbaddm9JCpSzLnnPCGNniXqiS8iKVU")