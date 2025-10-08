import React from 'react'
import Header from '../components/Header'

const ShippingPolicy = () => {
  return (
    <div>
<Header />
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shipping & Delivery Policy</h1>
      <p className="mb-4">
        We deliver digital or physical products depending on the order type.
      </p>
      <h2 className="font-semibold">Digital Products</h2>
      <p className="mb-4">Delivered instantly via email/download link.</p>
      <h2 className="font-semibold">Physical Products</h2>
      <p className="mb-4">Processed in 1–2 days. Delivered within 5–7 days.</p>
      <h2 className="font-semibold">Contact</h2>
            <p>Email: contact@ishop31.com | Phone: +91-9876543210</p>

    </div>
    </div>
  )
}

export default ShippingPolicy
