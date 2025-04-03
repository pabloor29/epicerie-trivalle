import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] bg-gradient-to-r from-green-800 to-green-600 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Épicerie du Quartier</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Des produits frais et locaux pour tous les habitants du quartier
          </p>
          <Button asChild size="lg" className="bg-white text-green-800 hover:bg-gray-100">
            <Link href="/epicerie">
              Découvrir nos produits <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
            <p className="text-lg mb-4">
              Fondée en 2010, l&apos;Épicerie du Quartier est née de la passion de Marie et Pierre pour les produits
              locaux et de qualité.
            </p>
            <p className="text-lg mb-4">
              Notre mission est simple : proposer des produits frais, de saison et issus de producteurs locaux, tout en
              créant un lieu de rencontre et d&apos;échange pour les habitants du quartier.
            </p>
          </div>
          <div className="bg-slate-200 h-[400px] rounded-lg flex items-center justify-center">
            <p className="text-slate-600">Image de l&apos;équipe</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 text-center bg-green-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Prêt à découvrir nos produits ?</h2>
          <p className="text-lg mb-8">
            Parcourez notre sélection en ligne et préparez votre commande. Venez ensuite la récupérer directement en
            magasin !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/epicerie">Voir nos produits</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

