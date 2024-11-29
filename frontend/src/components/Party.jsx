import React, { useState, useContext, useEffect } from "react";
import api from "../Api";
import { AuthContext } from "../context/UserContext";
import grandBallroom from "../assets/grand_ballroom.jpeg";
import gardenHall from "../assets/garden_hall.jpeg";
import royalSuite from "../assets/royal_suite.jpeg";

function EventBooking() {
  const { token, userId } = useContext(AuthContext);
  const initialBookingState = {
    type: "",
    date: "",
    start_time: "",
    end_time: "",
    guestCount: "",
    hall_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    additionalServices: [],
    user_id: "",
  };

  const [bookingDetails, setBookingDetails] = useState(initialBookingState);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fetchCardConsent, setFetchCardConsent] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    const checkFormCompletion = () => {
      const requiredFields = {
        type: bookingDetails.type,
        date: bookingDetails.date,
        start_time: bookingDetails.start_time,
        end_time: bookingDetails.end_time,
        guestCount: bookingDetails.guestCount,
        hall_id: bookingDetails.hall_id,
        first_name: bookingDetails.first_name,
        last_name: bookingDetails.last_name,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
      };

      const isComplete = Object.values(requiredFields).every(
        (field) => field !== ""
      );
    
      setIsFormComplete(isComplete);
    };

    checkFormCompletion();
  }, [bookingDetails]);

  useEffect(() => {
    // Fetch the booking period from the API (adjust the endpoint as necessary)
    const fetchBookingPeriod = async () => {
      try {
        const response = await api.get(`/bookings/recent_booking/${userId}`);
        if (response.data) {
          setStartDate(response.data.start_date);
          setEndDate(response.data.end_date);
        }
      } catch (err) {
        setError("Failed to fetch booking period");
        console.error("Error fetching booking period:", err);
      }
    };
    
    fetchBookingPeriod();

  }, []);



  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!fetchCardConsent) return;

      try {
        const response = await api.get(`/cardDetails/${userId}/details`);
        console.log(response)
        if (response.data) {
          const { card_holder, card_number, expiry_date } = response.data;

          setCardHolder((prev) => (prev === "" ? card_holder || prev : prev));
          setCardNumber((prev) => (prev === "" ? card_number || prev : prev));
          setExpiry((prev) => (prev === "" ? expiry_date || prev : prev));
        }
      } catch (error) {
        setError("Unable to pre-fill card details.");
      }
    };

    fetchCardDetails();
  }, [fetchCardConsent, userId]);

  useEffect(() => {
    // Validate card details
    const validateCardDetails = () => {
     
      return (
        cardHolder.trim().length > 0 && // Cardholder name must not be empty
        /^[a-zA-Z\s]+$/.test(cardHolder) && // Cardholder name must only contain letters and spaces
        cardNumber.trim().replace(/\s/g, "").length === 19 && // Card number should have 16 digits (ignore spaces)
        /^\d+$/.test(cardNumber.trim().replace(/\s/g, "")) && // Card number should consist only of digits
        /^\d{2}\/\d{2}$/.test(expiry) && // Expiry date should match MM/YY format
        /^\d{3}$/.test(cvv) && // CVV should be exactly 3 digits
        isFormComplete
      );
    };
   
    setIsPaymentComplete(validateCardDetails());
  }, [cardHolder, cardNumber, expiry, cvv, isFormComplete]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!isPaymentComplete) return;
    if (error != null) return

    setLoading(true);
    try {
      // Process payment
      // Assuming payment is successful
      const reservationData = {
        type: bookingDetails.type,
        total_amount: calculateTotal(),
        hall_id: bookingDetails.hall_id,
        user_id: bookingDetails.user_id,
        start_time: `${bookingDetails.date}T${bookingDetails.start_time}`,
        end_time: `${bookingDetails.date}T${bookingDetails.end_time}`,
      };

      const response = await api.post("/party/", reservationData);
      alert("Reservation and Payment Succesful");

      // Reset all forms
      setBookingDetails(initialBookingState);

      // Reset individual card form states
      setCardHolder("");
      setCardNumber("");
      setExpiry("");
      setCvv("");

      // Reset the actual form input values
      const cardInputs = document.querySelectorAll(".card-input");
      cardInputs.forEach((input) => {
        input.value = "";
      });

      setIsPaymentComplete(false);

      
    } catch (error) {
      setError("Failed to process payment or create booking");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await api.get("/party/halls/");

        setHalls(response.data);
      } catch (err) {
        setError("Failed to fetch halls");
        console.error("Error fetching halls:", err);
      }
    };
    fetchHalls();
  }, [token]);

  const hallImages = {
    "Grand Ballroom": grandBallroom,
    "Garden Hall": gardenHall,
    "Royal Suite": royalSuite,
  };

  const additionalServices = [
    { id: 1, name: "Catering Service", price: 25 },
    { id: 2, name: "Decoration Package", price: 500 },
    { id: 3, name: "DJ & Music System", price: 300 },
    { id: 4, name: "Photography Package", price: 400 },
  ];

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setBookingDetails((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleServiceToggle = (serviceId) => {
    setBookingDetails((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter((id) => id !== serviceId)
        : [...prev.additionalServices, serviceId],
    }));
  };

  const calculateTotal = () => {
    const hallPrice =
      halls.find((h) => h.id === parseInt(bookingDetails.hall_id))?.price || 0;
    const servicesTotal = bookingDetails.additionalServices.reduce(
      (sum, serviceId) => {
        const service = additionalServices.find((s) => s.id === serviceId);
        return sum + (service?.price || 0);
      },
      0
    );
    return hallPrice + servicesTotal;
  };

  const validateTimes = (updatedBookingDetails) => {
    const startDateTime = new Date(
      `${updatedBookingDetails.date}T${updatedBookingDetails.start_time}`
    );
    const endDateTime = new Date(
      `${updatedBookingDetails.date}T${updatedBookingDetails.end_time}`
    );
    return endDateTime > startDateTime;
  };

  useEffect(() => {
    if (userId) {
      setBookingDetails((prev) => ({
        ...prev,
        user_id: parseInt(userId),
      }));
    }
  }, [userId]);

  const validateForm = (updatedBookingDetails) => {
    const selectedHall = halls.find(
      (h) => h.id === parseInt(updatedBookingDetails.hall_id)
    );
  
    if (!selectedHall) {
      setError("Please select a hall");
      return false;
    }
  
    if (!validateTimes(updatedBookingDetails)) {
      setError("End time must be after start time");
      return false;
    }
  
    if (updatedBookingDetails.guestCount <= 0) {
      setError("Please enter a valid guest count");
      return false;
    }
  
    // Check if guest count exceeds hall capacity
    if (updatedBookingDetails.guestCount > selectedHall.capacity) {
      setError(
        `Guest count exceeds hall capacity. The selected hall can accommodate a maximum of ${selectedHall.capacity} guests.`
      );
      return false;
    }
  
    setError(null); // Clear any previous errors if validation passes
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => {
      const updatedBookingDetails = { ...prev, [name]: value };
      // Validate the form on each change
      validateForm(updatedBookingDetails);
      return updatedBookingDetails;
    });
  };
  
  
  useEffect(() => {
    validateForm(bookingDetails); // Validate form on each update
  }, [bookingDetails, halls]);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please register or login first.");
      return;
    }
    if (error != null) return

    if (!validateForm()) return;
    setLoading(true);
    setError(null);
  };

  const handleFetchCardConsent = () => {
    if (window.confirm("Would you like us to pre-fill your card details?")) {
      setFetchCardConsent(true);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex items-center justify-center">
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          <h2 className="text-[1.2rem] text-[#ff8c00] font-bold uppercase py-3 px-1">
            Reservations
          </h2>
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
        </div>
        <h1 className="text-5xl text-center font-bold mb-8">
          <span className="uppercase text-[#ff8c00]">Book</span> Your Events
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Booking Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Event Type
                    </label>
                    <select
                      name="type"
                      value={bookingDetails.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    >
                      <option value="">Select Event Type</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="wedding">Wedding Reception</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={bookingDetails.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                      min={startDate} // Disable dates before the start date
                      max={endDate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="start_time"
                      value={bookingDetails.start_time}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="end_time"
                      value={bookingDetails.end_time}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={bookingDetails.guestCount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Select Venue</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {halls.map((hall) => (
                    <div
                      key={hall.id}
                      className="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                    >
                      <input
                        type="radio"
                        name="hall_id"
                        value={hall.id}
                        onChange={handleInputChange}
                        className="hidden"
                        id={`hall-${hall.id}`}
                      />
                      <label
                        htmlFor={`hall-${hall.id}`}
                        className="cursor-pointer"
                      >
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                          <img
                            src={hallImages[hall.name] || "/placeholder.png"}
                            alt={hall.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                        <h3 className="font-semibold">{hall.name}</h3>
                        <p className="text-sm text-gray-600">
                          Capacity: {hall.capacity} guests
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          ${hall.price}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Additional Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {additionalServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        checked={bookingDetails.additionalServices.includes(
                          service.id
                        )}
                        onChange={() => handleServiceToggle(service.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label
                        htmlFor={`service-${service.id}`}
                        className="flex-1"
                      >
                        {service.name}
                      </label>
                      <span className="text-gray-600">${service.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={bookingDetails.first_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={bookingDetails.last_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingDetails.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingDetails.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right side - Payment Form */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow rounded-lg p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Total Amount</h2>
                <span className="text-3xl font-bold text-blue-600">
                  ${calculateTotal()}
                </span>
              </div>

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
                  <div className="text-xl tracking-widest mb-2">
                    {cardNumber === "" ? "•••• •••• •••• ••••" : cardNumber}
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs opacity-75">Card Holder</div>
                      <div className="text-sm">
                        {cardHolder === "" ? "Your Name" : cardHolder}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs opacity-75">Expires</div>
                      <div className="text-sm">
                        {expiry === "" ? "MM/YY" : expiry}
                      </div>
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
                    value={cardHolder} // Always respect state
                    onChange={(e) => setCardHolder(e.target.value || "")}
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
                    value={cardNumber}
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
                      className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder=""
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value || "MM/YY")}
                      maxLength="5"
                    />
                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                      Expiry Date
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder=""
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="3"
                    />
                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                      CVV
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFetchCardConsent}
                  className="mb-4 w-full bg-[#ff8c00] text-white py-3 px-4 rounded-lg"
                >
                  Pre-fill Card Details
                </button>

                <button
                  type="submit"
                  disabled={!isPaymentComplete}
                  onClick={handlePaymentSubmit}
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
    </div>
  );
}

export default EventBooking;
