import React from 'react'
import Header from '../components/Header'

const TermsAndConditions = () => {
  return (
    <div>
<Header />
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
      <p className="mb-4">By using this site, you agree to these terms.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>You must be 18+ to make purchases.</li>
        <li>All content is protected by copyright.</li>
        <li>We reserve the right to cancel any order.</li>
        <li>We use Razorpay for secure payment processing.</li>
      </ul>
      <h2 className="mt-4 font-semibold">Contact</h2>
         <p>Email: contact@ishop31.com | Phone: +91-9876543210</p>

    </div>
    </div>
  )
}

export default TermsAndConditions
