import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Épicerie du Quartier</h3>
            <p className="text-sm text-gray-600">Des produits frais et locaux pour tous les habitants du quartier.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-green-600">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/epicerie" className="text-sm text-gray-600 hover:text-green-600">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-green-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Lundi - Vendredi: 9h00 - 19h00</li>
              <li>Samedi: 9h00 - 20h00</li>
              <li>Dimanche: 10h00 - 13h00</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>123 Rue du Commerce, 75001 Paris</li>
              <li>01 23 45 67 89</li>
              <li>contact@epicerieduquartier.fr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Épicerie du Quartier. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

