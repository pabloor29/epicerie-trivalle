"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getClientSupabaseClient()

  // Fonction pour charger l'utilisateur
  const loadUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setUser(null)
        return
      }

      // Utilisateur simple sans profil pour simplifier
      setUser({
        id: session.user.id,
        email: session.user.email || "",
      })
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Charger l'utilisateur au démarrage
    loadUser()

    // Configurer l'écouteur d'événements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      await loadUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erreur de connexion:", error)
        return { success: false, error }
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
        })
        return { success: true, error: null }
      }

      return { success: false, error: "Aucun utilisateur retourné" }
    } catch (error) {
      console.error("Exception lors de la connexion:", error)
      return { success: false, error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }

  return context
}

