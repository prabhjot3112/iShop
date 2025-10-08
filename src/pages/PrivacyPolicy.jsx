import React from 'react'
import Header from '../components/Header'

const PrivacyPolicy = () => {
  return (
    <div>
<Header />
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        We value your privacy and are committed to protecting your personal information.
      </p>
      <h2 className="font-semibold">Information We Collect</h2>
      <p className="mb-4">
        Name, email, phone, and payment details when you purchase from us.
      </p>
      <h2 className="font-semibold">How We Use Your Information</h2>
      <p className="mb-4">
        To process your orders, send updates, and improve our services.
      </p>
      <h2 className="font-semibold">Contact</h2>
      <p>Email: contact@ishop31.com | Phone: +91-9876543210</p>
    </div>
    </div>
  )
}

export default PrivacyPolicy
