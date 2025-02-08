"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HelpCircle, Upload, FileText, X, FileIcon, Mail, ArrowLeft, ArrowRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BillDownloadGuide } from "@/components/bill-download-guide"
import { Stepper } from "@/components/ui/stepper"

interface BillData {
  name: string
  email: string
  total_usage: string
  adu: string
  peak_kwh: string
  offpeak_kwh: string
  peak_cost: string
  offpeak_cost: string
  current_electric: string
  current_gas: string
  total_amount: string
  peak_hours: string
  offpeak_hours: string
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
    total_usage: "",
    adu: "",
    peak_kwh: "",
    offpeak_kwh: "",
    peak_cost: "",
    offpeak_cost: "",
    current_electric: "",
    current_gas: "",
    total_amount: "",
    peak_hours: "",
    offpeak_hours: "",
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
      const formData = new FormData()
      formData.append("name", billData.name)
      formData.append("email", billData.email)

      if (inputMethod === "upload" && file) {
        formData.append("file", file)
      } else {
        Object.entries(billData).forEach(([key, value]) => {
          formData.append(key, value)
        })
      }

      const response = await fetch("/api/submit-bill", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Submission failed")
      }

      router.push("/confirmation")
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                        <h2 className="mb-4 text-lg font-semibold">Usage Information</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Total Usage (kWh)
                              {renderTooltip("Total electricity usage for the billing period")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.total_usage}
                              onChange={handleInputChange("total_usage")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Average Daily Usage (kWh/day)
                              {renderTooltip("Average daily electricity usage")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.adu}
                              onChange={handleInputChange("adu")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-card/50 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Time-of-Use Details</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Peak Hours Usage (kWh)
                              {renderTooltip("Electricity used during peak hours")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.peak_kwh}
                              onChange={handleInputChange("peak_kwh")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Off-Peak Hours Usage (kWh)
                              {renderTooltip("Electricity used during off-peak hours")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.offpeak_kwh}
                              onChange={handleInputChange("offpeak_kwh")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Peak Hours
                              {renderTooltip("Time range for peak hours (e.g., '4PM-9PM')")}
                            </label>
                            <input
                              type="text"
                              value={billData.peak_hours}
                              onChange={handleInputChange("peak_hours")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              placeholder="e.g., 4PM-9PM"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Off-Peak Hours
                              {renderTooltip("Time range for off-peak hours (e.g., '9PM-4PM')")}
                            </label>
                            <input
                              type="text"
                              value={billData.offpeak_hours}
                              onChange={handleInputChange("offpeak_hours")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              placeholder="e.g., 9PM-4PM"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border bg-card/50 p-6">
                        <h2 className="mb-4 text-lg font-semibold">Cost Breakdown</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Peak Hours Cost ($)
                              {renderTooltip("Cost of electricity used during peak hours")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.peak_cost}
                              onChange={handleInputChange("peak_cost")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Off-Peak Hours Cost ($)
                              {renderTooltip("Cost of electricity used during off-peak hours")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.offpeak_cost}
                              onChange={handleInputChange("offpeak_cost")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Total Electric Charges ($)
                              {renderTooltip("Total electricity charges for the billing period")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.current_electric}
                              onChange={handleInputChange("current_electric")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Total Gas Charges ($)
                              {renderTooltip("Total gas charges for the billing period")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.current_gas}
                              onChange={handleInputChange("current_gas")}
                              className="w-full rounded-lg border bg-background p-2 text-sm"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              Total Bill Amount ($)
                              {renderTooltip("Total amount due for both electricity and gas")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={billData.total_amount}
                              onChange={handleInputChange("total_amount")}
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

