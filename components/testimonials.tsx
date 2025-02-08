"use client"

import { Quote } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "After implementing the recommended changes, my monthly bill dropped by over $100. The analysis was spot-on!",
    author: "Sarah M.",
    location: "San Francisco, CA",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    quote:
      "I was skeptical at first, but the savings are real. The time-of-use optimization tips alone made a huge difference.",
    author: "Michael R.",
    location: "San Jose, CA",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    quote:
      "The analysis helped me understand my usage patterns and make simple changes that led to significant savings.",
    author: "Jennifer L.",
    location: "Oakland, CA",
    image: "https://images.pexels.com/photos/7275385/pexels-photo-7275385.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
]

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="testimonial-card">
          <div className="flex flex-col h-full">
            <Quote className="h-8 w-8 text-accent mb-4" />
            <blockquote className="mb-6 text-lg text-primary/80 flex-grow">{testimonial.quote}</blockquote>
            <div className="flex items-center gap-3">
              <Image
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.author}
                width={64}
                height={64}
                className="rounded-full"
              />
              <footer className="text-left">
                <div className="font-semibold text-primary">{testimonial.author}</div>
                <div className="text-sm text-primary/60">{testimonial.location}</div>
              </footer>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

