"use client"

import type React from "react"

import { type ReactNode, useState, useRef } from "react"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"
import emailjs from "@emailjs/browser"
import { registerLocale, setDefaultLocale } from "react-datepicker"
import { fr } from "date-fns/locale"

registerLocale("fr", fr)
setDefaultLocale("fr")

interface CartSheetProps {
  children: ReactNode
}

export function CartSheet({ children }: CartSheetProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventTime: "",
  })

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  // Count the number of different articles
  const uniqueItemsCount = items.length

  const formRef = useRef<HTMLFormElement>(null)
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("email en cours d'envoi...")

    if (!formRef.current) {
      console.error("Le formulaire n'est pas disponible !")
      return
    }

    // Utiliser sendForm qui utilise les champs du formulaire
    emailjs
      .sendForm("service_pablo_001", "template_cmd_001", formRef.current, "Hj5zsN3OJSMAXQ9TV")
      .then(() => {
        console.log("Email envoyé avec succès !")
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'email :", error)
      })

    handleSubmitOrder()
  }

  const handleSubmitOrder = async () => {
    if (items.length === 0) return

    // Valider les informations du client
    if (!customer.name || !customer.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customer,
          subtotal,
          total: subtotal,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande")
      }

      const data = await response.json()

      toast({
        title: "Commande enregistrée !",
        description: `Votre commande #${data.order_number} a été enregistrée. Venez la récupérer en magasin.`,
      })

      clearCart()
      setIsCheckoutOpen(false)
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // État et fonctions pour le dropdown des heures
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")

  const options = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
  ]

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    setCustomer({ ...customer, eventTime: value })
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <Sheet>
      {children}
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Votre Panier
            {totalItems > 0 && <span className="ml-2 text-sm">({totalItems})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-4 h-[65vh]">
              <div className="space-y-4 pr-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start py-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / unité</p>
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Diminuer</span>
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Augmenter</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 mt-auto">
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}>
                Valider ma commande
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Vider le panier
              </Button>
            </div>
          </>
        )}
      </SheetContent>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form ref={formRef} onSubmit={sendEmail}>
            {/* Nombre d'articles pour le template */}
            <input type="hidden" name="itemCount" value={uniqueItemsCount} />

            {/* Informations sur les articles - IMPORTANT: les index commencent à 1 pour EmailJS */}
            {items.map((item, index) => (
              <div key={item.id} className="hidden">
                <input type="hidden" name={`itemsName_${index + 1}`} value={item.name} />
                <input type="hidden" name={`itemsUnitPrice_${index + 1}`} value={`${formatPrice(item.price)}`} />
                <input type="hidden" name={`itemsQuantity_${index + 1}`} value={item.quantity} />
                <input
                  type="hidden"
                  name={`itemsTotalPrice_${index + 1}`}
                  value={`${formatPrice(item.price * item.quantity)}`}
                />
                <input type="hidden" name={`display_item_${index + 1}`} value="table-row" />
              </div>
            ))}

            {/* Variables pour cacher les lignes non utilisées */}
            {Array.from({ length: 60 - items.length }).map((_, index) => (
              <div key={`empty-${index}`} className="hidden">
                <input type="hidden" name={`display_item_${items.length + index + 1}`} value="none" />
              </div>
            ))}

            {/* Sous-total */}
            <input type="hidden" name="subtotal" value={`${formatPrice(subtotal)}`} />

            <DialogHeader>
              <DialogTitle>Finaliser votre commande</DialogTitle>
              <DialogDescription>Remplissez vos informations pour valider votre commande</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  name="name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start pb-4 lg:space-x-10 space-y-8 lg:space-y-0">
                <div className="lg:w-1/2 w-full">
                  <Label htmlFor="datePicker">Date *</Label>
                  <Input
                    type="date"
                    id="datePicker"
                    name="eventDate"
                    required
                    defaultValue=""
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      const day = date.getDay()

                      if (day === 0 || day === 1) {
                        // Dimanche (0) ou Lundi (1)
                        e.target.value = ""
                        toast({
                          title: "Jour non disponible",
                          description:
                            "Les lundis et dimanches sont des jours de fermeture. Veuillez choisir un autre jour.",
                          variant: "destructive",
                        })
                      } else {
                        setCustomer({ ...customer, eventDate: e.target.value })
                      }
                    }}
                  />
                  <p className="text-sm pt-1 text-muted-foreground">(jours de fermeture: lundi et dimanche)</p>
                </div>

                <div className="relative lg:w-1/2 w-full">
                  <Label htmlFor="eventTime">Heure *</Label>
                  <Input
                    type="text"
                    id="eventTime"
                    name="eventTime"
                    value={selectedValue}
                    onClick={toggleDropdown}
                    onChange={(e) => {
                      setSelectedValue(e.target.value)
                      setCustomer({ ...customer, eventTime: e.target.value })
                    }}
                    placeholder=""
                    required
                  />

                  {isOpen && (
                    <ul
                      className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {options.map((option, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Traitement..." : "Confirmer la commande"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}

