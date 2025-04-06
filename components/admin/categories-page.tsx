"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Check,
  AlertTriangle,
  Apple,
  Beer,
  Beef,
  ChevronsUpIcon as Cheese,
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
  CitrusIcon as Lemon,
  Wheat,
  Wine,
  Utensils,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

// Mapping des icônes disponibles
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

export function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false)
  const { toast } = useToast()

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/categories")
        if (!res.ok) throw new Error("Erreur lors du chargement des catégories")
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  // Ouvrir le dialogue pour ajouter une catégorie
  const handleAddCategory = () => {
    setCurrentCategory({
      name: "",
      icon: "",
    })
    setIsCategoryDialogOpen(true)
  }

  // Ouvrir le dialogue pour modifier une catégorie
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category)
    setIsCategoryDialogOpen(true)
  }

  // Ouvrir le dialogue pour supprimer une catégorie
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  // Soumettre le formulaire de catégorie
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentCategory || !currentCategory.name) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let response

      if (currentCategory.id) {
        // Mettre à jour une catégorie existante
        response = await fetch(`/api/categories/${currentCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: currentCategory.name,
            icon: currentCategory.icon,
          }),
        })
      } else {
        // Créer une nouvelle catégorie
        response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: currentCategory.name,
            icon: currentCategory.icon,
          }),
        })
      }

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la catégorie")
      }

      const savedCategory = await response.json()

      // Mettre à jour la liste des catégories
      if (currentCategory.id) {
        setCategories(categories.map((c) => (c.id === savedCategory.id ? savedCategory : c)))
      } else {
        setCategories([...categories, savedCategory])
      }

      setIsCategoryDialogOpen(false)
      toast({
        title: "Succès",
        description: currentCategory.id
          ? "La catégorie a été mise à jour avec succès"
          : "La catégorie a été créée avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la catégorie:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la catégorie. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Supprimer une catégorie
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la catégorie")
      }

      // Mettre à jour la liste des catégories
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id))

      setIsDeleteDialogOpen(false)
      toast({
        title: "Succès",
        description: "La catégorie a été supprimée avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sélectionner une icône
  const handleSelectIcon = (iconName: string) => {
    setCurrentCategory((prev) => ({ ...prev, icon: iconName }))
    setIsIconSelectorOpen(false)
  }

  // Obtenir le composant d'icône à partir du nom
  const getIconComponent = (iconName: string | null): LucideIcon => {
    if (iconName && iconComponents[iconName]) {
      return iconComponents[iconName]
    }
    return Coffee // Icône par défaut
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/admin">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Icône</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const IconComponent = getIconComponent(category.icon)

                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {category.icon ? (
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 mr-2" />
                            <span>{category.icon}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dialogue d'ajout/modification de catégorie */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentCategory?.id ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
            <DialogDescription>Remplissez les informations de la catégorie ci-dessous.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCategory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom *
                </Label>
                <Input
                  id="name"
                  value={currentCategory?.name || ""}
                  onChange={(e) => setCurrentCategory((prev) => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icône
                </Label>
                <div className="col-span-3 flex items-center">
                  <div
                    className="flex items-center border rounded-md p-2 cursor-pointer hover:bg-gray-100 mr-2"
                    onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
                  >
                    {currentCategory?.icon ? (
                      <>
                        {React.createElement(getIconComponent(currentCategory.icon), { className: "h-5 w-5 mr-2" })}
                        <span>{currentCategory.icon}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Sélectionner une icône</span>
                    )}
                  </div>
                  {currentCategory?.icon && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentCategory((prev) => ({ ...prev, icon: "" }))}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer l'icône</span>
                    </Button>
                  )}
                </div>

                {isIconSelectorOpen && (
                  <div className="col-span-3 col-start-2 mt-2">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Choisissez une icône</h3>
                      <ScrollArea className="h-[200px]">
                        <div className="grid grid-cols-6 gap-2">
                          {Object.entries(iconComponents).map(([name, Icon]) => (
                            <div
                              key={name}
                              className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                                currentCategory?.icon === name ? "bg-blue-100 border border-blue-300" : ""
                              }`}
                              onClick={() => handleSelectIcon(name)}
                              title={name}
                            >
                              <Icon className="h-6 w-6 mb-1" />
                              {/* <span className="text-xs text-center truncate w-full">{name}</span> */}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {currentCategory?.id ? "Mettre à jour" : "Ajouter"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La catégorie sera définitivement supprimée de la base de données.
              <br />
              <br />
              <strong className="text-red-500">Attention :</strong> Supprimer une catégorie peut affecter les produits
              associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

