export default function FullResults() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <main className="bg-white p-8 rounded-lg shadow-md max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-6">Your Full PG&E Savings Report</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Potential Savings:</h2>
          <p className="text-3xl font-bold text-green-500">$275 per year</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Detailed Savings Breakdown:</h2>
          <ul className="list-disc pl-5">
            <li>Switch to time-of-use plan: $120/year</li>
            <li>Improve home insulation: $80/year</li>
            <li>Upgrade to energy-efficient appliances: $75/year</li>
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Step-by-Step Instructions:</h2>
          <ol className="list-decimal pl-5">
            <li className="mb-2">
              <strong>Switch to time-of-use plan:</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>Contact PG&E at 1-800-743-5000</li>
                <li>Request to switch to the E-TOU-C plan</li>
                <li>Start shifting energy usage to off-peak hours (before 4pm and after 9pm)</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Improve home insulation:</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>Schedule a home energy audit</li>
                <li>Focus on attic insulation and sealing air leaks</li>
                <li>Consider applying for PG&E's energy efficiency rebates</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Upgrade to energy-efficient appliances:</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>Replace old refrigerator with ENERGY STAR certified model</li>
                <li>Install a smart thermostat</li>
                <li>Switch to LED light bulbs throughout your home</li>
              </ul>
            </li>
          </ol>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Additional Resources:</h2>
          <ul className="list-disc pl-5">
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                PG&E Energy Saving Tips
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                California Energy Commission Rebates
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                ENERGY STAR Product Finder
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

