import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, Phone, Mail } from "lucide-react"

// Sample property listings
const properties = [
  {
    id: 1,
    unit: "301",
    price: "$450,000",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    description: "Spacious corner unit with lots of natural light and updated kitchen.",
    image: "/apartment-livingroom1.jpg",
    contact: {
      name: "David Wilson",
      phone: "555-123-4567",
      email: "david@example.com",
    },
  },
  {
    id: 2,
    unit: "512",
    price: "$375,000",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850,
    description: "Modern one-bedroom with balcony and city views. Recently renovated bathroom.",
    image: "/apartment-bedroom.jpg",
    contact: {
      name: "Maria Garcia",
      phone: "555-987-6543",
      email: "maria@example.com",
    },
  },
  {
    id: 3,
    unit: "207",
    price: "$525,000",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    description: "Family-sized unit with open floor plan and upgraded appliances.",
    image: "/apartment-livingroom2.jpg",
    contact: {
      name: "James Thompson",
      phone: "555-456-7890",
      email: "james@example.com",
    },
  },
]

export default function ForSalePage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Units For Sale</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Browse available units in J02 Building
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-[250px] w-full">
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={`Unit ${property.unit}`}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute right-2 top-2 bg-primary text-white">{property.price}</Badge>
              </div>
              <CardHeader>
                <CardTitle>Unit {property.unit}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Bed className="mr-1 h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="mr-1 h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Square className="mr-1 h-4 w-4 text-gray-500" />
                    <span className="text-sm">{property.sqft} sq ft</span>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{property.description}</p>
                <div className="border-t pt-4">
                  <h4 className="font-medium">Contact: {property.contact.name}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-500" />
                      <a href={`tel:${property.contact.phone}`} className="text-sm hover:underline">
                        {property.contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-500" />
                      <a href={`mailto:${property.contact.email}`} className="text-sm hover:underline">
                        {property.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/contact">
                  <Button className="w-full">Inquire About This Unit</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <h2 className="text-xl font-bold">Selling Your Unit?</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            If you're a resident looking to list your unit for sale on this page, please contact the building
            management.
          </p>
          <Link href="/contact">
            <Button className="mt-4">Contact Management</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
