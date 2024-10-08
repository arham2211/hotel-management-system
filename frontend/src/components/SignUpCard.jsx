import React from "react";
import { useState, useEffect } from "react";
import SignUp from './SignUp';
import Login from './Login';


const Form = () => {

    const [showSignUp, setShowSignUp] = useState(true); 

    // Handle the toggle switch
    const handleToggle = () => {
        setShowSignUp((prev) => !prev); // Switch between true/false
    };

    return (
        <>
            <div className="wrapper">
                <div className="card-switch">

                    <label className="switch">

                        <input
                            type="checkbox"
                            className="toggle"
                            onChange={handleToggle} // Switch form when toggled
                            checked={!showSignUp} // Set checkbox state based on `showSignUp`
                        />
                        <span className="slider" />
                        <span className="card-side" />



                    </label>

                </div>
            </div>



            {showSignUp ? <SignUp /> : <Login />}


        </>

    );
};


export default Form;

