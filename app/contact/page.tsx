import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Wrench, Droplet, Zap } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Get in touch with building management and service providers
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Building Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">555-123-4567</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available Mon-Fri, 9am-5pm</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">management@j02building.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Office Location</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lobby Level, Unit M1</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Office Hours: Mon-Fri, 9am-5pm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Wrench className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Building Maintenance</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">555-789-0123</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For urgent repairs and maintenance issues</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Droplet className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Plumbing Services</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">555-456-7890</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For water leaks and plumbing emergencies</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Zap className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Electrical Services</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">555-234-5678</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For electrical issues and outages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Name
                  </label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="unit"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Unit Number
                  </label>
                  <Input id="unit" placeholder="Enter your unit number" />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Subject
                </label>
                <Input id="subject" placeholder="Enter subject" />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Message
                </label>
                <Textarea id="message" placeholder="Enter your message" className="min-h-[150px]" />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
