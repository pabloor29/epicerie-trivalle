// Système d'authentification ultra-simplifié
import { create } from "zustand"

// Utilisateur de démonstration
const DEMO_USER = {
  email: "admin@example.com",
  password: "admin123",
  id: "1",
  role: "admin",
}

interface AuthState {
  user: {
    id: string
    email: string
    role?: string
  } | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// Vérifier si l'utilisateur est déjà connecté dans localStorage
const getInitialState = () => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }

  try {
    const savedAuth = localStorage.getItem("admin-auth")
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth)
      return {
        user: parsed.user,
        isAuthenticated: true,
      }
    }
  } catch (e) {
    console.error("Erreur lors de la lecture de l'état d'authentification:", e)
  }

  return { user: null, isAuthenticated: false }
}

// Création d'un store Zustand simple
export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  login: async (email: string, password: string) => {
    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Vérifier les identifiants
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const user = {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        role: DEMO_USER.role,
      }

      // Sauvegarder dans localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin-auth", JSON.stringify({ user }))
      }

      set({
        user,
        isAuthenticated: true,
      })

      return { success: true }
    }

    return {
      success: false,
      error: "Email ou mot de passe incorrect",
    }
  },

  logout: () => {
    // Supprimer de localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin-auth")
    }

    set({ user: null, isAuthenticated: false })

    // Redirection directe
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  },
}))

// Fonction utilitaire pour vérifier l'authentification
export function isAuthenticated() {
  if (typeof window === "undefined") return false

  try {
    const savedAuth = localStorage.getItem("admin-auth")
    return !!savedAuth
  } catch (e) {
    return false
  }
}

