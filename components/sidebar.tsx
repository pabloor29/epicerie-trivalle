"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Apple,
  Beer,
  Beef,
  ChevronsUpIcon as Cheese,
  Coffee,
  Grape,
  Milk,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBasket,
  Banana,
  Cherry,
  Fish,
  Egg,
  Salad,
  Sandwich,
  Pizza,
  Cake,
  IceCream,
  Candy,
  Popcorn,
  Cookie,
  Croissant,
  Soup,
  Carrot,
  CitrusIcon as Lemon,
  Wheat,
  Wine,
  Utensils,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types"

// Mapping de toutes les icônes disponibles
const iconComponents: Record<string, LucideIcon> = {
  Apple,
  Beer,
  Beef,
  Cheese,
  Coffee,
  Grape,
  Milk,
  ShoppingBasket,
  Banana,
  Cherry,
  Fish,
  Egg,
  Salad,
  Sandwich,
  Pizza,
  Cake,
  IceCream,
  Candy,
  Popcorn,
  Cookie,
  Croissant,
  Soup,
  Carrot,
  Lemon,
  Wheat,
  Wine,
  Utensils,
}

export function Sidebar() {
  // Sidebar rétractée par défaut
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = getClientSupabaseClient()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const currentCategory = searchParams.get("categorie") || "tous"

  // Gestionnaire pour fermer la sidebar lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Charger les catégories depuis Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("categories").select("*").order("name")

        if (error) throw error

        // 👇 conversion propre
        setCategories((data as unknown as Category[]) || [])
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

  // Ajouter la catégorie "Tous les produits" au début
  const allCategories = [{ id: "tous", name: "Tous les produits", slug: "tous", icon: "ShoppingBasket" }, ...categories]

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug === "tous") {
      params.delete("categorie")
    } else {
      params.set("categorie", categorySlug)
    }
    router.push(`${pathname}?${params.toString()}`)

    // Fermer la sidebar après la sélection d'une catégorie sur mobile
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  // Fonction pour obtenir le composant d'icône à partir du nom stocké dans la base de données
  const getIconComponent = (iconName: string): LucideIcon => {
    // Vérifier si l'icône existe dans notre mapping
    if (iconName && iconComponents[iconName]) {
      return iconComponents[iconName]
    }

    // Icône par défaut si l'icône n'est pas trouvée
    return Coffee
  }

  return (
    <>
      {/* Overlay semi-transparent qui apparaît derrière la sidebar quand elle est ouverte */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      <div
        ref={sidebarRef}
        className={`
          fixed top-0 pt-20 left-0 h-screen z-40
          ${isOpen ? "w-64" : "w-16"} 
          transition-all duration-300 
          border-r bg-slate-50 shadow-lg
        `}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[-12px] top-20 z-10 h-6 w-6 rounded-full border bg-background"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <div className="p-4">
          <h2 className={`font-semibold mb-4 ${isOpen ? "text-lg" : "sr-only"}`}>Catégories</h2>

          <ScrollArea className="h-[calc(100vh-8rem-20px)]">
            <div className="space-y-1">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                  ))
                : allCategories.map((category) => {
                    const isActive = currentCategory === category.slug

                    // Utiliser l'icône de la base de données
                    const IconComponent = getIconComponent(category.icon ?? "Coffee")

                    return (
                      <Button
                        key={category.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full ${isOpen ? "justify-start" : "justify-center px-0"}`}
                        onClick={() => handleCategoryClick(category.slug)}
                        title={!isOpen ? category.name : undefined}
                      >
                        <IconComponent className={`h-5 w-5 ${isOpen ? "mr-2" : ""} flex-shrink-0`} />
                        {isOpen && <span className="truncate">{category.name}</span>}
                      </Button>
                    )
                  })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Espace réservé pour maintenir la mise en page avec la sidebar rétractée */}
      <div className="w-16 flex-shrink-0 pt-[20px]"></div>
    </>
  )
}

