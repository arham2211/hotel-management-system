import React, { useState, useEffect } from "react";
import api from "../../Api";
import Sidebar from "./Sidebar";

export default function Staff() {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [error, setError] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null); // Payment being edited
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For searching payment
  const [searchedPayment, setSearchedPayment] = useState(null); // Searched payment details

  // Fetch all payments
  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const response = await api.get("/staff/");
        setPaymentDetails(response.data);
        console.log(response.data)
      } catch (err) {
        setError("Failed to fetch payment details");
        console.error("Error fetching payment details:", err);
      }
    };
    fetchAllPayments();
  }, []);

  // Fetch a specific payment based on ID
  const fetchPaymentById = async (id) => {
    try {
      const response = await api.get(`/payment/?payment_id=${id}`);
      setSearchedPayment(response.data); // Store the searched payment
    } catch (err) {
      setError("Payment not found");
      console.error("Error fetching payment:", err);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchPaymentById(searchQuery); // Fetch payment by ID
    }
  };

  // Delete Payment function
  const deletePayment = async (paymentId) => {
    try {
      await api.delete(`/payment/${paymentId}`);
      setPaymentDetails(
        paymentDetails.filter((payment) => payment.id !== paymentId)
      );
    } catch (err) {
      setError("Failed to delete payment");
      console.error(err);
    }
  };

   // Update Payment function
   const updatePayment = async (updatedPayment) => {
    try {
      const response = await api.put(
        `/payment/update/${editingPayment.id}?type=${updatedPayment.type}&amount=${updatedPayment.amount}&bill_id=${updatedPayment.bill_id}`
      );
      setPaymentDetails((prevDetails) =>
        prevDetails.map((payment) =>
          payment.id === editingPayment.id ? response.data : payment
        )
      );
      setModalOpen(false);
      setEditingPayment(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update payment details");
      console.error("Error updating payment:", err);
    }
  };

  // Open modal for editing payment
  const handleEditClick = (payment) => {
    setEditingPayment(payment);
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
          {/* Display searched payment */}
          {searchedPayment && (
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
                        Type:
                      </span>
                      <span className="text-gray-800">
                      {searchedPayment[0].type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        Amount:
                      </span>
                      <span className="text-gray-800">
                      ${searchedPayment[0].amount}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">
                        Bill Id:
                      </span>
                      <span className="text-gray-800">
                        {searchedPayment[0].bill_id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleEditClick(searchedPayment[0])}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePayment(searchedPayment[0].id)}
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
                  Staff Details
                </h3>

                {/* <div className="mb-4">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Search payment by ID"
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
                </div> */}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager ID
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {paymentDetails.length > 0 ? (
                    paymentDetails.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4">{payment.id}</td>
                        <td className="px-6 py-4">{payment.name}</td>
                        <td className="px-6 py-4">{payment.Salary}</td>
                        <td className="px-6 py-4">
                          {payment.designation}
                        </td>
                        <td className="px-6 py-4">
                          {payment.Manager_id}
                        </td>
{/* 
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditClick(payment)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePayment(payment.id)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                          >
                            Delete
                          </button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center px-6 py-4">
                        No Staff found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for editing bill */}
          {modalOpen && editingPayment && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50">
              <div className="relative max-w-lg mx-auto mt-16 bg-white rounded-lg shadow-xl">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Edit Payment
                  </h3>
                  <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updatePayment({
                          type: e.target.type.value,
                          amount: e.target.amount.value,
                          bill_id: e.target.bill_id.value
                      });
                    }}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="first_name"
                        className="block text-gray-600 font-medium"
                      >
                        Type
                      </label>
                      <input
                        type="text"
                        name="type"
                        defaultValue={editingPayment.type}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="last_name"
                        className="block text-gray-600 font-medium"
                      >
                        Amount
                      </label>
                      <input
                        type="text"
                        name="amount"
                        defaultValue={editingPayment.amount}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phone_number"
                        className="block text-gray-600 font-medium"
                      >
                        Bill ID
                      </label>
                      <input
                        type="text"
                        name="bill_id"
                        defaultValue={editingPayment.bill_id}
                        className="w-full px-3 py-2 border rounded-md"
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
