// UserProfile.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../Api";
import { AuthContext } from "../context/UserContext";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const Profile = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tourData, setTourData] = useState([]);
  const [error, setError] = useState(null);
  const [expandedTour, setExpandedTour] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/bill/details/?user_id=2`);
        const response2 = await api.get(`/tour/2/`);
        setUserData(response.data);
        setTourData(response2.data);
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
  const toggleTourDetails = (tourId) => {
    setExpandedTour(expandedTour === tourId ? null : tourId);
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

  const totalAmount = userData.reduce(
    (sum, data) => sum + data.total_amount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* User Header Section */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
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
        {userData.map((data, index) => (
          <div key={index} className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Booking Details #{index + 1}
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
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

            {/* Billing Section */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Billing History
              </h2>
              {/* Tours Section */}
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tours</h2>
                <div className="space-y-4">
                  {tourData.map((data, index) => {
                    console.log("Tour Data:", tourData);
                    console.log("User Data:", userData[index]?.all_payments[0]);
                    console.log(
                      "Comparison:",
                      data.associated_payment.bill_id,
                      "===",
                      userData[index]?.all_payments[0]?.bill_id
                    );

                    return (
                      tourData[index].associated_payment.bill_id ===
                        userData[index]?.all_payments[0].bill_id &&
                      data.associated_tour && (
                        <div
                          key={data.associated_tour.id}
                          className="border rounded-lg"
                        >
                          <button
                            onClick={() =>
                              toggleTourDetails(data.associated_tour.id)
                            }
                            className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                          >
                            <span className="font-semibold">
                              Tour #{data.associated_tour.id}
                              {data.associated_payment.bill_id}
                            </span>
                            {expandedTour === data.associated_tour.id ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </button>

                          {expandedTour === data.associated_tour.id && (
                            <div className="p-4 bg-gray-50">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-600">Location</p>
                                  <p className="font-semibold">
                                    {data.associated_tour.location}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Price</p>
                                  <p className="font-semibold">
                                    ${data.associated_tour.price}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Tour Guide</p>
                                  <p className="font-semibold">
                                    {data.associated_tour.tour_guide_id}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Time</p>
                                  <p className="font-semibold">{data.time}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Total Amount Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// // UserProfile.jsx
// import React, { useState, useEffect, useContext } from "react";
// import api from "../Api";
// import { AuthContext } from "../context/UserContext";
// import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

// const Profile = () => {
//   const [userData, setUserData] = useState([]);
//   const [tourData, setTourData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedTour, setExpandedTour] = useState(null);
//   const [expandedPayment, setExpandedPayment] = useState(null);

//   const { userId } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await api.get(`/bill/details/?user_id=2`);
//         const response2 = await api.get(`/tour/2/`);
//         setUserData(response.data);
//         setTourData(response2.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     if (userId) {
//       fetchUserData();
//     }
//   }, [userId]);

//   const toggleTourDetails = (tourId) => {
//     setExpandedTour(expandedTour === tourId ? null : tourId);
//   };

//   const togglePaymentDetails = (paymentId) => {
//     setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-red-100 p-4 rounded-lg">
//           <p className="text-red-600">Error: {error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!userData.length) return null;

//   const totalAmount = userData.reduce(
//     (sum, data) => sum + data.total_amount,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//         {/* User Header Section */}
//         <div className="border-b pb-6">
//           <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
//           <div className="mt-4 grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-600">Username</p>
//               <p className="font-semibold">{userData[0].customer.username}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Email</p>
//               <p className="font-semibold">{userData[0].customer.email}</p>
//             </div>
//           </div>
//         </div>

//         {/* Tours Section */}
//         <div className="mt-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Tours</h2>
//           <div className="space-y-4">
//             {tourData.map(
//               (data) =>
//                 data.associated_tour && (
//                   <div
//                     key={data.associated_tour.id}
//                     className="border rounded-lg"
//                   >
//                     <button
//                       onClick={() => toggleTourDetails(data.associated_tour.id)}
//                       className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
//                     >
//                       <span className="font-semibold">
//                         Tour #{data.associated_tour.id}
//                       </span>
//                       {expandedTour === data.associated_tour.id ? (
//                         <ChevronUpIcon className="h-5 w-5" />
//                       ) : (
//                         <ChevronDownIcon className="h-5 w-5" />
//                       )}
//                     </button>

//                     {expandedTour === data.associated_tour.id && (
//                       <div className="p-4 bg-gray-50">
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-gray-600">Location</p>
//                             <p className="font-semibold">
//                               {data.associated_tour.location}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-gray-600">Price</p>
//                             <p className="font-semibold">
//                               ${data.associated_tour.price}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-gray-600">Tour Guide</p>
//                             <p className="font-semibold">
//                               {data.associated_tour.tour_guide_id}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-gray-600">Time</p>
//                             <p className="font-semibold">{data.time}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//             )}
//           </div>
//         </div>

//         {/* Payments Section */}
//         <div className="mt-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Payments</h2>
//           <div className="space-y-4">
//             {userData.map(
//               (data) =>
//                 data.associated_payment && (
//                   <div
//                     key={data.associated_payment.id}
//                     className="border rounded-lg"
//                   >
//                     <button
//                       onClick={() =>
//                         togglePaymentDetails(data.associated_payment.id)
//                       }
//                       className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
//                     >
//                       <span className="font-semibold">
//                         Payment #{data.associated_payment.id}
//                       </span>
//                       {expandedPayment === data.associated_payment.id ? (
//                         <ChevronUpIcon className="h-5 w-5" />
//                       ) : (
//                         <ChevronDownIcon className="h-5 w-5" />
//                       )}
//                     </button>

//                     {expandedPayment === data.associated_payment.id && (
//                       <div className="p-4 bg-gray-50">
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-gray-600">Amount</p>
//                             <p className="font-semibold">
//                               ${data.associated_payment.amount}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-gray-600">Type</p>
//                             <p className="font-semibold capitalize">
//                               {data.associated_payment.type}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-gray-600">Bill ID</p>
//                             <p className="font-semibold">
//                               #{data.associated_payment.bill_id}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//             )}
//           </div>
//         </div>

//         {/* Total Amount Section */}
//         <div className="mt-6 border-t pt-4">
//           <div className="flex justify-end">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-gray-600">Total Amount</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 ${totalAmount.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
