import React, { useState, useEffect } from "react";
import api from "../../Api";
import Sidebar from "./Sidebar";

export default function Booking() {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedBooking, setSearchedBooking] = useState(null);


  // Fetch all bookings
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await api.get("/bookings/");
        setBookingDetails(response.data);
      } catch (err) {
        setError("Failed to fetch booking details");
        console.error("Error fetching booking details:", err);
      }
    };
    fetchAllBookings();
  }, []);

  // Fetch a specific booking based on ID
  const fetchBookingById = async (id) => {
    try {
      const response = await api.get(`/bookings/?booking_id=${id}`);
      setSearchedBooking(response.data);
    } catch (err) {
      setError("Booking not found");
      console.error("Error fetching booking:", err);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchBookingById(searchQuery);
    }
  };

  // Delete booking function
  const deleteBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/delete/${bookingId}`);
      setBookingDetails(
        bookingDetails.filter((booking) => booking.id !== bookingId)
      );
    } catch (err) {
      setError("Failed to delete booking");
      console.error(err);
    }
  };

  // Update booking function
  const updateBooking = async (updatedBooking) => {
    try {
      const response = await api.put(
        `/bookings/update/${editingBooking.id}?room_id=${updatedBooking.room_id}&start_date=${updatedBooking.start_date}&end_date=${updatedBooking.end_date}&num_people=${updatedBooking.num_people}`,
        updatedBooking
      );
      setBookingDetails((prevDetails) =>
        prevDetails.map((booking) =>
          booking.id === editingBooking.id ? response.data : booking
        )
      );
      setModalOpen(false);
      setEditingBooking(null);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update booking details"
      );
      console.error("Error updating booking:", err);
    }
  };

  // Open modal for editing
  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 bg-gray-900">
          <h1 className="text-xl font-bold">Hotel Admin</h1>
        </div>

        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </header>

        <main className="p-6">
          {/* Display searched booking */}
          {searchedBooking && (
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  Search Result
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        Booking ID:
                      </span>
                      <span className="text-gray-800">
                        
                      {searchedBooking[0].id}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        Room ID:
                      </span>
                      <span className="text-gray-800">
                        {searchedBooking[0].room_id}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        User ID:
                      </span>
                      <span className="text-gray-800">
                        {searchedBooking[0].user_id}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        Start Date:
                      </span>
                      <span className="text-gray-800">
                        {searchedBooking[0].start_date}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        End Date:
                      </span>
                      <span className="text-gray-800">
                        {searchedBooking[0].end_date}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        Number Of People
                      </span>
                      <span className="text-gray-800">
                        {searchedBooking[0].num_people}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleEditClick(searchedBooking[0])}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBooking(searchedBooking[0].id)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Data Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Booking Details
                </h3>

                <div className="mb-4">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Search booking by ID"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border rounded mr-2"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. of People
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingDetails.length > 0 ? (
                    bookingDetails.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.room_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.start_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.end_date}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.num_people}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center px-6 py-4">
                        No Bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for editing bill */}
          {modalOpen && editingBooking && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50">
              <div className="relative max-w-lg mx-auto mt-16 bg-white rounded-lg shadow-xl">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Edit Booking Details
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateBooking({
                        room_id: e.target.room_id.value,
                        start_date: e.target.start_date.value,
                        end_date: e.target.end_date.value,
                        num_people: e.target.num_people.value,
                        
                      });
                    }}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="room_id"
                        className="block text-gray-600 font-medium"
                      >
                        Room ID
                      </label>
                      <input
                        type="text"
                        id="room_id"
                        name="room_id"
                        defaultValue={editingBooking.room_id}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="start_date"
                        className="block text-gray-600 font-medium"
                      >
                        Start Date
                      </label>
                      <input
                        type="text"
                        id="start_date"
                        name="start_date"
                        defaultValue={editingBooking.start_date}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="end_date"
                        className="block text-gray-600 font-medium"
                      >
                        End Date
                      </label>
                      <input
                        type="text"
                        id="end_date"
                        name="end_date"
                        defaultValue={editingBooking.end_date}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="num_people"
                        className="block text-gray-600 font-medium"
                      >
                        Number Of People
                      </label>
                      <input
                        type="text"
                        id="num_people"
                        name="num_people"
                        defaultValue={editingBooking.num_people}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                   

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
