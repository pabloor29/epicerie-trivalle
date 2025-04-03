"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth"

interface AuthRedirectProps {
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthRedirect({ requireAuth = true, redirectTo = "/admin/login" }: AuthRedirectProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    // Si l'authentification est requise et que l'utilisateur n'est pas authentifié
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    }

    // Si l'authentification n'est pas requise et que l'utilisateur est authentifié
    if (!requireAuth && isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, requireAuth, redirectTo, router])

  return null
}

