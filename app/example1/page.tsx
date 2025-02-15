import UploadForm from '@/components/UploadForm'

export default function Example1Page() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Content section */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Welcome to Our Service</h1>
          <p className="text-gray-600 mb-4">
            Please provide your information and upload any relevant documents.
            We'll process your submission and get back to you shortly.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Why upload documents?</h2>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Faster processing of your request</li>
              <li>More accurate assessment</li>
              <li>Secure document storage</li>
            </ul>
          </div>
        </div>
        
        {/* Form section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Information</h2>
          <UploadForm />
        </div>
      </div>
    </div>
  )
}
