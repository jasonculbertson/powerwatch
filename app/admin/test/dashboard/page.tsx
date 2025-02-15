'use client'

import { useState } from 'react'

// Mock data for testing
const mockSubmissions = [
  {
    id: '1',
    created_at: '2025-02-07T20:00:00-08:00',
    name: 'John Doe',
    email: 'john@example.com',
    pdf_path: 'test/sample.pdf',
    status: 'Pending',
    phone: '555-0123'
  },
  {
    id: '2',
    created_at: '2025-02-07T19:00:00-08:00',
    name: 'Jane Smith',
    email: 'jane@example.com',
    pdf_path: 'test/bill.pdf',
    status: 'Approved',
    phone: '555-0124'
  },
  {
    id: '3',
    created_at: '2025-02-07T18:00:00-08:00',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    pdf_path: null,
    status: 'Rejected',
    phone: '555-0125'
  }
]

export default function TestAdminDashboard() {
  const [error, setError] = useState('')

  const handleDownload = (pdfPath: string) => {
    console.log('Downloading PDF:', pdfPath)
    setError('Download functionality disabled in test mode')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard (Test Mode)</h1>
              <p className="text-sm text-gray-600">This is a test version with mock data</p>
            </div>
            <button
              onClick={() => window.location.href = '/admin/test'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Test Page
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{submission.email}</div>
                      {submission.phone && (
                        <div className="text-sm text-gray-500">{submission.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        submission.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        submission.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {submission.pdf_path && (
                        <button
                          onClick={() => handleDownload(submission.pdf_path!)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Download PDF
                        </button>
                      )}
                      <button
                        onClick={() => console.log('View details:', submission.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
