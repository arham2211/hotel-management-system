import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import SignUpCard from './SignUpCard';  
import './Header.css';  

export default function Header() {
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);

  // Function to toggle the SignUpCard visibility
  const toggleSignUp = () => {
    setIsSignUpVisible(!isSignUpVisible);
  };

  return (
    <>
      <header className="navbar">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Hotel Name + Logo */}
          <div className="logo">
            Hotel Name
          </div>

          {/* Navbar Links */}
          <nav>
            <ul className="menu flex">
              <li>
                <a href="/" className="menu-link">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="menu-link">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="menu-link">
                  Services
                </a>
              </li>
              <li>
                <a href="/rooms" className="menu-link">
                  Rooms
                </a>
              </li>

              {/* Dropdown for Pages */}
              <li className="dropdown relative">
                <a href="/pages" className="menu-link">
                  Pages
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/gallery" className="dropdown-link">
                      Booking
                    </a>
                  </li>
                  <li>
                    <a href="/testimonials" className="dropdown-link">
                      Our Team
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="dropdown-link">
                      Testimonial
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/contact" className="menu-link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Register Button */}
          <div>
            <button onClick={toggleSignUp} className="register-btn">
              <FontAwesomeIcon icon={faUser} />
              <span className="ml-2">Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conditionally render the SignUpCard */}
      {isSignUpVisible && (
        <div onClick={toggleSignUp} className="modal-overlay flex items-center justify-center">
          {/* Prevent click propagation inside modal content */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SignUpCard onClose={toggleSignUp} />
          </div>
        </div>
      )}
    </>
  );
}
