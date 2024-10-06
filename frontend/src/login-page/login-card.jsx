import React from "react";
import styled from "styled-components";
import { useState,useEffect } from "react";

const Form = () => {
    const initialValues = {firstname: "", lastname:"", username: "",email:"", password:"",confirmPassword:""};
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors,setErrors] = useState({});
    const [isSubmit,setIsSubmit] = useState(false);


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
    <div className="border-2 border-black flex justify-center min-h-[700px] items-center"> 
    <StyledWrapper>
        <pre>{JSON.stringify(formValues,undefined,2)}</pre>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register </p>
        <p className="message">Sign up now to access all features. </p>
        <div className="flex">
          <label>
            <input className="input" type="text" placeholder="" name="firstname"  value={formValues.firstname} onChange={handleChange}/>
            <span>Firstname</span>
          </label>

          <label>
            <input className="input" type="text" placeholder="" name="lastname" value={formValues.lastname} onChange={handleChange} />
            <span>Lastname</span>
          </label>
        </div>


        <div className="flex flex-col ">
        <label>
          <input className="input" type="text" placeholder=""  name= "username" value={formValues.username}  onChange={handleChange}/>
          <span>Username</span>
        </label>
        {formErrors.username && (
            <p className=" self-start text-xs text-rose-600">{formErrors.username}</p>
        )}
        </div>

        <div className="flex flex-col ">
        <label>
          <input className="input" type="text" placeholder="" name="email"  value={formValues.email}  onChange={handleChange}/>
          <span>Email</span>
        </label>
        {formErrors.email && (
            <p className="text-xs self-start text-rose-600">{formErrors.email}</p>
        )}
        </div>


        <div className="flex flex-col ">

        <label>
          <input className="input" type="password" placeholder="" name= "password" value={formValues.password}  onChange={handleChange}/>
          <span>Password</span>
        </label>
        {formErrors.password && (
            <p className="text-xs self-start text-rose-600">{formErrors.password}</p>
        )}
        </div>

        <div className="flex flex-col ">
            
        <label>
          <input className="input" type="password" placeholder="" name= "confirmPassword" value={formValues.confirmPassword}  onChange={handleChange}/>
          <span>Confirm password</span>
        </label>
        {formErrors.confirmPassword && (
            <p className="text-xs self-start text-rose-600">{formErrors.confirmPassword}</p>
        )}
        </div>
        <button className="submit">Submit</button>
        <p className="signin">
          Already have an acount ? <a href="#">Signin</a>{" "}
        </p>
      </form>
    </StyledWrapper>
</div>
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
