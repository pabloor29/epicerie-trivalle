"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types"

// Mapping des icônes par slug de catégorie
const categoryIcons: Record<string, any> = {
  "fruits-legumes": Apple,
  "produits-laitiers": Milk,
  fromages: Cheese,
  charcuterie: Beef,
  vins: Grape,
  boissons: Beer,
  "epicerie-fine": Coffee,
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = getClientSupabaseClient()

  const currentCategory = searchParams.get("categorie") || "tous"

  // Charger les catégories depuis Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("categories").select("*").order("name")

        if (error) {
          throw error
        }

        setCategories(data || [])
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
  }

  return (
    <div
      className={`relative ${isOpen ? "w-64" : "w-16"} transition-all duration-300 border-r bg-slate-50 min-h-screen`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-[-12px] top-4 z-10 h-6 w-6 rounded-full border bg-background"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="p-4">
        <h2 className={`font-semibold mb-4 ${isOpen ? "text-lg" : "sr-only"}`}>Catégories</h2>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                ))
              : allCategories.map((category) => {
                  const isActive = currentCategory === category.slug
                  const IconComponent =
                    category.slug === "tous" ? ShoppingBasket : categoryIcons[category.slug] || Coffee

                  return (
                    <Button
                      key={category.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${isOpen ? "" : "justify-center"}`}
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      <IconComponent className={`h-5 w-5 ${isOpen ? "mr-2" : ""}`} />
                      {isOpen && <span>{category.name}</span>}
                    </Button>
                  )
                })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

