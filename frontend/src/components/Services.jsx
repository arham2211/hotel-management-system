import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faSpa,
  faGlassCheers,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";

const serviceData = [
  {
    icon: faHotel,
    title: "Rooms & Apartments",
    description:
      "Enjoy luxurious rooms and apartments with world-class amenities, designed for your ultimate comfort.",
  },
  {
    icon: faSpa,
    title: "Spa & Fitness",
    description:
      "Relax and rejuvenate with our spa and fitness facilities, tailored to your wellness needs.",
  },
  {
    icon: faGlassCheers,
    title: "Events & Parties",
    description:
      "Host unforgettable events and parties in our elegant venues with premium services.",
  },
  {
    icon: faDumbbell,
    title: "Gym & Yoga",
    description:
      "Stay active and refreshed with our fully equipped gym and serene yoga sessions.",
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
          <h1 className="text-5xl md:text-5xl font-extrabold text-gray-800">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
