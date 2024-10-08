import React from "react";
import { useState } from "react";


const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleForm = () => {
    setShowSignUp((prev) => !prev);
  
  };

  const initialValues = { username: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value })
    console.log(formValues)
  }

  return (
    <>


      <div className="flip-card__back">
        <form className="form">
          <div className="flex justify-between">
            <p className="title">Login </p>
          </div>
          <p className="message">Login using your credentials </p>

          <label>
            <input className="input" name="username" type="text" placeholder="" required onChange={handleChange} />
            <span>Email/Username</span>
          </label>

          <label>
            <input className="input" name="password" type="password" placeholder="" required onChange={handleChange} />
            <span>Password</span>
          </label>

          <button className="submit">Submit</button>
          <p className="signin">
            Do not have an account?{" "}
            <span onClick={toggleForm} className="cursor-pointer text-blue-500">Sign Up</span>
          </p>
        </form>
      </div>


    </>
  );
};


export default Login;
