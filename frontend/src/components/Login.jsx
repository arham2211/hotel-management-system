import React, { useState, useContext } from "react";
import api from "../Api.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/UserContext";

const Login = ({ setIsSignUpVisible }) => {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [showSignUp, setShowSignUp] = useState(false);
  const { setToken, setRole } = useContext(AuthContext); // Removed unused 'token' and 'role'
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleForm = () => {
    setShowSignUp((prev) => !prev);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // Clear specific errors when input is modified
    if (name === "username") {
      setErrors((prevErrors) => ({ ...prevErrors, WrongCredentials: "" }));
    } else if (name === "password") {
      setErrors((prevErrors) => ({ ...prevErrors, WrongPassword: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission

    try {
      const response = await api.post(
        "/login/",
        `grant_type=password&username=${formValues.username}&password=${formValues.password}&scope=&client_id=string&client_secret=string`,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        // Store token in localStorage
        localStorage.setItem("token", data.access_token + "_" + data.role);
        setToken(data.access_token);
      } else {
        setErrorMessage(data.detail);
      }
      setIsSignUpVisible(false);
    } catch (error) {
      // Error handling
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        const errorDetail = error.response.data.detail;

        if (errorDetail === "Wrong Credentials") {
          setFormValues((prevValues) => ({
            ...prevValues,
            username: "",
          }));
          setErrors({ ...errors, WrongCredentials: errorDetail });
        } else if (errorDetail === "Invalid Password") {
          setFormValues((prevValues) => ({
            ...prevValues,
            password: "",
          }));
          setErrors({ ...errors, WrongPassword: errorDetail });
        }
      }
    }
  };

  return (
    <div className="flip-card__back flex justify-center">
      <form className="form" onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <p className="title">Login </p>
        </div>
        <p className="message">Login using your credentials</p>

        <label className="mt-2">
          <input
            className="input "
            name="username"
            type="text"
            value={formValues.username}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <span>Email/Username</span>
        </label>
        {errors.WrongCredentials && (
          <p className={`self-start text-xs text-rose-600`}>
            {errors.WrongCredentials}
          </p>
        )}

        <label className="my-2">
          <input
            className="input"
            name="password"
            type={passwordVisible ? "text" : "password"}
            value={formValues.password}
            onChange={handleInputChange}
          />
          <span>Password</span>
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </label>
        {errors.WrongPassword && (
          <p className={`self-start text-xs text-rose-600`}>
            {errors.WrongPassword}
          </p>
        )}

        <button className="submit" type="submit">
          Submit
        </button>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
