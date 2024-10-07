import React from "react";
import { useState, useEffect } from "react";
import Login from './Login';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const SignUp = () => {
  const initialValues = { firstname: "", lastname: "", username: "", email: "", password: "", confirmPassword: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showError, setShowError] = useState(false); // New state for error vibration
  const [passwordVisible, setPasswordVisible] = useState(false);

  // const toggleForm = () => {
  //   setShowSignIn((prev) => !prev);
  // };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    const fieldErrors = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateInputs(formValues);
    setErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length > 0) {
      setShowError(true); // Set error state to true if there are errors
      setTimeout(() => setShowError(false), 300); // Reset after 300ms
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
    if (!allValues.firstname) {
      errors.firstname = "Enter First Name";
    }
    if (!allValues.lastname) {
      errors.lastname = "Enter Last Name";
    }
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
      case "firstname":
        if (!value) {
          errors.firstname = "Enter First Name";
        } else {
          errors.firstname = "";
        }
        break;
      case "lastname":
        if (!value) {
          errors.lastname = "Enter Last Name";
        } else {
          errors.lastname = "";
        }
        break;
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

      <div className="flip-card__front">
        <form className="form" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <p className="title">Register </p>
          </div>

          <p className="message">Sign up now to access all features. </p>
          <div className="flex">
            <div className="flex flex-col">
              <label>
                <input
                  className="input mb-1"
                  type="text"
                  name="firstname"
                  value={formValues.firstname}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                />
                <span>Firstname</span>
              </label>
              {formErrors.firstname && (
                <p className={`self-start text-xs text-rose-600 ${showError && formErrors.firstname ? 'error' : ''}`}>

                  {formErrors.firstname}
                </p>
              )}
            </div>

            <div className="flex flex-col ">
              <label>
                <input
                  className="input mb-1"
                  type="text"
                  name="lastname"
                  value={formValues.lastname}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="off"
                />
                <span>Lastname</span>
              </label>
              {formErrors.lastname && (
                <p className={`self-start text-xs text-rose-600 ${showError && formErrors.lastname ? 'error' : ''}`}>

                  {formErrors.lastname}
                </p>
              )}
            </div>
          </div>

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
              <p className={`self-start text-xs text-rose-600 ${showError && formErrors.username ? 'error' : ''}`}>

                {formErrors.username}
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
              <p className={`text-xs self-start text-rose-600 ${showError && formErrors.email ? 'error' : ''}`}>
                {formErrors.email}
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
                onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </label>
            {formErrors.password && (
              <p className={`text-xs self-start text-rose-600 ${showError && formErrors.password ? 'error' : ''}`}>
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
              <p className={`text-xs self-start text-rose-600 ${showError && formErrors.confirmPassword ? 'error' : ''}`}>
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

