import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faTimes,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import SignUpCard from "./SignUpCard";
import { AuthContext } from "../context/UserContext";
import api from "../Api";

export default function Header() {
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate(); // Add navigation hook

  const toggleSignUp = () => {
    setIsSignUpVisible(!isSignUpVisible);
  };

  const toggleMenu = () => {
  
    setIsMenuOpen(!isMenuOpen);

  };

  const { token, setToken, role, setRole, userId, setUserId } =
    useContext(AuthContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const extractedRole = storedToken.split("_").pop();
      setRole(extractedRole);
    }
    const fetchUsername = async () => {
      try {
        const response = await api.get(`/users/${userId}/`);
        setUsername(response.data.username);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching username:", err);
      }
    };

    if (userId) {
      fetchUsername();
    }
  }, [setToken, setRole, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUserId(null);
    setToken(null);
    window.location.reload();
  };

  const handleUserClick = () => {
    navigate("/profile"); // Navigate to profile page when username is clicked
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Rooms", href: "/rooms" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

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
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "text-[#ff8c00] font-bold"
                        : "text-[#ffffff]"
                    } transition-colors duration-300 ease-in-out hover:text-[#ff8c00] lg:text-lg 2xl:text-2xl`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Register or Logout Button */}
          <div className="hidden md:block">
            {token && role === "user" ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleUserClick}
                  className="inline-flex items-center 2xl:text-[1.6rem] bg-[#ff8c00] text-[#ffffff] sm:px-4 sm:py-2 md:px-3 md:py-2 lg:px-6 lg:py-[0.7rem] 2xl:px-6 2xl:py-3 rounded-full transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="ml-1 sm:ml-2">{username || "User"}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center 2xl:text-[1.6rem] bg-[#ff8c00] text-[#ffffff] sm:px-4 sm:py-2 md:px-3 md:py-2 lg:px-6 lg:py-[0.7rem] 2xl:px-6 2xl:py-3 rounded-full transition-colors duration-300 ease-in-out hover:text-[#002366]"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span className="ml-1 sm:ml-2">Logout</span>
                </button>
              </div>
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
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className={`py-4 px-6 border-b border-[#ff8c00] ${
                    pathname === item.href
                      ? "bg-[#ff8c00]"
                      : "hover:bg-[#ff8c00]"
                  }`}
                >
                  <a
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "text-[#002366] font-bold"
                        : "text-[#ffffff]"
                    } transition-colors duration-300 ease-in-out`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
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
