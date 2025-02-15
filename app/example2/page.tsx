import UploadForm from '@/components/UploadForm'

export default function Example2Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Document Management Portal
          </h1>
          <p className="mt-2 text-gray-600">
            Upload and manage your documents securely
          </p>
        </div>

        {/* Card with form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white overflow-hidden shadow-xl rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Upload New Document
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please fill in your details and upload your document below.
                </p>
              </div>
              <UploadForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
