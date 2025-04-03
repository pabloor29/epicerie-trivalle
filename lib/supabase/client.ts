"use client"

import { createClient } from "@supabase/supabase-js"

// Ces variables d'environnement sont automatiquement disponibles grâce à l'intégration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Création d'un client Supabase côté client (singleton pattern)
let clientInstance: ReturnType<typeof createClient> | null = null

export function getClientSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: "epicerie-auth-token",
      },
    })
  }
  return clientInstance
}

