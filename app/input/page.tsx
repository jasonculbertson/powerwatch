"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HelpCircle, Upload, FileText, X, FileIcon, Mail, ArrowLeft, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BillDownloadGuide } from "@/components/bill-download-guide"
import { Stepper } from "@/components/ui/stepper"

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

interface BillData {
  name: string
  email: string
  rate_schedule: string
  peak_kwh: string
  offpeak_kwh: string
}

export default function InputForm() {
  const [step, setStep] = useState(1)
  const [inputMethod, setInputMethod] = useState<"upload" | "manual">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [billData, setBillData] = useState<BillData>({
    name: "",
    email: "",
    rate_schedule: "",
    peak_kwh: "",
    offpeak_kwh: "",
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFileError("")

    if (!selectedFile) {
      return
    }

    if (selectedFile.type !== "application/pdf") {
      setFileError("Please upload a PDF file")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError("File size should be less than 10MB")
      return
    }

    setFile(selectedFile)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]

    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
      setFileError("")
    } else {
      setFileError("Please upload a PDF file")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setFile(null)
    setFileError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (inputMethod === "upload" && !file) {
      setFileError("Please upload a PDF file")
      return
    }

    setIsSubmitting(true)

    try {
      // First, upload the PDF if present
      let pdfPath = null
      if (inputMethod === "upload" && file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(fileName, file)

        if (uploadError) throw uploadError
        pdfPath = fileName
      }

      // Insert into submissions table
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert([
          {
            name: billData.name,
            email: billData.email,
            pdf_path: pdfPath,
            // Only include energy data if it's a manual entry
            ...(inputMethod === 'manual' ? {
              rate_schedule: billData.rate_schedule,
              peak_kwh: billData.peak_kwh ? parseFloat(billData.peak_kwh) : null,
              offpeak_kwh: billData.offpeak_kwh ? parseFloat(billData.offpeak_kwh) : null
            } : {
              rate_schedule: null,
              peak_kwh: null,
              offpeak_kwh: null
            })
          }
        ])
        .select()
        .single()

      if (submissionError) throw submissionError

      // Send email notification
      const formData = new FormData()
      formData.append("name", billData.name)
      formData.append("email", billData.email)

      if (file) {
        formData.append("file", file)
      } 
      
      // Add all the bill data to the email
      Object.entries(billData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value.toString())
        }
      })

      // Send email notification and wait for it to complete
      try {
        const response = await fetch("/api/submit-bill", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Failed to send email notification, but data was saved");
        }

        // Only navigate after email attempt is complete
        router.replace("/confirmation");
      } catch (emailError) {
        console.error("Failed to send email notification, but data was saved:", emailError);
        // Still navigate even if email fails
        router.replace("/confirmation");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (field: keyof BillData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const renderTooltip = (content: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const nextStep = () => {
    if (step === 1 && billData.name && billData.email) {
      setStep(2)
    }
  }

  const prevStep = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 wave-background" />
      <div className="relative container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Calculate Your PG&E Savings</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Enter your details below and we'll analyze your potential savings
            </p>
          </div>

          <Stepper currentStep={step} steps={["Personal Information", "Bill Details"]} />

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={billData.name}
                      onChange={handleInputChange("name")}
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={billData.email}
                      onChange={handleInputChange("email")}
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <>
                  <div className="mb-6 flex gap-4">
                    <button
                      type="button"
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        inputMethod === "upload"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      onClick={() => setInputMethod("upload")}
                    >
                      <Upload className="h-4 w-4" />
                      Upload PDF
                    </button>
                    <button
                      type="button"
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        inputMethod === "manual"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      onClick={() => setInputMethod("manual")}
                    >
                      <FileText className="h-4 w-4" />
                      Enter Manually
                    </button>
                  </div>

                  {inputMethod === "upload" ? (
                    <>
                      <BillDownloadGuide />
                      <div
                        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors
                          ${file ? "border-accent bg-accent/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}
                        `}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        {!file ? (
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm font-medium">Drop your PG&E bill here or click to upload</p>
                            <p className="mt-1 text-sm text-muted-foreground">Supports PDF format only</p>
                          </label>
                        ) : (
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-8 w-8 text-accent" />
                              <div className="text-left">
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button type="button" onClick={removeFile} className="rounded-full p-1 hover:bg-muted">
                              <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-lg border bg-card/50 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Rate Schedule</h2>
                        <div className="grid gap-4">
                          <div className="max-w-md">
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Select Rate Schedule
                              {renderTooltip("Choose your PG&E rate schedule and season")}
                            </label>
                            <div className="relative">
                              <select
                                value={billData.rate_schedule}
                                onChange={handleInputChange("rate_schedule")}
                                className="w-full rounded-lg border bg-background px-3 py-2 pr-8 text-sm appearance-none"
                                required
                              >
                                <option value="">Select a rate schedule...</option>
                                {RATE_SCHEDULES.map((rate) => (
                                  <option key={rate.id} value={rate.id}>
                                    {rate.name} - {rate.description} ({rate.season})
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-card/50 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Energy Charges</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Peak Usage (kWh)
                              {renderTooltip("Electricity used during peak hours")}
                            </label>
                            <input
                              type="number"
                              step="0.000001"
                              value={billData.peak_kwh}
                              onChange={handleInputChange("peak_kwh")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Off-Peak Usage (kWh)
                              {renderTooltip("Electricity used during off-peak hours")}
                            </label>
                            <input
                              type="number"
                              step="0.000001"
                              value={billData.offpeak_kwh}
                              onChange={handleInputChange("offpeak_kwh")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>

                        </div>
                      </div>


                      <div className="rounded-lg border bg-muted p-4 text-sm text-muted-foreground">
                        <Mail className="mb-2 h-5 w-5" />
                        <p>
                          Within 24 hours, we'll analyze your bill and email you the results with potential savings
                          opportunities.
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}

              {fileError && inputMethod === "upload" && (
                <Alert variant="destructive">
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center justify-center rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                )}
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                    disabled={!billData.name || !billData.email}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto flex items-center justify-center rounded-lg bg-accent px-4 py-4 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Analyze My Bill"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

