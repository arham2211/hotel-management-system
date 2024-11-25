import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faRoute,
  faGlassCheers,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // Import Link for internal navigation

const serviceData = [
  {
    icon: faHotel,
    title: "Rooms & Apartments",
    description:
      "Enjoy luxurious rooms and apartments with world-class amenities, designed for your ultimate comfort.",
    link: "/rooms", // Internal link
    isExternal: false, // Indicate internal or external link
  },
  {
    icon: faRoute,
    title: "Tours & Adventures",
    description:
      "Embark on unforgettable journeys with our curated tours, designed for every explorer.",
    link: "/tours", // Internal link
    isExternal: false,
  },
  {
    icon: faGlassCheers,
    title: "Events & Parties",
    description:
      "Host unforgettable events and parties in our elegant venues with premium services.",
    link: "/events", // Internal link
    isExternal: false,
  },
  {
    icon: faDumbbell,
    title: "Gym & Yoga",
    description:
      "Stay active and refreshed with our fully equipped gym and serene yoga sessions.",
    link: "https://arham2211.github.io/Gym-Website/", // External link
    isExternal: true,
  },
];

const Services = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center">
            <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
            <h2 className="text-[1.2rem] text-[#ff8c00] font-bold uppercase py-3 px-1">
              Our Services
            </h2>
            <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          </div>
          <h1 className="text-5xl md:text-5xl font-extrabold text-black">
            Explore Our <span className="text-[#ff8c00]">Services</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceData.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-orange-100 p-4 rounded-full">
                  <FontAwesomeIcon
                    icon={service.icon}
                    className="text-[#ff8c00] text-4xl"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center">{service.description}</p>
              <div className="text-center mt-6">
                {service.isExternal ? (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#ff8c00] text-white py-2 px-4 rounded-full transition duration-300 hover:bg-orange-600"
                  >
                    Learn More
                  </a>
                ) : (
                  <Link
                    to={service.link}
                    className="inline-block bg-[#ff8c00] text-white py-2 px-4 rounded-full transition duration-300 hover:bg-orange-600"
                  >
                    Learn More
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
