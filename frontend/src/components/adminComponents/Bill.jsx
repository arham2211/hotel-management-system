import React, { useState, useEffect } from "react";
import api from "../../Api";
import Sidebar from "./Sidebar";

function Bill() {
  const [billDetails, setBillDetails] = useState([]);
  const [error, setError] = useState(null);
  const [editingBill, setEditingBill] = useState(null); // Renamed to editingBill
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [searchedBill, setSearchedBill] = useState(null); // State to store the searched bill

  // Fetch all bills
  useEffect(() => {
    const fetchAllBills = async () => {
      try {
        const response = await api.get("/bill/");
        setBillDetails(response.data);
      } catch (err) {
        setError("Failed to fetch bill details");
        console.error("Error fetching bill details:", err);
      }
    };
    fetchAllBills();
  }, []);

  // Fetch a specific bill based on ID
  const fetchBillById = async (id) => {
    try {
      const response = await api.get(`/bill/?bill_id=${id}`);
      console.log(response.data);
      setSearchedBill(response.data); // Store the specific bill data
    } catch (err) {
      setError("Bill not found");
      console.error("Error fetching bill:", err);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchBillById(searchQuery); // Fetch the bill by ID
    }
  };

  // Delete Bill function
  const deleteBill = async (billId) => {
    try {
      await api.delete(`/bill/?id=${billId}`);
      setBillDetails(billDetails.filter((bill) => bill.id !== billId));
    } catch (err) {
      setError("Failed to delete bill");
      console.error(err);
    }
  };

  // Update Bill function
  const updateBill = async (updatedBill) => {
    try {
      const response = await api.put(
        `/bill/update/${editingBill.id}?total_amount=${updatedBill.total_amount}&first_name=${updatedBill.first_name}&last_name=${updatedBill.last_name}&phone_number=${updatedBill.phone_number}`
      );
      setBillDetails((prevDetails) =>
        prevDetails.map((bill) =>
          bill.id === editingBill.id ? response.data : bill
        )
      );
      setModalOpen(false);
      setEditingBill(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bill details");
      console.error("Error updating bill:", err);
    }
  };

  // Open modal for editing
  const handleEditClick = (bill) => {
    setEditingBill(bill); // Set the bill to edit
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
          {/* Display searched bill */}
          {searchedBill && (
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
                      <span className="text-gray-600 font-medium pe-10">
                        Full Name:
                      </span>
                      <span className="text-gray-800">
                        {searchedBill[0].first_name} {searchedBill[0].last_name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium pe-1">
                        Phone Number:
                      </span>
                      <span className="text-gray-800">
                        {searchedBill[0].phone_number}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium pe-4">
                        Total Amount:
                      </span>
                      <span className="text-gray-800">
                        {searchedBill[0].total_amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleEditClick(searchedBill[0])}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBill(searchedBill[0].id)}
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
                  Bill Details
                </h3>

                <div className="mb-4">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Search bill by ID"
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
                      Fullname
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billDetails.length > 0 ? (
                    billDetails.map((bill) => (
                      <tr key={bill.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.first_name} {bill.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.phone_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bill.total_amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditClick(bill)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteBill(bill.id)}
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
                        No bills found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal for editing bill */}
          {modalOpen && editingBill && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50">
              <div className="relative max-w-lg mx-auto mt-16 bg-white rounded-lg shadow-xl">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Edit Bill Details
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateBill({
                        total_amount: e.target.total_amount.value,
                        first_name: e.target.first_name.value,
                        last_name: e.target.last_name.value,
                        phone_number: e.target.phone_number.value,
                      });
                    }}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="first_name"
                        className="block text-gray-600 font-medium"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        defaultValue={editingBill.first_name}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="last_name"
                        className="block text-gray-600 font-medium"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        defaultValue={editingBill.last_name}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phone_number"
                        className="block text-gray-600 font-medium"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        defaultValue={editingBill.phone_number}
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="total_amount"
                        className="block text-gray-600 font-medium"
                      >
                        Total Amount
                      </label>
                      <input
                        type="text"
                        id="total_amount"
                        name="total_amount"
                        defaultValue={editingBill.total_amount}
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

export default Bill;
