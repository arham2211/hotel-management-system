import React, { useState } from "react";
import styled from "styled-components";
import { useId } from "react";

const Radio = () => {
  const [selectedTab, setSelectedTab] = useState("register");
  const id = useId();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="tabs bg-blue-800">
          <input
            type="radio"
            id={`${id}-radio-1`}
            name={`${id}-tabs`}
            checked={selectedTab === "register"}
            onChange={() => handleTabChange("register")}
          />
          <label className="tab" htmlFor={`${id}-radio-1`}>
            Register
          </label>
          <input
            type="radio"
            id={`${id}-radio-2`}
            name={`${id}-tabs`}
            checked={selectedTab === "login"}
            onChange={() => handleTabChange("login")}
          />
          <label className="tab" htmlFor={`${id}-radio-2`}>
            Login
          </label>
          <span className={`glider ${selectedTab}`} />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: inline-flex;
  }

  .tabs {
    display: flex;
    position: relative;
    box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
    padding: 0.75rem;
    background-color: #00bfff;
    border-radius: 99px;
  }

  .tabs * {
    z-index: 2;
  }

  .container input[type="radio"] {
    display: none;
  }

  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 80px;
    font-size: 0.8rem;
    color: black;
    font-weight: 500;
    border-radius: 99px;
    cursor: pointer;
    transition: color 0.15s ease-in;
  }

  .container input[type="radio"]:checked + label {
    color: #185ee0;
  }

  .glider {
    position: absolute;
    display: flex;
    height: 30px;
    width: 80px;
    background-color: #e6eef9;
    z-index: 1;
    border-radius: 99px;
    transition: transform 0.25s ease-out;
  }

  .glider.register {
    transform: translateX(0);
  }

  .glider.login {
    transform: translateX(80px);
  }

  @media (max-width: 700px) {
    .tabs {
      transform: scale(0.6);
    }
  }
`;

export default Radio;
