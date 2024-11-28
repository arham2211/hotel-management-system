import React, { useState, useEffect } from "react";
import api from "../../Api";
import Sidebar from "./Sidebar";

function User() {
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [searchedUser, setSearchedUser] = useState(null); // State to store the searched user

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await api.get("/users/");
        setUserDetails(response.data);
      } catch (err) {
        setError("Failed to fetch user details");
        console.error("Error fetching user details:", err);
      }
    };
    fetchAllUsers();
  }, []);

  // Fetch a specific user based on ID
  const fetchUserById = async (id) => {
    try {
      console.log(id);
      const response = await api.get(`/users/${id}`);
      setSearchedUser(response.data); // Store the specific user data
    } catch (err) {
      setError("User not found");
      console.error("Error fetching user:", err);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchUserById(searchQuery); // Fetch the user by ID
    }
  };

  // Delete user function
  const deleteUser = async (username) => {
    try {
      await api.delete(`/users/${username}/`);
      setUserDetails(userDetails.filter((user) => user.username !== username));
    } catch (err) {
      setError("Failed to delete user details");
      console.error(err);
    }
  };

  // Update user function
  const updateUser = async (updatedUser) => {
    try {
      const response = await api.post(
        `/users/update/${editingUser.previousUsername}?new_username=${updatedUser.username}&new_email=${updatedUser.email}&new_password=${updatedUser.password}`
      );
      setUserDetails((prevDetails) =>
        prevDetails.map((user) =>
          user.username === editingUser.previousUsername ? response.data : user
        )
      );
      setModalOpen(false);
      setEditingUser(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user details");
      console.error("Error updating user:", err);
    }
  };

  // Open modal for editing
  const handleEditClick = (user) => {
    setEditingUser({
      ...user,
      previousUsername: user.username, // Preserve the original username
    });
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
          {/* Display searched user */}
          {searchedUser && (
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search Result
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-24">
                        Username:
                      </span>
                      <span className="text-gray-800">
                        {searchedUser.username}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-24">
                        Email:
                      </span>
                      <span className="text-gray-800">
                        {searchedUser.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleEditClick(searchedUser)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(searchedUser.username)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
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
                  User Activities
                </h3>

                <div className="mb-4">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Search user by ID"
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
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userDetails.length > 0 ? (
                    userDetails.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-2"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(user.username)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                      >
                        {error || "No users available."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Modal */}
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Edit User</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateUser(editingUser);
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      value={editingUser.password || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          password: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="mr-2 px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default User;
