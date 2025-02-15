import UploadForm from '@/components/UploadForm'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Upload Information
          </h1>
          <div className="bg-white shadow sm:rounded-lg p-6">
            <UploadForm />
          </div>
        </div>
      </div>
    </div>
  )
}
