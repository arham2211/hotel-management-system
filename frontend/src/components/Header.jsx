import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"; // Import faSignOutAlt
import SignUpCard from "./SignUpCard";
import { AuthContext } from "../context/UserContext";

export default function Header() {
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the SignUpCard visibility
  const toggleSignUp = () => {
    setIsSignUpVisible(!isSignUpVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { token, setToken, role, setRole, setUserId } = useContext(AuthContext); // Ensure setToken is available in AuthContext

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      setToken(token); // Store token in your context or state
      console.log(token);
      const extractedRole = token.split("_").pop(); // Extract role from the token
      setRole(extractedRole); // Update the role state
    }
  }); // Run the effect when the component mounts

  // console.log(role); // You can now log role, which will be updated when the token is processed

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUserId(null);
    setToken(null); // Clear token
    window.location.href = "/"; // Redirect to home after logout
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#002366] shadow-md">
        <div className="xl:container mx-auto flex items-center justify-between md:py-4 px-6 py-2 md:px-3 lg:px-10">
          <div className="text-[#ff8c00] font-[700] md:text-[1.43rem] lg:text-[1.875rem] text-[1.875rem] 2xl:text-[3.25rem]">
            Hotel Name
          </div>

          {/* Burger Icon for Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-[#ffffff]">
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>

          {/* Navbar Links - Hidden on smaller screens */}
          <nav className="hidden md:flex">
            <ul className="flex md:gap-4 lg:gap-6 xl:gap-9">
              <li>
                <a
                  href="/"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00] lg:text-lg 2xl:text-2xl"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00] lg:text-lg 2xl:text-2xl"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00] lg:text-lg 2xl:text-2xl"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00] lg:text-lg 2xl:text-2xl"
                >
                  Rooms
                </a>
              </li>
              <li>
                <a
                  href="/testimonials"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00] lg:text-lg 2xl:text-2xl"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#ff8c00] lg:text-lg 2xl:text-2xl"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Register or Logout Button */}
          <div className="hidden md:block">
            {token && role === "user" ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center 2xl:text-[1.6rem] bg-[#ff8c00] text-[#ffffff] sm:px-4 sm:py-2 md:px-3 md:py-2 lg:px-6 lg:py-[0.7rem] 2xl:px-6 2xl:py-3 rounded-full transition-colors duration-300 ease-in-out hover:text-[#002366]"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="ml-1 sm:ml-2">Log Out</span>
              </button>
            ) : (
              <button
                onClick={toggleSignUp}
                className="inline-flex items-center 2xl:text-[1.6rem] bg-[#ff8c00] text-[#ffffff] sm:px-4 sm:py-2 md:px-3 md:py-2 lg:px-6 lg:py-[0.7rem] 2xl:px-6 2xl:py-3 rounded-full transition-colors duration-300 ease-in-out hover:text-[#002366]"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="ml-1 sm:ml-2">Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-[#002366] shadow-md">
            <ul className="flex gap-0 flex-col pt-3 pb-4">
              <li className="py-4 px-6 border-t-4 border-b border-[#ff8c00] hover:bg-[#ff8c00]">
                <a
                  href="/"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  Home
                </a>
              </li>
              <li className="py-4 px-6 border-b border-[#ff8c00] hover:bg-[#ff8c00]">
                <a
                  href="/about"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  About
                </a>
              </li>
              <li className="py-4 px-6 border-b border-[#ff8c00] hover:bg-[#ff8c00]">
                <a
                  href="/services"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  Services
                </a>
              </li>
              <li className="py-4 px-6 border-b border-[#ff8c00] hover:bg-[#ff8c00]">
                <a
                  href="/rooms"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  Rooms
                </a>
              </li>
              <li className="py-4 px-6 border-b border-[#ff8c00] hover:bg-[#ff8c00]">
                <a
                  href="/testimonials"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  Testimonials
                </a>
              </li>
              <li className="py-4 px-6 border-b border-[#ff8c00] hover:bg-[#ff8c00]">
                <a
                  href="/contact"
                  className="text-[#ffffff] transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  Contact
                </a>
              </li>
            </ul>

            <div className="py-4 px-4">
              <button
                onClick={toggleSignUp}
                className="inline-flex items-center bg-[#ff8c00] text-[#ffffff] px-4 py-2 rounded-full transition-colors duration-300 ease-in-out hover:text-[#002366]"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="ml-2">Register</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Conditionally render the SignUpCard */}
      {isSignUpVisible && (
        <div
          onClick={toggleSignUp}
          className="flex items-center justify-center fixed inset-0 w-full h-full bg-black bg-opacity-60 z-[999]"
        >
          {/* Prevent click propagation inside modal content */}
          <div
            className="w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[31%]"
            onClick={(e) => e.stopPropagation()}
          >
            <SignUpCard
              onClose={toggleSignUp}
              setIsSignUpVisible={setIsSignUpVisible}
            />
          </div>
        </div>
      )}
    </>
  );
}
