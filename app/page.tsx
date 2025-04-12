"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Tag, Bell, Facebook } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to J02 Buildingyeyeye
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your home, our community. The official website for residents and management of J02 Building.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/contact">
                  <Button className="inline-flex h-10 items-center justify-center">
                    Contact Management
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/news">
                  <Button variant="outline" className="inline-flex h-10 items-center justify-center">
                    Latest News
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/building.jpg"
                width={600}
                height={400}
                alt="J02 Building"
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Building Resources</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Everything you need to know about living in J02 Building
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/about">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Users className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">About Us</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                    Meet your building committee and management team
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/for-sale">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Tag className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">Units For Sale</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                    View available units in our building
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/news">
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Bell className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold">News & Updates</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                    Stay informed with the latest building announcements
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join Our Community</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Connect with your neighbors and stay updated on building events
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#" onClick={(e) => e.preventDefault()}>
                <Button className="inline-flex h-10 items-center justify-center">
                  <Facebook className="mr-2 h-4 w-4" />
                  Join Our Facebook Group
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="inline-flex h-10 items-center justify-center">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

