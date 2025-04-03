import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Ces variables d'environnement sont automatiquement disponibles grâce à l'intégration Supabase
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

// Création d'un client Supabase côté serveur
export const createServerSupabaseClient = () => createClient<Database>(supabaseUrl, supabaseKey)

