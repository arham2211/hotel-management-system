import React from "react";
import { useState, useEffect, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../Api";
import {AuthContext} from "../context/UserContext"

const SignUp = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showError, setShowError] = useState(false); // New state for error vibration
  const [passwordVisible, setPasswordVisible] = useState(false);

  //TESTING TOKEN ACCESS IN SIGNUP 
  const { token } = useContext(AuthContext);
  console.log("SignUp page got this token from login: ", token);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    const fieldErrors = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs(formValues);
    setErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length > 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 300);
      return;
    }

    try {
      const response = await api.post("/users/", formValues);
      console.log("Response:", response.data);
      setFormValues(initialValues);
    } catch (error) {
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        if (error.response.data.detail == "User Already Exists") {
          setFormValues((prevValues) => ({
            ...prevValues,
            username: "",
          }));

          setErrors({
            ...errors,
            UsernameTaken: error.response.data.detail || "An error occurred",
          });
        }
        if (error.response.data.detail == "Email Already Registered") {
          setFormValues((prevValues) => ({
            ...prevValues,
            email: "",
          }));

          setErrors({
            ...errors,
            EmailTaken: error.response.data.detail || "An error occurred",
          });
        }
      }
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("Proper values.");
    }
  }, [formErrors]);

  const validateInputs = (allValues) => {
    const errors = {};
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
    if (!allValues.username) {
      errors.username = "Enter Username";
    }
    if (!allValues.email) {
      errors.email = "Enter Email";
    } else if (!regex.test(allValues.email)) {
      errors.email = "Invalid Email";
    }
    if (!allValues.password) {
      errors.password = "Enter Password";
    } else if (allValues.password.length < 5) {
      errors.password = "At least 5 characters.";
    }
    if (!allValues.confirmPassword) {
      errors.confirmPassword = "Enter password confirmation.";
    } else if (allValues.confirmPassword !== allValues.password) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const validateField = (name, value) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
    const errors = {};
    switch (name) {
      case "username":
        if (!value) {
          errors.username = "Enter Username";
        } else {
          errors.username = "";
        }
        break;
      case "email":
        if (!value) {
          errors.email = "Enter Email";
        } else if (!regex.test(value)) {
          errors.email = "Invalid Email";
        } else {
          errors.email = "";
        }
        break;
      case "password":
        if (!value) {
          errors.password = "Enter Password";
        } else if (value.length < 5) {
          errors.password = "At least 5 characters.";
        } else {
          errors.password = "";
        }
        break;
      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Enter password confirmation.";
        } else if (value !== formValues.password) {
          errors.confirmPassword = "Passwords do not match.";
        } else {
          errors.confirmPassword = "";
        }
        break;
      default:
        break;
    }
    return errors;
  };

  return (
    <>
      <div className="flip-card__front flex justify-center">
        <form className="form" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <p className="title">Register </p>
          </div>

          <p className="message mb-5 mt-2">
            Sign up now to access all features.{" "}
          </p>

          <div className="flex flex-col ">
            <label>
              <input
                className="input mb-1"
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                placeholder=""
                autoComplete="off"
              />
              <span>Username</span>
            </label>
            {formErrors.username && (
              <p
                className={`self-start text-xs text-rose-600 ${
                  showError && formErrors.username ? "error" : ""
                }`}
              >
                {formErrors.username}
              </p>
            )}

            {formErrors.UsernameTaken && (
              <p className={`self-start text-xs text-rose-600`}>
                {formErrors.UsernameTaken}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label>
              <input
                className="input mb-1"
                type="text"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder=""
                autoComplete="off"
              />
              <span>Email</span>
            </label>
            {formErrors.email && (
              <p
                className={`text-xs self-start text-rose-600 ${
                  showError && formErrors.email ? "error" : ""
                }`}
              >
                {formErrors.email}
              </p>
            )}
            {formErrors.EmailTaken && (
              <p className={`self-start text-xs text-rose-600`}>
                {formErrors.EmailTaken}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label>
              <input
                className="input mb-1"
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder=""
              />
              <span>Password</span>
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </label>
            {formErrors.password && (
              <p
                className={`text-xs self-start text-rose-600 ${
                  showError && formErrors.password ? "error" : ""
                }`}
              >
                {formErrors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col ">
            <label>
              <input
                className="input mb-1"
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder=""
              />
              <span>Confirm password</span>
            </label>
            {formErrors.confirmPassword && (
              <p
                className={`text-xs self-start text-rose-600 ${
                  showError && formErrors.confirmPassword ? "error" : ""
                }`}
              >
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
          <button className="submit flip-card__btn">Submit</button>
          {/* <p className="signin">
            Already have an account?{" "}
            <span onClick={toggleForm} className="cursor-pointer text-blue-500">Sign in</span>
          </p> */}
        </form>
      </div>
    </>
  );
};

export default SignUp;
