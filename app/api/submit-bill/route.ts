import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const file = formData.get("file") as File | null

    // Check if required environment variables are set
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.ADMIN_EMAIL) {
      console.error("Missing required environment variables for email configuration")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Prepare email content
    let emailContent = `
      New PG&E Bill Submission:
      Name: ${name}
      Email: ${email}
    `

    if (file) {
      emailContent += `
      File attached: ${file.name}`
    } else {
      // Add manual input data to email content
      formData.forEach((value, key) => {
        if (key !== "name" && key !== "email") {
          emailContent += `
      ${key}: ${value}`
        }
      })
    }

    // Send email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New PG&E Bill Submission",
        text: emailContent,
        attachments: file
          ? [
              {
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()),
              },
            ]
          : [],
      })
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ message: "Submission received successfully" }, { status: 200 })
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json({ error: "Failed to process submission" }, { status: 500 })
  }
}

