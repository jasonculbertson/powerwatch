import Link from "next/link"
import { CheckCircle, ArrowRight, Mail } from "lucide-react"

export default function Confirmation() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 wave-background" />
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Submission!</h1>
              <p className="text-lg text-gray-600 mb-8">
                We've received your PG&E bill information and will analyze it for potential savings.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-accent mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">What's Next?</h2>
              </div>
              <p className="text-gray-600 mb-4">
                You'll receive an email within 24 hours with your personalized savings report. Here's what to expect:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Detailed analysis of your energy usage</li>
                <li>Potential savings opportunities</li>
                <li>Customized recommendations for reducing your bill</li>
              </ul>
            </div>
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out"
              >
                Return to Home
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

