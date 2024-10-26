import React, { useState, useContext, useEffect } from "react";
import api from "../Api";
import { AuthContext } from "../context/UserContext";

const BookingForm = () => {
  const defaultFormData = {
    user_id: 0,
    start_date: "",
    total_cost: 0,
    end_date: "",
    num_people: 0,
    first_name: "",
    last_name: "",
    phone_number: "",
    room_cat_id: 0,
  };
  const defaultExtraInformation = {
    room_price: 0,
    adults: 0,
    kids: 0,
    room_cat_name: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [extraInformation, setExtraInformation] = useState(
    defaultExtraInformation
  );
  const { token, userId } = useContext(AuthContext);

  const calculateTotalCost = (price) => {
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      console.log(days);
      return days > 0 ? days * price : 0;
    }
    return 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      total_cost: calculateTotalCost(extraInformation.room_price),
    }));
  }, [formData.start_date, formData.end_date]); // Only run when start_date or end_date changes

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "room_cat_name") {
      try {
        const response = await api.get(`/rooms/catprice/${value}/`);
        const roomData = response.data[0];
        console.log(roomData);
        const totalCost = calculateTotalCost(roomData.price);

        setFormData((prevData) => ({
          ...prevData,
          room_cat_id: roomData.id,
          total_cost: totalCost,
        }));
        setExtraInformation((prevInfo) => ({
          ...prevInfo,
          room_cat_name: value,
          room_price: roomData.price,
        }));
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    } else if (name === "start_date" || name === "end_date") {
      setFormData((prevData) => {
        const updatedFormData = { ...prevData, [name]: value };
        const totalCost = calculateTotalCost(extraInformation.room_price);
        return { ...updatedFormData, total_cost: totalCost };
      });
    } else if (name === "adults" || name === "kids") {
      setExtraInformation((prevInfo) => ({
        ...prevInfo,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please register or login first.");
      return;
    }

    const numPeople = extraInformation.adults + extraInformation.kids;
    const formattedData = {
      ...formData,
      start_date: formatDate(formData.start_date),
      end_date: formatDate(formData.end_date),
      user_id: parseInt(userId),
      num_people: numPeople,
    };
    console.log(formattedData);

    try {
      const response = await api.post("/bookings/", formattedData);
      console.log("Response:", response.data);
      setFormData(defaultFormData);
      setExtraInformation(defaultExtraInformation);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">
        Please complete the form below.
      </h2>

      <form action="" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Full Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            placeholder="(000) 000-0000"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Room Category</label>
          <select
            name="room_cat_name"
            value={extraInformation.room_cat_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a category</option>
            <option value="Junior Suite">Junior Suite</option>
            <option value="Executive Suite">Executive Suite</option>
            <option value="Super Deluxe">Super Deluxe</option>
            <option value="Deluxe">Deluxe</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Check In - Date</label>
          <div className="flex gap-2">
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Check Out - Date</label>
          <div className="flex gap-2">
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Number of Adults</label>
          <input
            type="number"
            name="adults"
            placeholder="ex: 2"
            value={extraInformation.adults}
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
            placeholder="ex: 1"
            value={extraInformation.kids}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
