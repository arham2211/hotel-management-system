import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import img1 from '../assets/carousel-1.jpg';
import img2 from '../assets/carousel-2.jpg';
import './Carousel.css'; // Import the CSS file

export default function Carousel() {
  const images = [img1, img2];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right'); // Track slide direction

  // Automatically move to the next slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 4000); 
    return () => clearInterval(interval);
  }, [currentIndex]); // Ensure it restarts the interval when the index changes

  const goToNext = () => {
    setDirection('right');
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setDirection('left');
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''} ${direction}`}>
            <img src={image} alt={`Slide ${index + 1}`} className="carousel-image" />
          </div>
        ))}
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
