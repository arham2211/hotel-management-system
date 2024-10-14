import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import img1 from "../assets/carousel-1.jpg";
import img2 from "../assets/carousel-2.jpg";
import "./Carousel.css";

export default function Carousel() {
  const carouselData = useRef([
    {
      title: "Luxury Living",
      description1: "Discover A Brand",
      description2: "Luxurious Hotel",
      button: 'Book A Room',
      image: img1,
    },
    {
      title: "Luxury Living",
      description1: "Discover A Brand",
      description2: "Luxurious Hotel",
      button: 'Book A Room',
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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.current.length);
      setTimeout(() => setIsTransitioning(false), 700);
    }
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setDirection("left");
      setCurrentIndex((prevIndex) =>
        (prevIndex - 1 + carouselData.current.length) % carouselData.current.length
      );
      setTimeout(() => setIsTransitioning(false), 700);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="carousel-container relative">
      <div className="carousel-wrapper flex items-center justify-center">
        {carouselData.current.map((item, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentIndex ? "active" : ""
            } ${direction}`}
          >
            <img src={item.image} className="carousel-image" alt={`Slide ${index + 1}`} />
          </div>
        ))}
        <div className={`carousel-content absolute text-center mb-10 ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="flex items-center justify-center">
            <div className="lines"></div>
            <h2 className="carousel-heading uppercase py-3 px-1">
              {carouselData.current[currentIndex].title}
            </h2>
            <div className="lines"></div>
          </div>
          <p className="carousel-description">
            {carouselData.current[currentIndex].description1}
          </p>
          <p className="carousel-description">
            {carouselData.current[currentIndex].description2}
          </p>
          <button className="carousel-button uppercase mt-7 px-8 py-4">
            {carouselData.current[currentIndex].button}
          </button>
        </div>
      </div>

      <button onClick={goToPrev} className="carousel-control prev">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button onClick={goToNext} className="carousel-control next">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}