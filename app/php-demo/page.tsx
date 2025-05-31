import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PhpDemoPage() {
  // You would replace this URL with your actual PHP application URL
  const phpAppUrl = "https://your-php-app-url.com"

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">PHP Application</h1>
        <p className="text-gray-500">This page demonstrates integration with an external PHP application.</p>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>PHP Application</CardTitle>
            <CardDescription>This content is loaded from an external PHP server</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] w-full">
              <iframe
                src={phpAppUrl}
                className="h-full w-full border-0"
                title="PHP Application"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
          <h3 className="text-lg font-medium">How This Works</h3>
          <p className="mt-2">
            This page embeds a PHP application using an iframe. The PHP code runs on a separate server and is displayed
            within your Next.js application.
          </p>
        </div>
      </div>
    </div>
  )
}
