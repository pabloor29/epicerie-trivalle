import { NextResponse } from "next/server"
import { initializeStorage, PRODUCT_IMAGES_BUCKET } from "@/lib/supabase/storage"

export async function GET() {
  try {
    await initializeStorage()

    return NextResponse.json({
      success: true,
      message: `Bucket ${PRODUCT_IMAGES_BUCKET} initialisé avec succès`,
    })
  } catch (error) {
    console.error("Erreur lors de l'initialisation du stockage:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de l'initialisation du stockage",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

