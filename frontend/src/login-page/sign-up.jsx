import React from "react";
import styled from "styled-components";
import { useState,useEffect } from "react";
import Slider from "./slider"
import Login from './login'

const Form = () => {
    const initialValues = {firstname: "", lastname:"", username: "",email:"", password:"",confirmPassword:""};
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors,setErrors] = useState({});
    const [isSubmit,setIsSubmit] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);

    const toggleForm = () => {
      setShowSignIn((prev) => !prev); // Toggle between SignIn and SignUp
    };


    const handleChange = (e) => {
        const {name,value}=e.target;
        setFormValues({...formValues, [name]: value})

        const fieldErrors = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(validateInputs(formValues));
        setIsSubmit(true);
    }

    useEffect(()=>{
        console.log(formErrors);
        if(Object.keys(formErrors).length===0 && isSubmit){
            console.log("Proper values.");

        }
    },[formErrors])

    const validateInputs = (allValues) => {
        const errors={};
        const regex=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
        if(!allValues.firstname){
            errors.firstname="Enter First Name";
        }
        if(!allValues.lastname){
            errors.lastname="Enter Last Name";
        }
        if(!allValues.username){
            errors.username="Enter Username";
        }
        if(!allValues.email){
            errors.email="Enter Email";
        }
        else if(!regex.test(allValues.email)){
            errors.email="Invalid Email"
        }
        if(!allValues.password){
            errors.password="Enter Password";
        }
        else if (allValues.password.length<5){
            errors.password="At least 5 characters."
        }
        if(!allValues.confirmPassword){
            errors.confirmPassword="Enter password confirmation.";
        }
        else if(allValues.confirmPassword!=allValues.password){
            errors.confirmPassword="Passwords do not match.";
        }
        return errors;
    }

    const validateField = (name, value) => {
        const regex=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
        const errors = {};
        switch (name) {
          case "firstname":
            if(!value){
                errors.firstname="Enter First Name";
            } else {
                errors.firstname="";
            }
            break;
          case "lastname":
            if(!value){
                errors.lastname="Enter Last Name";
            } else {
                errors.lastname="";
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
            }
            else if(!regex.test(value)){
                errors.email="Invalid Email"
            }
             else {
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
      <StyledWrapper>
        {showSignIn ? (
          <Login /> // Show the SignIn component if showSignIn is true
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <p className="title">Register </p>
              <Slider /> {/* Your slider component */}
            </div>
            <p className="message">Sign up now to access all features. </p>
            <div className="flex">
              <div className="flex flex-col ">
                <label>
                  <input
                    className="input"
                    type="text"
                    name="firstname"
                    value={formValues.firstname}
                    onChange={handleChange}
                    placeholder=""
                  />
                  <span>Firstname</span>
                </label>
                {formErrors.firstname && (
                  <p className="self-start text-xs text-rose-600">
                    {formErrors.firstname}
                  </p>
                )}
              </div>

              <div className="flex flex-col ">
                <label>
                  <input
                    className="input"
                    type="text"
                    name="lastname"
                    value={formValues.lastname}
                    onChange={handleChange}
                    placeholder=""
                  />
                  <span>Lastname</span>
                </label>
                {formErrors.lastname && (
                  <p className="self-start text-xs text-rose-600">
                    {formErrors.lastname}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col ">
              <label>
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  placeholder=""
                />
                <span>Username</span>
              </label>
              {formErrors.username && (
                <p className="self-start text-xs text-rose-600">
                  {formErrors.username}
                </p>
              )}
            </div>

            <div className="flex flex-col ">
              <label>
                <input
                  className="input"
                  type="text"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder=""
                />
                <span>Email</span>
              </label>
              {formErrors.email && (
                <p className="text-xs self-start text-rose-600">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col ">
              <label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder=""
                />
                <span>Password</span>
              </label>
              {formErrors.password && (
                <p className="text-xs self-start text-rose-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col ">
              <label>
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder=""
                />
                <span>Confirm password</span>
              </label>
              {formErrors.confirmPassword && (
                <p className="text-xs self-start text-rose-600">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
            <button className="submit">Submit</button>
            <p className="signin">
              Already have an account?{" "}
              <span onClick={toggleForm} className="cursor-pointer text-blue-500">Sign in</span>
            </p>
          </form>
        )}
      </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
      padding: 20px;
      border-radius: 20px;
      position: relative;
      background-color: #1a1a1a;
      color: #fff;
      border: 1px solid #333;
}

.title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #00bfff;
}

.title::before {
  width: 18px;
  height: 18px;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: #00bfff;
}

.message, 
.signin {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.7);
}

.signin {
  text-align: center;
}

.signin a:hover {
  text-decoration: underline royalblue;
}

.signin a {
  color: #00bfff;
}

.flex {
  display: flex;
  width: 100%;
  gap: 6px;
}

.form label {
  position: relative;
}

.form label .input {
  background-color: #333;
  color: #fff;
  width: 100%;
  padding: 20px 05px 05px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

.form label .input + span {
  color: rgba(255, 255, 255, 0.5);
  position: absolute;
  left: 10px;
  top: 0px;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 12.5px;
  font-size: 0.9em;
}

.form label .input:focus + span,
.form label .input:valid + span {
  color: #00bfff;
  top: 0px;
  font-size: 0.7em;
  font-weight: 600;
}

.input {
  font-size: medium;
}

.submit {
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transform: .3s ease;
  background-color: #00bfff;
}

.submit:hover {
  background-color: #00bfff96;
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
`;

export default Form;
