import React, { useState, useEffect, useContext } from "react";
import api from "../Api";
import { AuthContext } from "../context/UserContext";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [userData, setUserData] = useState([]);
  const [tourDataMap, setTourDataMap] = useState({});
  const [eventDataMap, setEventDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTour, setExpandedTour] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const navigate = useNavigate();
  const { setToken, userId, setUserId } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/bill/details/?user_id=${userId}`);
        setUserData(response.data);

        const eventDataPromises = response.data.map(async (booking) => {
          try {
            const eventResponse = await api.get(
              `/party/details/?bill_id=${
                booking.all_payments[0].bill_id
              }&user_id=${parseInt(userId)}`
            );
            return { [booking.all_payments[0].bill_id]: eventResponse.data };
          } catch (err) {
            console.error(
              `Error fetching event data for booking ${booking.all_payments[0].bill_id}:`,
              err
            );
            return { [booking.all_payments[0].bill_id]: [] };
          }
        });

        const eventResults = await Promise.all(eventDataPromises);
        const combinedEventData = eventResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setEventDataMap(combinedEventData);

        const tourDataPromises = response.data.map(async (booking) => {
          try {
            const tourResponse = await api.get(
              `/tour/details/?bill_id=${
                booking.all_payments[0].bill_id
              }&user_id=${parseInt(userId)}`
            );
            return { [booking.all_payments[0].bill_id]: tourResponse.data };
          } catch (err) {
            console.error(
              `Error fetching tour data for booking ${booking.all_payments[0].bill_id}:`,
              err
            );
            return { [booking.all_payments[0].bill_id]: [] };
          }
        });

        const tourResults = await Promise.all(tourDataPromises);
        const combinedTourData = tourResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setTourDataMap(combinedTourData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUserId(null);
    setToken(null);
    navigate("/"); // Redirect to the home page
  };

  const toggleTourDetails = (tourId) => {
    setExpandedTour(expandedTour === tourId ? null : tourId);
  };
  const toggleEventDetails = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  // const togglePaymentDetails = (paymentId) => {
  //   setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
  // };

  // Calculate total for each booking and its associated tours
  const calculateBookingTotal = (booking) => {
    // Sum of booking payments
    const bookingPaymentsTotal = booking.all_payments
      .filter((payment) => payment.type === "Booking")
      .reduce((sum, payment) => sum + payment.amount, 0);

    //Sum of party payments
    const partyPaymentsTotal = booking.all_payments
      .filter((payment) => payment.type === "Party")
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Sum of tour payments
    const tourPaymentsTotal = booking.all_payments
      .filter((payment) => payment.type === "Tour")
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      bookingTotal: bookingPaymentsTotal,
      partyTotal: partyPaymentsTotal,
      tourTotal: tourPaymentsTotal,
      total: bookingPaymentsTotal + tourPaymentsTotal + partyPaymentsTotal
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!userData.length) return null;

  // Calculate grand total
  const grandTotal = userData.reduce((sum, booking) => {
    const totals = calculateBookingTotal(booking);
    return sum + totals.total;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* User Header Section */}
        <div className="border-b pb-6">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center 2xl:text-[1.6rem] bg-[#ff8c00] text-[#ffffff] sm:px-4 sm:py-2 md:px-3 md:py-2 lg:px-6 lg:py-[0.7rem] 2xl:px-6 2xl:py-3 rounded-full transition-colors duration-300 ease-in-out hover:text-[#002366]"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="ml-1 sm:ml-2">Logout</span>
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Username</p>
              <p className="font-semibold">{userData[0].customer.username}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{userData[0].customer.email}</p>
            </div>
          </div>
        </div>

        {/* Booking Details Section */}
        {userData.map((data, index) => {
          const bookingTotals = calculateBookingTotal(data);

          return (
            <div key={index} className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Booking Details #{index + 1}
              </h2>

              {/* Booking Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="font-semibold">
                      {data.first_name} {data.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone Number</p>
                    <p className="font-semibold">{data.phone_number}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-semibold">
                      {data.associated_booking.start_date}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">End Date</p>
                    <p className="font-semibold">
                      {data.associated_booking.end_date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Payments */}
              <div className="mt-6 ms-6">
                <h2 className="text-[1.28rem] underline font-bold text-gray-800 mb-4">
                  Booking Payments:
                </h2>
                <div className="space-y-4">
                  {data.all_payments.map(
                    (payment, paymentIndex) =>
                      payment.type === "Booking" && (
                        <div
                          key={paymentIndex}
                          className="p-4 rounded-lg bg-blue-50"
                        >
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-gray-600">Bill No.</p>
                              <p className="font-semibold">
                                #{payment.bill_id}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-semibold">
                                ${payment.amount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Type</p>
                              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                {payment.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Event Section */}
              <div className="mt-6 ms-6">
                <h2 className="text-[1.28rem] underline font-bold text-gray-800 mb-4">
                  Events for Booking #{index + 1}:
                </h2>
                <div className="space-y-4">
                  {eventDataMap[data.all_payments[0].bill_id]?.map(
                    (eventData, eventIndex) =>
                      eventData.associated_hall && (
                        <div key={eventIndex} className="border rounded-lg">
                          <button
                            onClick={() =>
                              toggleEventDetails(eventData.associated_hall.id)
                            }
                            className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                          >
                            <span className="font-semibold">
                              Event #{eventIndex + 1}
                            </span>
                            {expandedEvent === eventData.associated_hall.id ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </button>

                          {expandedEvent === eventData.associated_hall.id && (
                            <div className="p-4 bg-gray-50">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-600">Type</p>
                                  <p className="font-semibold">
                                    {eventData.type}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Hall name</p>
                                  <p className="font-semibold">
                                    {eventData.associated_hall.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Start Time</p>
                                  <p className="font-semibold">
                                    {new Date(
                                      eventData.start_time
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">End Time</p>
                                  <p className="font-semibold">
                                    {new Date(
                                      eventData.end_time
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Capacity</p>
                                  <p className="font-semibold">{eventData.associated_hall.capacity}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Amount</p>
                                  <p className="font-semibold">
                                    ${eventData.associated_payment.amount}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Tours Section */}
              <div className="mt-6 ms-6">
                <h2 className="text-[1.28rem] underline font-bold text-gray-800 mb-4">
                  Tours for Booking #{index + 1}:
                </h2>
                <div className="space-y-4">
                  {tourDataMap[data.all_payments[0].bill_id]?.map(
                    (tourData, tourIndex) =>
                      tourData.associated_tour && (
                        <div key={tourIndex} className="border rounded-lg">
                          <button
                            onClick={() =>
                              toggleTourDetails(tourData.associated_tour.id)
                            }
                            className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                          >
                            <span className="font-semibold">
                              Tour #{tourIndex + 1}
                            </span>
                            {expandedTour === tourData.associated_tour.id ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </button>

                          {expandedTour === tourData.associated_tour.id && (
                            <div className="p-4 bg-gray-50">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-600">Location</p>
                                  <p className="font-semibold">
                                    {tourData.associated_tour.location}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Price</p>
                                  <p className="font-semibold">
                                    ${tourData.associated_tour.price}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Tour Guide</p>
                                  <p className="font-semibold">
                                    {tourData.associated_tour.tour_guide_id}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Time</p>
                                  <p className="font-semibold">
                                    {tourData.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Booking Subtotal */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end space-x-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Booking Payments</p>
                    <p className="text-lg font-bold text-gray-800">
                      ${bookingTotals.bookingTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Event Payments</p>
                    <p className="text-lg font-bold text-gray-800">
                      ${bookingTotals.partyTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Tour Payments</p>
                    <p className="text-lg font-bold text-gray-800">
                      ${bookingTotals.tourTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600">Booking Total</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${bookingTotals.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Grand Total */}
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-end">
            <div className="bg-blue-100 p-6 rounded-lg">
              <p className="text-gray-700 text-lg">Grand Total</p>
              <p className="text-3xl font-bold text-blue-700">
                ${grandTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
