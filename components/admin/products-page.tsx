"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Search, Edit, Trash2, X, Loader2, Check, AlertTriangle, Upload } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Types
interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  in_stock: boolean
  categories?: {
    id: string
    name: string
  }
  image?: File
}

interface Category {
  id: string
  name: string
  slug: string
}

export function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Initialiser le stockage au chargement
  useEffect(() => {
    const initStorage = async () => {
      try {
        const response = await fetch("/api/storage/init")
        const data = await response.json()
        console.log("Initialisation du stockage:", data)
      } catch (error) {
        console.error("Erreur lors de l'initialisation du stockage:", error)
      }
    }

    initStorage()
  }, [])

  // Charger les produits et les catégories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Charger les produits
        const productsRes = await fetch("/api/products")
        if (!productsRes.ok) throw new Error("Erreur lors du chargement des produits")
        const productsData = await productsRes.json()

        // Charger les catégories
        const categoriesRes = await fetch("/api/categories")
        if (!categoriesRes.ok) throw new Error("Erreur lors du chargement des catégories")
        const categoriesData = await categoriesRes.json()

        console.log("Produits chargés:", productsData)
        console.log("Catégories chargées:", categoriesData)

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filtrer les produits par recherche
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Ouvrir le dialogue pour ajouter un produit
  const handleAddProduct = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      category_id: "",
      in_stock: true,
    })
    setImagePreview(null)
    setIsProductDialogOpen(true)
  }

  // Ouvrir le dialogue pour modifier un produit
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product)
    setImagePreview(product.image_url)
    setIsProductDialogOpen(true)
  }

  // Ouvrir le dialogue pour supprimer un produit
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  // Soumettre le formulaire de produit
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentProduct || !currentProduct.name || currentProduct.price === undefined) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Ajouter les champs du produit
      formData.append("name", currentProduct.name)
      formData.append("description", currentProduct.description || "")
      formData.append("price", currentProduct.price.toString())
      formData.append("category_id", currentProduct.category_id || "none")
      formData.append("in_stock", currentProduct.in_stock ? "true" : "false")

      // Ajouter l'image si elle existe
      if (currentProduct.image && currentProduct.image instanceof File) {
        formData.append("image", currentProduct.image)
      }

      let response

      if (currentProduct.id) {
        // Mettre à jour un produit existant
        response = await fetch(`/api/products/${currentProduct.id}`, {
          method: "PUT",
          body: formData,
        })
      } else {
        // Créer un nouveau produit
        response = await fetch("/api/products", {
          method: "POST",
          body: formData,
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'enregistrement du produit")
      }

      const savedProduct = await response.json()
      console.log("Produit enregistré:", savedProduct)

      // Mettre à jour la liste des produits
      if (currentProduct.id) {
        setProducts(products.map((p) => (p.id === savedProduct.id ? savedProduct : p)))
      } else {
        setProducts([...products, savedProduct])
      }

      setIsProductDialogOpen(false)
      toast({
        title: "Succès",
        description: currentProduct.id
          ? "Le produit a été mis à jour avec succès"
          : "Le produit a été créé avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du produit:", error)
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Impossible d'enregistrer le produit. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Supprimer un produit
  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du produit")
      }

      // Mettre à jour la liste des produits
      setProducts(products.filter((p) => p.id !== productToDelete.id))

      setIsDeleteDialogOpen(false)
      toast({
        title: "Succès",
        description: "Le produit a été supprimé avec succès",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gérer le changement d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCurrentProduct((prev) => ({
        ...prev,
        image: file,
      }))

      // Créer un aperçu de l'image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Ajouter des catégories de test si aucune n'est disponible
  const addTestCategories = async () => {
    if (categories.length > 0) return

    try {
      const testCategories = [
        { name: "Fruits et Légumes", slug: "fruits-legumes", icon: "Apple" },
        { name: "Produits Laitiers", slug: "produits-laitiers", icon: "Milk" },
        { name: "Fromages", slug: "fromages", icon: "ChevronsUp" },
        { name: "Charcuterie", slug: "charcuterie", icon: "Beef" },
      ]

      for (const category of testCategories) {
        await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        })
      }

      // Recharger les catégories
      const categoriesRes = await fetch("/api/categories")
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData)

      toast({
        title: "Catégories ajoutées",
        description: "Des catégories de test ont été ajoutées avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout des catégories de test:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les catégories de test.",
        variant: "destructive",
      })
    }
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
          <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        </div>
        <div className="flex gap-2">
          {categories.length === 0 && (
            <Button variant="outline" onClick={addTestCategories}>
              Ajouter des catégories de test
            </Button>
          )}
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100">
                        {product.image_url ? (
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <X className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.categories?.name || "Non catégorisé"}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.in_stock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          En stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Rupture
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dialogue d'ajout/modification de produit */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
            <DialogDescription>Remplissez les informations du produit ci-dessous.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom *
                </Label>
                <Input
                  id="name"
                  value={currentProduct?.name || ""}
                  onChange={(e) => setCurrentProduct((prev) => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Prix *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={currentProduct?.price || ""}
                  onChange={(e) => setCurrentProduct((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={currentProduct?.description || ""}
                  onChange={(e) => setCurrentProduct((prev) => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Catégorie
                </Label>
                <div className="col-span-3">
                  {categories.length === 0 ? (
                    <div className="text-sm text-amber-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Aucune catégorie disponible. Veuillez d'abord ajouter des catégories.
                    </div>
                  ) : (
                    <Select
                      value={currentProduct?.category_id || "none"}
                      onValueChange={(value) => setCurrentProduct((prev) => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune catégorie</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">
                  Image
                </Label>
                <div className="col-span-3">
                  <div className="flex flex-col gap-4">
                    {imagePreview && (
                      <div className="relative h-40 w-40 rounded overflow-hidden bg-gray-100 mb-2">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Aperçu de l'image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Sélectionner une image
                      </Button>
                      {currentProduct?.image && (
                        <span className="text-sm text-gray-500">
                          {currentProduct.image instanceof File ? currentProduct.image.name : "Image sélectionnée"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label htmlFor="in_stock">En stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in_stock"
                    checked={currentProduct?.in_stock || false}
                    onCheckedChange={(checked) =>
                      setCurrentProduct((prev) => ({ ...prev, in_stock: checked === true }))
                    }
                  />
                  <label
                    htmlFor="in_stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ce produit est disponible en stock
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
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
                    {currentProduct?.id ? "Mettre à jour" : "Ajouter"}
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
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera définitivement supprimé de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
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

