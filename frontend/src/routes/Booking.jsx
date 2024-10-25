import React, { useState } from "react";

const Booking = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
    adults: "",
    kids: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">
        Please complete the form below.
      </h2>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Full Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Phone Number and Email */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="(000) 000-0000"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Room Category</label>
        <select
          name="roomCategory"
          value={formData.roomCategory}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a category</option>
          <option value="junior suite">Junior Suite</option>
          <option value="executive suite">Executive Suite</option>
          <option value="super deluxe">Super Deluxe</option>
          <option value="deluxe">Deluxe</option>
        </select>
      </div>

      {/* Arrival Date and Time */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Check In - Date</label>
        <div className="flex gap-2">
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Departure Date and Time */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">
          Check Out - Date
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Number of Adults and Kids */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Number of Adults</label>
        <input
          type="number"
          name="adults"
          placeholder="ex: 23"
          value={formData.adults}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">
          Number of Kids (If there are any)
        </label>
        <input
          type="number"
          name="kids"
          placeholder="ex: 23"
          value={formData.kids}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Payment Method</label>
        <div className="flex items-center gap-4">
        <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="Bank Transfer"
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Bank Transfer</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="Check"
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Check</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="Paypal"
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Paypal</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
    </div>
  );
};

export default Booking;
