import { Mail, MapPin, Phone, Clock } from "lucide-react"

export const metadata = {
  title: "Contact - Épicerie du Quartier",
  description: "Contactez-nous et trouvez nos informations pratiques.",
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Contactez-nous</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-slate-200 h-[400px] rounded-lg flex items-center justify-center">
          <p className="text-slate-600">Carte de localisation</p>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6">Informations pratiques</h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p className="mt-1">
                  123 Rue du Commerce
                  <br />
                  75001 Paris, France
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Horaires d&apos;ouverture</h3>
                <p className="mt-1">
                  Lundi - Vendredi: 9h00 - 19h00
                  <br />
                  Samedi: 9h00 - 20h00
                  <br />
                  Dimanche: 10h00 - 13h00
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <p className="mt-1">01 23 45 67 89</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="mt-1">contact@epicerieduquartier.fr</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

