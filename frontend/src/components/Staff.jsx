import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from "@fortawesome/free-brands-svg-icons";
import team1 from '../assets/team-1.jpg';
import team2 from '../assets/team-2.jpg';
import team3 from '../assets/team-3.jpg';
import team4 from '../assets/team-4.jpg';

const teamMembers = [
    {
      image: team1,
      name: "Full Name 1",
      designation: "Designation",
    },
    {
      image: team2,
      name: "Full Name 2", 
      designation: "Designation",
    },
    {
      image: team3,
      name: "Full Name 3",
      designation: "Designation",
    },
    {
      image: team4,
      name: "Full Name 4",
      designation: "Designation",
    },
];

const TeamMemberCard = ({ image, name, designation }) => (
  <div className="bg-white shadow-lg overflow-hidden w-64 text-center transform transition-all duration-300 hover:scale-105">
    <div className="relative">
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="absolute -bottom-5 left-0 right-0 flex justify-center space-x-3">
        <a href="#" className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href="#" className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="#" className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors">
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
        <a href="#" className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
    </div>
    <div className="p-4 pt-8">
      <h5 className="font-bold text-gray-800 text-lg">{name}</h5>
      <p className="text-gray-500">{designation}</p>
    </div>
  </div>
);

const Staff = () => {
  return (
    <div className="container px-10 mx-auto">
      <div className="text-center mb-14">
        <div className="flex items-center justify-center">
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          <h2 className="text-[1.2rem] text-[#ff8c00] font-bold uppercase py-3 px-1">
            Our Team
          </h2>
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Explore Our <span className="uppercase text-[#ff8c00]">Staffs</span>
        </h1>

        <div className="flex flex-wrap gap-6 justify-center p-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Staff;