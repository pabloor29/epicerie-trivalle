import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"

// Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const { name, icon } = await request.json()
    const supabase = createServerSupabaseClient()

    // Valider les données
    if (!name) {
      return NextResponse.json({ error: "Le nom de la catégorie est requis" }, { status: 400 })
    }

    // Créer un slug à partir du nom
    const slug = slugify(name)

    // Insérer la catégorie dans la base de données
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        icon,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la création de la catégorie" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la catégorie" }, { status: 500 })
  }
}

// Récupérer toutes les catégories
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 })
  }
}

