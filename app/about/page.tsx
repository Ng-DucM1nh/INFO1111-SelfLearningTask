import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

// Update the committeeMembers array to reflect the correct roles
const committeeMembers = [
  {
    id: 1,
    name: "Jane Smith",
    role: "Events Coordinator",
    image: "/committee-female1.jpg",
    bio: "Jane has been a resident for 10 years and organizes community events and activities for building residents.",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Treasurer",
    image: "/committee-male1.jpg",
    bio: "John has a background in finance and manages the building's budget and financial planning.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Secretary",
    image: "/committee-female2.jpg",
    bio: "Sarah handles all communications and record-keeping for the committee.",
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Maintenance Coordinator",
    image: "/committee-male2.jpg",
    bio: "Michael oversees all building maintenance projects and contractor relationships.",
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    role: "Chairperson",
    image: "/committee-female3.jpg",
    bio: "Lisa leads the committee and has served as Chairperson for 3 years, ensuring the building is well-managed and residents' needs are met.",
  },
]

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Meet the committee members who manage J02 Building
          </p>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tighter">Our Mission</h2>
          <p className="text-gray-500 dark:text-gray-400">
            The J02 Building Committee is dedicated to maintaining a safe, comfortable, and vibrant community for all
            residents. We work to ensure the building is well-maintained, financially sound, and a pleasant place to
            live.
          </p>

          <h2 className="text-2xl font-bold tracking-tighter">Committee Members</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {committeeMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-tighter">Committee Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-500 dark:text-gray-400">
            <li>Managing building finances and budget</li>
            <li>Overseeing maintenance and repairs</li>
            <li>Enforcing building rules and regulations</li>
            <li>Organizing community events</li>
            <li>Addressing resident concerns and feedback</li>
            <li>Planning for long-term building improvements</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
