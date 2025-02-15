'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type RateSchedule = {
  id: string
  name: string
  description: string
  season: 'Winter' | 'Summer' | 'All Year'
}

const RATE_SCHEDULES: RateSchedule[] = [
  { id: 'E-1-ALL', name: 'E-1', description: 'Flat Rate (Tiered Pricing)', season: 'All Year' },
  { id: 'E-TOU-C-W', name: 'E-TOU-C', description: 'Time-of-Use (4-9pm Peak)', season: 'Winter' },
  { id: 'E-TOU-C-S', name: 'E-TOU-C', description: 'Time-of-Use (4-9pm Peak)', season: 'Summer' },
  { id: 'E-TOU-D-W', name: 'E-TOU-D', description: 'Time-of-Use (3-8pm Peak)', season: 'Winter' },
  { id: 'E-TOU-D-S', name: 'E-TOU-D', description: 'Time-of-Use (3-8pm Peak)', season: 'Summer' },
  { id: 'EV2-A-W', name: 'EV2-A', description: 'Time-of-Use (EV Owners)', season: 'Winter' },
  { id: 'EV2-A-S', name: 'EV2-A', description: 'Time-of-Use (EV Owners)', season: 'Summer' },
]

interface Submission {
  id: string
  created_at: string
  name: string
  email: string
  pdf_path: string | null
  rate_schedule: string
  peak_kwh: number | null
  offpeak_kwh: number | null
}

export default function AdminDashboard() {
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<any>(null)

  const handleParsePdf = async (pdfPath: string) => {
    try {
      setParsedData(null); // Clear previous results
      console.log('Starting PDF processing for path:', pdfPath);
      
      // Send path to server for processing
      console.log('Sending PDF path for processing:', pdfPath);
      
      let response;
      try {
        response = await fetch('/api/parse-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ pdfPath }),
        });
      } catch (fetchError) {
        console.error('Network error:', fetchError);
        throw new Error('Failed to connect to server');
      }
      
      // Get the raw response text first
      const rawResponse = await response.text();
      console.log('Raw server response:', rawResponse);
      
      let data;
      try {
        data = JSON.parse(rawResponse);
        console.log('Parsed server response:', data);
      } catch (parseError) {
        console.error('Error parsing server response:', {
          status: response.status,
          statusText: response.statusText,
          rawResponse,
          parseError
        });
        throw new Error('Server returned invalid JSON response');
      }
      
      if (!response.ok) {
        const errorMessage = data.details || data.error || 'Failed to parse PDF';
        console.error('Server error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(errorMessage);
      }

      setParsedData(data);
      console.log('PDF parsed successfully');
    } catch (error) {
      console.error('PDF processing error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      setParsedData({
        error: true,
        message: error instanceof Error ? error.message : 'Failed to process PDF',
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.stack : undefined
      });
    }
  };

  const handleDownloadPdf = async (pdfPath: string) => {
    if (!pdfPath) return
    
    try {
      setDownloadingPdf(pdfPath)
      
      // Get the file directly - no need to check existence first
      const { data, error } = await supabase.storage
        .from('pdfs')
        .download(pdfPath)

      if (error) {
        console.error('Storage error:', error)
        throw new Error(`Failed to download PDF: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data received from storage')
      }

      // Create a download link
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      // Use the original filename if possible, otherwise use a generic name
      const originalName = pdfPath.split('/').pop()
      a.download = originalName || `bill-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (error) {
      console.error('Error downloading file:', error)
      alert(error instanceof Error ? error.message : 'Failed to download PDF')
    } finally {
      setDownloadingPdf(null)
    }
  }

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.error('Auth error:', error)
          window.location.replace('/admin/login')
          return
        }

        console.log('User authenticated:', user.email)
        setUser(user)
        await fetchSubmissions()
      } catch (error) {
        console.error('Auth check failed:', error)
        window.location.replace('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSubmissions(data || [])
    } catch (error: any) {
      console.error('Error fetching submissions:', error)
      setError(error.message)
    }
  }

  const handleDownload = async (pdfPath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .download(pdfPath)
      
      if (error) throw error

      // Create a download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = pdfPath.split('/').pop() || 'download.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('Error downloading file:', error)
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.replace('/admin/login')
    } catch (error: any) {
      console.error('Error signing out:', error)
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-800">Loading...</div>
      </div>
    )
  }

  if (!user) {
    window.location.replace('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {parsedData && (
            <div className={`mb-8 p-4 bg-white border rounded-lg shadow-sm ${
              parsedData.error ? 'border-red-200' : 'border-gray-200'
            }`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {parsedData.error ? 'PDF Parsing Error' : 'Parsed PDF Results'}
              </h2>
                            {parsedData.error ? (
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-red-700 mb-2">Error: {parsedData.message}</p>
                  <p className="text-red-500 text-sm">Time: {new Date(parsedData.timestamp).toLocaleString()}</p>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Total Pages: {parsedData.totalPages}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {parsedData.error ? (
                      <div className="bg-red-50 border border-red-200 rounded p-4">
                        <h3 className="text-md font-medium text-red-800 mb-2">Error Processing PDF</h3>
                        <p className="text-sm text-red-600">{parsedData.details || parsedData.message}</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-md font-medium text-gray-800 mb-2">PDF Information</h3>
                          <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                            {parsedData.metadata?.title && (
                              <p><span className="font-medium">Title:</span> {parsedData.metadata.title}</p>
                            )}
                            {parsedData.metadata?.author && (
                              <p><span className="font-medium">Author:</span> {parsedData.metadata.author}</p>
                            )}
                            {parsedData.metadata?.pageCount && (
                              <p><span className="font-medium">Pages:</span> {parsedData.metadata.pageCount}</p>
                            )}
                            {parsedData.metadata?.version && (
                              <p><span className="font-medium">PDF Version:</span> {parsedData.metadata.version}</p>
                            )}
                          </div>
                        </div>

                        {parsedData.pages?.map((page: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                              <h3 className="text-sm font-medium text-gray-700">Page {page.pageNumber}</h3>
                            </div>
                            <pre className="p-4 text-sm whitespace-pre-wrap overflow-auto max-h-[400px] bg-white">
                              {page.content}
                            </pre>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Info
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate Schedule
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Energy Usage (kWh)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                        <div className="text-xs text-gray-400">{new Date(submission.created_at).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{RATE_SCHEDULES.find(r => r.id === submission.rate_schedule)?.name || '-'}</div>
                        <div className="text-sm text-gray-500">{RATE_SCHEDULES.find(r => r.id === submission.rate_schedule)?.description || '-'}</div>
                        <div className="text-xs text-gray-400">{RATE_SCHEDULES.find(r => r.id === submission.rate_schedule)?.season || '-'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Peak:</span> {submission.peak_kwh?.toFixed(2) || '-'} kWh
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Off-Peak:</span> {submission.offpeak_kwh?.toFixed(2) || '-'} kWh
                          </div>
                        </div>
                      </td>


                      <td className="px-4 py-4 text-sm">
                        <div className="space-y-2">
                          {submission.pdf_path && (
                            <button
                              onClick={() => handleParsePdf(submission.pdf_path!)}
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mr-4"
                            >
                              Parse PDF
                            </button>
                          )}
                          {submission.pdf_path && (
                            <button
                              onClick={() => handleDownload(submission.pdf_path!)}
                              className="block w-full px-3 py-1 text-center text-indigo-600 hover:text-indigo-900 border border-indigo-600 rounded hover:bg-indigo-50"
                            >
                              Download PDF
                            </button>
                          )}
                          <button
                            onClick={() => console.log('View details:', submission.id)}
                            className="block w-full px-3 py-1 text-center text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Edit Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
