import { PRODUCT_IMAGES_BUCKET } from "./supabase/storage"

/**
 * Vérifie si une URL d'image est valide et la corrige si nécessaire
 */
export function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) {
    return "/placeholder.svg?height=200&width=200"
  }

  // Si c'est une URL relative (commence par /), la retourner telle quelle
  if (url.startsWith("/") && !url.startsWith("/api/image-proxy/")) {
    return url
  }

  // Si c'est une URL de proxy qui échoue, essayons de revenir à l'URL Supabase directe
  if (url.startsWith("/api/image-proxy/")) {
    // Extraire le chemin du fichier
    const pathParts = url.split("/api/image-proxy/")[1].split("?")[0]

    // Vérifier si nous avons un ID de produit et un nom de fichier
    const parts = pathParts.split("/")
    if (parts.length >= 2) {
      // Construire l'URL Supabase directe
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl) {
        return `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${pathParts}`
      }
    }
  }

  // Essayer de valider l'URL
  try {
    new URL(url)
    return url
  } catch (e) {
    console.error("URL d'image invalide:", url)
    return "/placeholder.svg?height=200&width=200"
  }
}

/**
 * Vérifie si une URL d'image est accessible
 * Cette fonction doit être utilisée côté client uniquement
 */
export async function checkImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * Récupère l'URL publique directe de Supabase pour une image
 */
export function getDirectSupabaseUrl(imagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || !imagePath) {
    return "/placeholder.svg?height=200&width=200"
  }

  return `${supabaseUrl}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${imagePath}`
}

