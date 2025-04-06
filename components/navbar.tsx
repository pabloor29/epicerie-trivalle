"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartSheet } from "@/components/cart-sheet"
import { SheetTrigger } from "@/components/ui/sheet"
import CartBadge from "./cart-badge"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  // Vérifier si l'utilisateur est admin en vérifiant le cookie
  useEffect(() => {
    const checkAdmin = () => {
      const cookies = document.cookie.split(";")
      const hasAdminCookie = cookies.some((cookie) => cookie.trim().startsWith("admin-auth="))
      setIsAdmin(hasAdminCookie)
    }

    checkAdmin()

    // Vérifier à nouveau si la fenêtre est active
    window.addEventListener("focus", checkAdmin)
    return () => window.removeEventListener("focus", checkAdmin)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button className="mr-2 md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </button>
          <Link href="/" className="text-xl font-bold text-green-700">
            Épicerie du Quartier
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 z-50">
          <Link href="/" className={`text-sm font-medium ${isActive("/") ? "text-blue-800" : "hover:text-blue-800"}`}>
            Accueil
          </Link>
          <Link
            href="/epicerie"
            className={`text-sm font-medium ${isActive("/epicerie") ? "text-blue-800" : "hover:text-blue-800"}`}
          >
            Produits
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium ${isActive("/contact") ? "text-blue-800" : "hover:text-blue-800"}`}
          >
            Contact
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium ${isActive("/admin") ? "text-green-600" : "hover:text-green-600"}`}
            >
              Administration
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b md:hidden z-50">
            <div className="flex flex-col space-y-4 p-4">
              <Link href="/" className="text-lg font-medium hover:text-green-600" onClick={() => setIsMenuOpen(false)}>
                Accueil
              </Link>
              <Link
                href="/epicerie"
                className="text-lg font-medium hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-lg font-medium hover:text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administration
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Cart */}
          <CartSheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <CartBadge />
              </Button>
            </SheetTrigger>
          </CartSheet>

          {/* User Menu */}
          <Button variant="ghost" size="icon" asChild>
            <Link href={isAdmin ? "/admin" : "/admin/login"}>
              <User className="h-5 w-5" />
              <span className="sr-only">{isAdmin ? "Administration" : "Connexion"}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

