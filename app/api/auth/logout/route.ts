import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Supprimer le cookie d'authentification
  cookies().delete("admin-auth")

  // Redirection vers la page d'accueil
  return NextResponse.redirect(new URL("/", request.url))
}

