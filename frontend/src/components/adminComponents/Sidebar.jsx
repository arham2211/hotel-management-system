import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faCalendar,
  faUser,
  faTicket,
  faCreditCard,
  faDoorOpen,
  faUserCircle,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const menuItems = [
    { id: 1, name: "Bills", icon: faReceipt },
    { id: 2, name: "Bookings", icon: faCalendar },
    { id: 3, name: "Users", icon: faUser },
    { id: 4, name: "Party Reservations", icon: faTicket },
    { id: 5, name: "Payments", icon: faCreditCard },
    { id: 6, name: "Rooms", icon: faDoorOpen },
    { id: 7, name: "Staff", icon: faUserCircle },
    { id: 8, name: "Tour Reservations", icon: faBookmark },
  ];

  return (
    <nav className="mt-4">
          {menuItems.map((item) => (
            <a
            key={item.id}
            href={`/admin/${item.name.toLowerCase()}`}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
           <FontAwesomeIcon icon={item.icon} />
            <span>{item.name}</span>
          </a>
          ))}
        </nav>
  );
};

export default Sidebar;
