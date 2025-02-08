import Link from "next/link"
import { ChevronRight, Zap, Clock, Shield, Users, BarChart, Award } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Testimonials } from "@/components/testimonials"

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-text mb-6">Calculate Your PG&E Bill Savings in Minutes</h1>
            <p className="text-xl text-primary/80 mb-12 max-w-2xl mx-auto">
              Upload your bill or enter your usage details to discover personalized savings opportunities. Get
              actionable insights to reduce your energy costs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center">
              <Link
                href="/input"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-lg font-semibold text-primary hover:bg-accent/90 transition-colors"
              >
                Calculate savings
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card text-center">
              <div className="text-3xl font-bold text-primary mb-2">30%</div>
              <div className="text-primary/60">Average savings found</div>
            </div>
            <div className="feature-card text-center">
              <div className="text-3xl font-bold text-primary mb-2">5 min</div>
              <div className="text-primary/60">Time to complete</div>
            </div>
            <div className="feature-card text-center">
              <div className="text-3xl font-bold text-primary mb-2">100K+</div>
              <div className="text-primary/60">Bills analyzed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our PG&E Bill Analysis?</h2>
            <p className="text-lg text-primary/60">
              We're constantly improving our analysis accuracy to help you save more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Energy Usage Analysis</h3>
              <p className="text-primary/60">
                Get detailed insights into your energy consumption patterns and identify peak usage periods.
              </p>
            </Card>
            <Card className="feature-card">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time-of-Use Optimization</h3>
              <p className="text-primary/60">
                Learn how to save by shifting your energy usage to off-peak hours with personalized schedules.
              </p>
            </Card>
            <Card className="feature-card">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate Plan Comparison</h3>
              <p className="text-primary/60">
                Compare different PG&E rate plans to find the most cost-effective option for your usage pattern.
              </p>
            </Card>
            <Card className="feature-card">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Household Benchmarking</h3>
              <p className="text-primary/60">See how your energy usage compares to similar households in your area.</p>
            </Card>
            <Card className="feature-card">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Savings Projections</h3>
              <p className="text-primary/60">
                Get detailed estimates of potential savings based on recommended changes.
              </p>
            </Card>
            <Card className="feature-card">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rebate Opportunities</h3>
              <p className="text-primary/60">
                Discover available rebates and incentives for energy-efficient upgrades.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="hero-text mb-4">Experience the Difference</h2>
            <p className="text-lg text-primary/60">
              Join thousands of satisfied customers who have reduced their PG&E bills
            </p>
          </div>
          <Testimonials />
          <div className="text-center mt-12">
            <Link
              href="/input"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-lg font-semibold text-primary hover:bg-accent/90 transition-colors"
            >
              Try it yourself
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Saving?</h2>
          <p className="text-lg text-primary/60 mb-8">
            Upload your PG&E bill now and discover your savings potential in minutes.
          </p>
          <Link
            href="/input"
            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-lg font-semibold text-primary hover:bg-accent/90 transition-colors"
          >
            Calculate my savings
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

