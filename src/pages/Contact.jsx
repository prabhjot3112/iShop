import React from 'react'
import Header from '../components/Header'

const Contact = () => {
  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-10">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div>
            <img
              src="https://www.creativefabrica.com/wp-content/uploads/2020/02/10/Building-Logo-Graphics-1.jpg"
              alt="Contact Us"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Contact Info & Form */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
              <p className="text-gray-700">We'd love to hear from you! Reach out with any questions, comments, or just to say hello.</p>

              <div className="mt-4 space-y-2 text-gray-800">
                <p><strong>📍 Address:</strong> B wing, CF Building,
MIHAN SEZ, Nagpur, MH, 441108</p>
                <p><strong>📞 Phone:</strong> (+91) 9876543210</p>
                <p><strong>✉️ Email:</strong> contact@ishop31.com</p>
      
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
