import Link from "next/link"

export default function Results() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <main className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Your PG&E Savings Results</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Potential Savings:</h2>
          <p className="text-3xl font-bold text-green-500">$150 - $300 per year</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How You Can Save:</h2>
          <ul className="list-disc pl-5">
            <li>Switch to a time-of-use plan</li>
            <li>Improve home insulation</li>
            <li>Upgrade to energy-efficient appliances</li>
            <li>... and more!</li>
          </ul>
        </div>
        <p className="mb-6">
          To see your full personalized savings report and step-by-step instructions, unlock your full results now!
        </p>
        <Link
          href="/payment"
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center"
        >
          Unlock Full Results
        </Link>
      </main>
    </div>
  )
}

