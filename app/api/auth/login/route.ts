import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Utilisateur de démonstration
const DEMO_USER = {
  email: "admin@example.com",
  password: "admin123",
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Vérification des identifiants
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      // Créer un cookie d'authentification simple
      cookies().set("admin-auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: "/",
      })

      // Redirection vers le tableau de bord
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    // Redirection vers la page de connexion en cas d'échec
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url))
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return NextResponse.redirect(new URL("/admin/login?error=server", request.url))
  }
}

