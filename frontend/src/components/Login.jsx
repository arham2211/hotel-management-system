import React, { useState, useContext } from "react";
import api from "../Api.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [formValues, setFormValues] = useState({ username: "", password: "" });
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

      const data = await response.data;

      if (response.status === 200) {
        // Store token in localStorage
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        console.log(data.access_token);
      } else {
        setErrorMessage(data.detail);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Fill in the required fields");

      //PASTED HERE
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        if (error.response.data.detail == "Wrong Credentials") {
          setErrors({
            ...errors,
            WrongCredentials: error.response.data.detail || "An error occurred",
          });
        }
      }
      if (error.response.data.detail == "Invalid Password") {
        setErrors({
          ...errors,
          WrongPassword: error.response.data.detail || "An error occurred",
        });
      }
    }

    //TILL HERE
  };

  return (
    <div className="flip-card__back">
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
