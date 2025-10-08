import React from 'react'
import Header from '../components/Header'

const RefundPolicy = () => {
  return (
    <div>
<Header />

    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Refund & Cancellation Policy</h1>
      <p className="mb-4">
        You may cancel your order within 24 hours. Refunds are processed within 5–7 business days.
      </p>
      <h2 className="font-semibold">Cancellation</h2>
      <p className="mb-4">
        Email us at support@example.com with your order ID to cancel.
      </p>
      <h2 className="font-semibold">Refunds</h2>
      <p className="mb-4">
        Refunds are eligible within 7 days of purchase for defective/delayed orders.
      </p>
      <h2 className="font-semibold">Contact</h2>
           <p>Email: contact@ishop31.com | Phone: +91-9876543210</p>

    </div>
    </div>
  )
}

export default RefundPolicy
