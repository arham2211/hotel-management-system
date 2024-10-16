import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import SignUpCard from "./SignUpCard";
import { AuthContext } from '../context/UserContext';
import { useContext, useEffect } from 'react';

export default function Header() {
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);

  // Function to toggle the SignUpCard visibility
  const toggleSignUp = () => {
    setIsSignUpVisible(!isSignUpVisible);
  };

  const { token } = useContext(AuthContext);

  console.log("Header file rendered here token accessed: ", token);
  return (
    <>
      <header className="sticky top-0 z-50 bg-[#002366] shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-10">
          <div className="text-[#ff8c00] font-[700] text-[1.875rem]">
            Hotel Name
          </div>

          {/* Navbar Links */}
          <nav>
            <ul className="flex gap-9">
              <li>
                <a
                  href="/"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00]"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00]"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00]"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00]"
                >
                  Rooms
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00]"
                >
                  Testimonial
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Register Button */}
          <div>
            <button
              onClick={toggleSignUp}
              className="inline-flex items-center bg-[#ff8c00] text-[#ffffff] px-4 py-2 rounded-full transition-colors duration-300 ease-in-out hover:text-[#002366]
"
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="ml-2">Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conditionally render the SignUpCard */}
      {isSignUpVisible && (
        <div
          onClick={toggleSignUp}
          className="flex items-center justify-center fixed inset-0 w-full h-full bg-black bg-opacity-60 z-[999]">
          {/* Prevent click propagation inside modal content */}
          <div className="w-[31%]" onClick={(e) => e.stopPropagation()}>
            <SignUpCard onClose={toggleSignUp} />
          </div>
        </div>
      )}
    </>
  );
}
