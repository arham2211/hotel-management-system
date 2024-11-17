import React from "react";
import PropTypes from 'prop-types';
import BackgroundImage from "../assets/carousel-1.jpg"; 

export default function PageHeader(props) {
    return (
        <div
        className="bg-opacity-80 bg-[rgba(15,23,43,0.7)] text-center text-white py-6 relative"
        style={{
          backgroundImage: `url(${BackgroundImage})`, // Use the imported image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(15,23,43,0.7)] bg-opacity-60"></div> {/* Dark overlay */}
        <div className="py-16 relative z-10">
          <h1 className="text-7xl font-bold">{props.title}</h1>
          <nav className="text-xl mt-5">
            <a href="/" className="hover:underline">
              HOME
            </a>
            <span className="text-white mx-2">/</span>
            <span className="text-[#ff8c00] uppercase">{props.title}</span>
          </nav>
        </div>
      </div>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
  };


