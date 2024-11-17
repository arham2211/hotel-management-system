import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import testimonial1 from "../assets/testimonial-1.jpg";
import testimonial2 from "../assets/testimonial-2.jpg";
import testimonial3 from "../assets/testimonial-3.jpg";
import testimonial4 from "../assets/testimonial-4.jpg";
import backgroundImage from "../assets/carousel-2.jpg";

const testimonials = [
  {
    image: testimonial1,
    name: "Client Name 1",
    profession: "Profession",
    text: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
  },
  {
    image: testimonial2,
    name: "Client Name 2",
    profession: "Bothing",
    text: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
  },
  {
    image: testimonial3,
    name: "Client Name 3",
    profession: "Profession",
    text: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
  },
  {
    image: testimonial4,
    name: "Client Name 4",
    profession: "Profession",
    text: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.floor((testimonials.length - 1) / 2) : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Math.floor((testimonials.length - 1) / 2) ? 0 : prevIndex + 1
    );
  };

  const getVisibleTestimonials = () => {
    const firstIndex = currentIndex * 2;
    const secondIndex = firstIndex + 1;
    return [
      testimonials[firstIndex],
      secondIndex < testimonials.length ? testimonials[secondIndex] : null,
    ].filter(Boolean);
  };

  return (
    <div
    className="h-[350px] bg-cover bg-fixed bg-center flex items-center justify-center relative px-4"
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}
  >
      <div className="absolute inset-0 bg-[#24272e] opacity-50 z-0"></div>
      <div className="max-w-7xl w-full flex items-center justify-between gap-4 relative z-10">
        {/* Left Arrow */}
        <button
          onClick={handlePrevClick}
          className="text-[#ff8c00] p-4 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>

        {/* Testimonials */}
        <div className="flex justify-center gap-8 flex-1">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full transform transition-all duration-300"
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faQuoteRight}
                  className="text-[#ff8c00] text-4xl absolute -top-2 -right-2"
                />
                <p className="text-gray-600 mb-6 text-lg">{testimonial.text}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h5 className="font-bold text-gray-800 text-lg">{testimonial.name}</h5>
                    <p className="text-gray-500">{testimonial.profession}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextClick}
          className="text-[#ff8c00] p-4 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
