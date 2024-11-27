import React, { useState, useEffect } from "react";
import api from "../../Api";

function User() {
  const menuItems = [
    { id: 1, name: "Bills", icon: "receipt" },
    { id: 2, name: "Bookings", icon: "calendar" },
    { id: 3, name: "Users", icon: "user" },
    { id: 4, name: "Party Halls", icon: "building" },
    { id: 5, name: "Party Reservations", icon: "ticket" },
    { id: 6, name: "Payments", icon: "credit-card" },
    { id: 7, name: "Receptionist", icon: "user" },
    { id: 8, name: "Room Categories", icon: "tags" },
    { id: 9, name: "Rooms", icon: "door-open" },
    { id: 10, name: "Staff", icon: "users" },
    { id: 11, name: "Tours", icon: "map" },
    { id: 12, name: "Tour Reservations", icon: "bookmark" },
    { id: 13, name: "Users", icon: "user-circle" },
  ];
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      console.log(userDetails);
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
        <nav className="mt-4">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={`/admin/${item.name.toLowerCase()}`}
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <i className={`fas fa-${item.icon} w-6`}></i>
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </header>

        <main className="p-6">
          {/* Data Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                User Activities
              </h3>
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
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteUser(user.username)}
                            className="text-red-600 hover:text-red-900"
                          >
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
