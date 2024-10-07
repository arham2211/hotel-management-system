import React from "react";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SignUp from './SignUp';
import Login from './Login';


const Form = () => {

    return (
        <>
            <div className="wrapper">
                <div className="card-switch">

                    <label className="switch">

                        <input type="checkbox" className="toggle" />
                        <span className="slider" />
                        <span className="card-side" />

                        <div className="flip-card__inner">

                            <SignUp />
                            <Login />

                        </div>

                    </label>

                </div>
            </div>


        </>

    );
};


export default Form;

