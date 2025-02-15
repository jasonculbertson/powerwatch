'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function UploadForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // First, create the user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            has_pdf: !!file
          }
        ])
        .select()
        .single()

      if (userError) throw userError

      // If there's a PDF file, upload it
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userData.id}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Update the user record with the PDF path
        const { error: updateError } = await supabase
          .from('users')
          .update({ pdf_path: fileName })
          .eq('id', userData.id)

        if (updateError) throw updateError
      }

      // Clear the form
      setName('')
      setEmail('')
      setFile(null)
      alert('Successfully uploaded!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">
          PDF File (optional)
        </label>
        <input
          type="file"
          id="pdf"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
