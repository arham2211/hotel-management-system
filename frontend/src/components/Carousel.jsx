import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import img1 from "../assets/carousel-1.jpg";
import img2 from "../assets/carousel-2.jpg";

export default function Carousel() {
  const carouselData = useRef([
    {
      title: "Luxury Living",
      description1: "Discover A Brand",
      description2: "Luxurious Hotel",
      button: "Book A Room",
      image: img1,
    },
    {
      title: "Luxury Living",
      description1: "Discover A Brand",
      description2: "Luxurious Hotel",
      button: "Book A Room",
      image: img2,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setDirection("right");
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % carouselData.current.length
      );
      setTimeout(() => setIsTransitioning(false), 700);
    }
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setDirection("left");
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + carouselData.current.length) %
          carouselData.current.length
      );
      setTimeout(() => setIsTransitioning(false), 700);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div className="z-[1] transition-transform duration-700 ease-in-out bg-[rgba(15,23,43,0.7)] flex items-center justify-center">
        {carouselData.current.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full opacity-0 transition-opacity duration-700 ease-in-out z-[-1] ${
              index === currentIndex ? "relative opacity-100" : ""
            } ${direction}`}
          >
            <img
              src={item.image}
              className="block w-full h-auto object-cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
        <div
          className={`transition-opacity-transform duration-700 ease-in-out absolute text-center mb-10 ${
            isTransitioning ? "opacity-0" : ""
          }`}
          style={{
            transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
          }}
        >
          <div className="flex items-center justify-center">
            <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
            <h2 className="text-white text-[1.2rem] font-bold uppercase py-3 px-1">
              {carouselData.current[currentIndex].title}
            </h2>
            <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          </div>
          <p className="text-white text-[76px] font-extrabold leading-[84px]
">
            {carouselData.current[currentIndex].description1}
          </p>
          <p className="text-white text-[76px] font-extrabold leading-[84px]
">
            {carouselData.current[currentIndex].description2}
          </p>
          <button className="text-[#ffffff] bg-[#ff8c00] font-[700] text-[19px] uppercase mt-7 px-8 py-4">
            {carouselData.current[currentIndex].button}
          </button>
        </div>
      </div>

      <button onClick={goToPrev} className="absolute top-[47%] transform -translate-y-1/2 border-none cursor-pointer text-[50px] text-white opacity-20 z-10 left-[40px]">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button onClick={goToNext} className="absolute transform -translate-y-1/2 border-none cursor-pointer text-[50px] text-white opacity-20 z-10 right-[40px] top-[327px]">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
