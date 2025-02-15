import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Steps } from "@/components/ui/steps"

export function BillDownloadGuide() {
  return (
    <Card className="mb-6 p-6">
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <div>
          <h2 className="text-lg font-semibold mb-4">How to Download Your PG&E Bill</h2>
          <Steps
            steps={[
              {
                title: "Go to PG&E website",
                description: "Visit pge.com in your web browser",
              },
              {
                title: "Sign in to your account",
                description: "Click the 'Sign In' button in the top right corner and enter your credentials",
              },
              {
                title: "Find your current bill",
                description: "Look for the 'View Current Bill (PDF)' link",
              },
              {
                title: "Download the PDF",
                description: "Click the link and your bill will automatically download to your computer",
              },
            ]}
          />
        </div>
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden border">
          <Image
            src="/images/pge-bill-download.png"
            alt="PG&E website screenshot showing where to find your bill"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </Card>
  )
}

