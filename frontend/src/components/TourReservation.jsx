import React, { useState, useContext, useEffect } from "react";
import api from "../Api";
import { AuthContext } from "../context/UserContext";
const Tour = () => {
  const initialBookingState = {
    location: "",
    date: "",
    time: "",
  };
  const { token, userId } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    time: "",
    tour_id: null,
    user_id: parseInt(userId),
  });
  const [cardHolder, setCardHolder] = useState("YOUR NAME");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  const [expiry, setExpiry] = useState("MM/YY");
  const [cvv, setCvv] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    const checkFormCompletion = () => {
      const requiredFields = {
        location: formData.location,
        date: formData.date,
        time: formData.time,
      };

      const isComplete = Object.values(requiredFields).every(
        (field) => field !== ""
      );

      setIsFormComplete(isComplete);
    };

    checkFormCompletion();
  }, [formData]);

  useEffect(() => {
    // Validate card details
    const validateCardDetails = () => {
      return (
        cardHolder.trim().length > 0 &&
        cardNumber.trim().length === 19 && // Validate formatted card number
        expiry.trim().length === 5 && // MM/YY format
        /^\d{2}\/\d{2}$/.test(expiry) && // Regex for MM/YY format
        /^\d{3}$/.test(document.querySelector('[placeholder="CVV"]').value) && // Validate CVV
        isFormComplete
      );
    };

    setIsPaymentComplete(validateCardDetails());
  }, [cardHolder, cardNumber, expiry, cvv, isFormComplete]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/tour/");

        setLocations(response.data);
      } catch (err) {
        setError("Failed to fetch locations");
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (e) => {
    const selectedLocation = locations.find(
      (location) => location.location === e.target.value
    );

    if (selectedLocation) {
      setFormData({
        ...formData,
        location: selectedLocation.location,
        tour_id: selectedLocation.id,
      });
      setPrice(selectedLocation.price);
    } else {
      setFormData({ ...formData, location: "", tour_id: null });
      setPrice(0);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!isPaymentComplete) return;

    setLoading(true);
    try {
      // Process payment
      // Assuming payment is successful
      const reservationData = {
        tour_id: formData.tour_id,
        user_id: formData.user_id,
        time: `${formData.date}T${formData.time}`,
      };

      const response = await api.post("/tour/", reservationData);

      // Reset all forms
      setFormData(initialBookingState);

      // Reset individual card form states
      setCardHolder("YOUR NAME");
      setCardNumber("•••• •••• •••• ••••");
      setExpiry("MM/YY");
      setCvv("");

      // Reset the actual form input values
      const cardInputs = document.querySelectorAll(".card-input");
      cardInputs.forEach((input) => {
        input.value = "";
      });

      setIsPaymentComplete(false);

      // Show success message
      alert("Booking successful!");
    } catch (error) {
      setError("Failed to process payment or create booking");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please register or login first.");
      return;
    }
    setLoading(true);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden">
        <div className="flex items-center justify-center">
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          <h2 className="text-[1.2rem] text-[#ff8c00] font-bold uppercase py-3 px-1">
            Planning
          </h2>
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
        </div>
        <h1 className="text-5xl text-center font-bold mb-8">
          <span className="uppercase text-[#ff8c00]">Plan</span> Your Tours
        </h1>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 px-6 py-8">
          {/* Left Section: Booking Form */}
          <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Tour Booking Form
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Experience the best of the city with our guided tours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select City
                  </label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={handleLocationChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Choose a Location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.location}>
                        {location.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tour Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">
                      Total Price:
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ${price}
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section: Payment Form */}
          <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            {/* Card Preview */}
            <div className="relative h-52 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white float-animation">
              <div className="absolute top-4 right-4">
                <svg className="h-8" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M45 35c0 2.209-1.791 4-4 4H7c-2.209 0-4-1.791-4-4V13c0-2.209 1.791-4 4-4h34c2.209 0 4 1.791 4 4v22z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
              <div className="mt-16">
                <div className="text-xl tracking-widest mb-2">{cardNumber}</div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs opacity-75">Card Holder</div>
                    <div className="text-sm">{cardHolder}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Expires</div>
                    <div className="text-sm">{expiry}</div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="mt-8 space-y-6">
              <div className="relative">
                <input
                  type="text"
                  className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder=""
                  onChange={(e) => setCardHolder(e.target.value || "YOUR NAME")}
                />
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                  Card Holder Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder=""
                  maxLength="19"
                  onChange={(e) =>
                    setCardNumber(e.target.value || "•••• •••• •••• ••••")
                  }
                />
                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                  Card Number
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder-transparent"
                    placeholder=""
                    maxLength="5"
                    onChange={(e) => setExpiry(e.target.value || "MM/YY")}
                  />
                  <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                    Expiry Date
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder-transparent"
                    placeholder="CVV"
                    maxLength="3"
                  />
                  <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                    CVV
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={!isPaymentComplete}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg transition-all duration-200 ${
                  isPaymentComplete
                    ? "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tour;
