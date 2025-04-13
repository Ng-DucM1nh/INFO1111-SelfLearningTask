import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"

// Updated news data with current dates
const newsItems = [
  {
    id: 1,
    title: "Annual Building Maintenance Schedule",
    date: "2025-03-15",
    category: "Maintenance",
    content:
      "The annual maintenance schedule has been finalized. Major work includes facade cleaning in May, elevator maintenance in June, and roof inspection in July. Please check the detailed schedule for potential service interruptions.",
    important: true,
  },
  {
    id: 2,
    title: "New Security System Installation",
    date: "2025-02-28",
    category: "Security",
    content:
      "We're upgrading our building security system next month. New key fobs will be distributed to all residents on April 10-12 in the lobby from 6-8pm. Please bring ID to collect your new fob.",
    important: true,
  },
  {
    id: 3,
    title: "Community Garden Project",
    date: "2025-02-15",
    category: "Community",
    content:
      "The rooftop community garden project has been approved! We're looking for volunteers to help with the initial setup. If you're interested, please sign up at the management office by March 30.",
    important: false,
  },
  {
    id: 4,
    title: "Building Insurance Renewal",
    date: "2025-02-10",
    category: "Administrative",
    content:
      "Our building insurance policy has been renewed for the coming year with improved coverage at a 5% lower premium. The full policy details are available for review in the management office.",
    important: false,
  },
  {
    id: 5,
    title: "Summer BBQ Event",
    date: "2025-02-05",
    category: "Events",
    content:
      "Save the date! Our annual summer BBQ will be held on July 15 in the courtyard. Food, drinks, and entertainment will be provided. Please RSVP by July 1 to help us plan accordingly.",
    important: false,
  },
]

export default function NewsPage() {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">News & Announcements</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Stay updated with the latest information about J02 Building
          </p>
        </div>

        <div className="space-y-6">
          {newsItems.map((item) => (
            <Card key={item.id} className={item.important ? "border-2 border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{item.title}</CardTitle>
                  {item.important && <Badge variant="destructive">Important</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">{item.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>{formatDate(item.date)}</span>
                </div>
                <Badge variant="outline">{item.category}</Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
