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
  const [error, setError] = useState(""); // For error messages
  const [locationId,SetLocationId] = useState(null);

  const calculateTotalCost = (price) => {
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
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
        SetLocationId(roomData.id)
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
          capacity: roomData.capacity, // Store capacity for validation
        }));
        setError(""); // Clear error on valid room selection
      } catch (error) {
        console.error("Error fetching room details:", error);
        setError("Failed to fetch room details. Please try again.");
      }
    } else if (name === "adults" || name === "kids") {
      const updatedPeople = {
        ...extraInformation,
        [name]: parseInt(value) || 0,
      };
      const totalPeople =
        (updatedPeople.adults || 0) + (updatedPeople.kids || 0);

      // Check against room capacity
      if (
        extraInformation.capacity &&
        totalPeople > extraInformation.capacity
      ) {
        setError(
          `The total number of people (${totalPeople}) exceeds the room capacity of ${extraInformation.capacity}.`
        );
      } else {
        setError(""); // Clear error if within capacity
      }

      setExtraInformation(updatedPeople);
    } else if (name === "start_date" || name === "end_date") {
      setFormData((prevData) => {
        const updatedFormData = { ...prevData, [name]: value };
        const totalCost = calculateTotalCost(extraInformation.room_price);
        return { ...updatedFormData, total_cost: totalCost };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const isBookingFormComplete = () => {
    return (
      formData.first_name &&
      formData.last_name &&
      formData.phone_number &&
      formData.start_date &&
      formData.end_date &&
      extraInformation.room_cat_name &&
      (extraInformation.adults > 0 || extraInformation.kids > 0) &&
      error === ""
    );
  };
  // Add new states for payment visibility and form completion
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [isCardDetailsComplete, setIsCardDetailsComplete] = useState(false);
  const [rooms, setRooms] = useState([]);

  // Payment form states
  const [cardHolder, setCardHolder] = useState("YOUR NAME");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  const [expiry, setExpiry] = useState("MM/YY");
  const [cvv, setCvv] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please register or login first.");
      return;
    }

    const numPeople = extraInformation.adults + extraInformation.kids;
    if (numPeople > extraInformation.capacity) {
      setError(
        `Cannot proceed: total number of people (${numPeople}) exceeds the room capacity of ${extraInformation.capacity}.`
      );
      return;
    }
    const formattedData = {
      ...formData,
      start_date: formatDate(formData.start_date),
      end_date: formatDate(formData.end_date),
      user_id: parseInt(userId),
      num_people: numPeople,
    };

    try {
      const response = await api.post("/bookings/", formattedData);
      const data = await api.get(`/bookings/recent_booking/${userId}`);
      const bookingId = data.data.id;

      const constraints = await api.get(`/constraints/?room_id=${data.data.room_id}&room_cat_id=${locationId}`);

      const checkDatesConflict = (constraints.data || []).some((constraint) => {
        const { check_in_date: constraintStart, check_out_date: constraintEnd} = constraint;
        return (
          (formattedData.start_date >= constraintStart &&
            formattedData.start_date <= constraintEnd) || // New start date in range
          (formattedData.end_date >= constraintStart &&
            formattedData.end_date <= constraintEnd) || // New end date in range
          (constraintStart >= formattedData.start_date &&
            constraintStart <= formattedData.end_date) || // Existing start in range
          (constraintEnd >= formattedData.start_date &&
            constraintEnd <= formattedData.end_date) // Existing end in range
        );
      });

      if (checkDatesConflict) {
        const deletePayment = await api.delete(`/payment/${data.data.payment_id}`);
        const deleteBill = await api.delete(`/bill/?id=${data.data.bill_id}`);
        const deleteBooking = await api.delete(`/bookings/delete/${data.data.id}`);
        alert("The selected dates conflict with existing bookings.")
        setFormData(defaultFormData);
        setExtraInformation(defaultExtraInformation);
        setIsBookingComplete(false);
        throw new Error("The selected dates conflict with existing bookings.");
      }

      const response2 = await api.post("/constraints/",{booking_id: bookingId,room_id: data.data.room_id, check_in_date: formattedData.start_date, check_out_date: formattedData.end_date});

      const cardDetailsData = {
        card_holder: cardHolder,
        card_number: cardNumber,
        expiry_date: expiry,
        booking_id: bookingId,
      };
      const get_user_id = await api.get(`/cardDetails/${userId}`);
      
      if (!get_user_id.data) {
        const response2 = await api.post("/cardDetails/", cardDetailsData);
      } else {
        const response2 = await api.put(
          `/cardDetails/${userId}?card_holder=${cardDetailsData.card_holder}&card_number=${cardDetailsData.card_number}&expiry_date=${cardDetailsData.expiry_date}&booking_id=${cardDetailsData.booking_id}`
        );
      }

      setFormData(defaultFormData);
      setExtraInformation(defaultExtraInformation);
      setIsBookingComplete(true);
      alert("Booking and Payment successful!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    setIsPaymentComplete(true);
    // Then trigger the main form submission to create the booking
    handleSubmit(e);
    setShowPayment(false);
  };
  useEffect(() => {
    const validateCardDetails = () => {
      // Ensure all fields are valid
      return (
        cardHolder.trim().length > 0 && // Cardholder name must not be empty
        /^[a-zA-Z\s]+$/.test(cardHolder) && // Cardholder name must only contain letters and spaces
        cardNumber.trim().replace(/\s/g, "").length === 19 && // Card number should have 16 digits (ignore spaces)
        /^\d+$/.test(cardNumber.trim().replace(/\s/g, "")) && // Card number should consist only of digits
        /^\d{2}\/\d{2}$/.test(expiry) && // Expiry date should match MM/YY format
        /^\d{3}$/.test(cvv) && // CVV should be exactly 3 digits
        error === "" // No existing errors
      );
    };

    setIsCardDetailsComplete(validateCardDetails());
  }, [cardHolder, cardNumber, expiry, cvv, error]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/rooms/");
        setRooms(response.data);
      } catch (err) {
        setError("Failed to fetch locations");
        console.error("Error fetching locations:", err);
      }
    };
    fetchCategory();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          <h2 className="text-[1.2rem] text-[#ff8c00] font-bold uppercase py-3 px-1">
            Booking
          </h2>
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
        </div>
        <h1 className="text-5xl text-center font-bold mb-8">
          <span className="uppercase text-[#ff8c00]">Book</span> Your Stay
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Original booking form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                    />
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="(000) 000-0000"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                  />
                </div>

                {/* Room Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Room Category
                  </label>
                  <select
                    name="room_cat_name"
                    value={extraInformation.room_cat_name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                  >
                    <option value="">Select a category</option>
                    {rooms.map((cat) => (
                      <option key={cat.id} value={cat.type}>
                        {cat.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Check In Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Check Out Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                      required
                      min={formData.start_date ? 
                        new Date(new Date(formData.start_date).getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] 
                        : new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Guests Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Number of Adults
                    </label>
                    <input
                      type="number"
                      name="adults"
                      placeholder="ex: 2"
                      value={extraInformation.adults}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Number of Kids
                    </label>
                    <input
                      type="number"
                      name="kids"
                      placeholder="ex: 1"
                      value={extraInformation.kids}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3"
                    />
                  </div>
                </div>
              </form>

              {/* Payment Form */}
              {showPayment && (
                <div className="mt-8 flex justify-center">
                  <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Payment Details
                      </h2>
                      <p className="text-gray-500">
                        Complete your purchase securely
                      </p>
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
                          {cardNumber}
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <div className="text-xs opacity-75">
                              Card Holder
                            </div>
                            <div className="text-sm">{cardHolder}</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-75">Expires</div>
                            <div className="text-sm">{expiry}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Form */}
                    <form
                      onSubmit={handlePaymentSubmit}
                      className="mt-8 space-y-6"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                          placeholder=""
                          onChange={(e) =>
                            setCardHolder(e.target.value || "YOUR NAME")
                          }
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
                            setCardNumber(
                              e.target.value || "•••• •••• •••• ••••"
                            )
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
                            onChange={(e) =>
                              setExpiry(e.target.value || "MM/YY")
                            }
                          />
                          <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                            Expiry Date
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="password"
                            className="card-input block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none placeholder-transparent"
                            placeholder=""
                            maxLength="3"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                          />

                          <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                            CVV
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg transition-all duration-200 ${
                          isCardDetailsComplete
                            ? "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isCardDetailsComplete}
                      >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <svg
                            className={`h-5 w-5 ${
                              isCardDetailsComplete
                                ? "text-indigo-300 group-hover:text-indigo-400"
                                : "text-gray-300"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                        Pay Now
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Payment Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-20">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Booking Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Room Type</span>
                  <span className="font-medium text-gray-900">
                    {extraInformation.room_cat_name || "Not selected"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Price per night</span>
                  <span className="font-medium text-gray-900">
                    ${extraInformation.room_price}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">
                    {formData.start_date && formData.end_date
                      ? `${
                          (new Date(formData.end_date) -
                            new Date(formData.start_date)) /
                          (1000 * 60 * 60 * 24)
                        } nights`
                      : "0 nights"}
                  </span>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      ${formData.total_cost}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={!isBookingFormComplete()}
                  className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
                    !isBookingFormComplete()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
