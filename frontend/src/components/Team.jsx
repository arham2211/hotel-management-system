import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import api from "../Api";
import team1 from "../assets/team-1.jpg";
import team2 from "../assets/team-2.jpg";
import team3 from "../assets/team-3.jpg";
import team4 from "../assets/team-4.jpg";

const imageMapping = {
  1: team1,
  2: team2,
  3: team3,
  4: team4,
};

const TeamMemberCard = ({ image, name, designation }) => (
  <div className="bg-white shadow-lg overflow-hidden w-64 text-center transform transition-all duration-300 hover:scale-105">
    <div className="relative">
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="absolute -bottom-5 left-0 right-0 flex justify-center space-x-3">
        <a
          href="#"
          className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a
          href="#"
          className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a
          href="#"
          className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
        <a
          href="#"
          className="text-white bg-[#ff8c00] w-10 h-10 flex items-center justify-center hover:bg-[#ff7000] transition-colors"
        >
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get("/staff/8");

        const data = response.data;

        // Map images to team members
        const membersWithImages = data.map((member, index) => ({
          ...member,
          image: imageMapping[member.id] || imageMapping[(index % 4) + 1], // Fallback to cycle through images
        }));

        setTeamMembers(membersWithImages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading team members...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-20">Error: {error}</div>;
  }

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
