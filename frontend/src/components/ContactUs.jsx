import React from "react";

const ContactUs = () => {
  return (
    <div className="container px-10 mx-auto py-10">
      <div className="text-center mb-14">
        <div className="flex items-center justify-center">
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          <h2 className="text-[1.2rem] text-[#ff8c00] font-bold uppercase py-3 px-1">
            Contact Us
          </h2>
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
        </div>
        <h1 className="text-5xl font-bold mb-16">
          <span className="uppercase text-[#ff8c00]">Contact</span> For Any
          Query
        </h1>

        {/* Contact Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Booking */}
          <div>
            <div className="flex items-center justify-center">
              <h3 className="text-xl font-semibold text-[#ff8c00]">BOOKING</h3>
              <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
            </div>
            <p className="text-gray-700 mt-2">book@example.com</p>
          </div>
          {/* General */}
          <div>
            <div className="flex items-center justify-center">
              <h3 className="text-xl font-semibold text-[#ff8c00]">GENERAL</h3>
              <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
            </div>
            <p className="text-gray-700 mt-2">info@example.com</p>
          </div>
          {/* Technical */}
          <div>
            <div className="flex items-center justify-center">
              <h3 className="text-xl font-semibold text-[#ff8c00]">
                TECHNICAL
              </h3>
              <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
            </div>
            <p className="text-gray-700 mt-2">tech@example.com</p>
          </div>
        </div>

        {/* Map and Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="h-80">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24192.842116423207!2d-74.0060157!3d40.7127281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250b5fce00e45%3A0xb6852e7ad3a844d5!2sNew%20York!5e0!3m2!1sen!2sus!4v1688311134586!5m2!1sen!2sus"
              width="100%"
              height="480px"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-lg p-8 rounded-lg">
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Message"
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#ff8c00] text-white p-3 rounded-lg font-semibold hover:bg-orange-600"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
