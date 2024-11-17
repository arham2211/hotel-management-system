import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#002366] text-white py-10 relative">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {/* Branding Section */}
        <div>
          <h3 className="text-2xl font-bold text-[#ff8c00]">HOTELIER</h3>
          <p className="mt-2 bg-[#ff8c00] p-3">
            Download{" "}
            <strong className="text-[#002366]">
              Hotelier – Premium Version
            </strong>
            , build a professional website for your hotel business and grab the
            attention of new visitors upon your site’s launch.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-semibold text-[#FF8C00] mb-2">CONTACT</h4>
          <div className="flex items-center mt-2">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-[#FF8C00] mr-2"
            />
            <p>123 Street, New York, USA</p>
          </div>
          <div className="flex items-center mt-2">
            <FontAwesomeIcon icon={faPhone} className="text-[#FF8C00] mr-2" />
            <p>+012 345 67890</p>
          </div>
          <div className="flex items-center mt-2">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-[#FF8C00] mr-2"
            />
            <p>info@example.com</p>
          </div>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-white hover:text-[#FF8C00]">
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a href="#" className="text-white hover:text-[#FF8C00]">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="#" className="text-white hover:text-[#FF8C00]">
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
            <a href="#" className="text-white hover:text-[#FF8C00]">
              <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
            </a>
          </div>
        </div>

        {/* Company Section */}
        <div>
          <h4 className="text-lg font-semibold text-[#FF8C00] mb-2">COMPANY</h4>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:text-[#FF8C00]">
                &gt; About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#FF8C00]">
                &gt; Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#FF8C00]">
                &gt; Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#FF8C00]">
                &gt; Terms & Condition
              </a>
            </li>
          </ul>
        </div>

        {/* Services Section */}
        <div>
          <h4 className="text-lg font-semibold text-[#FF8C00] mb-2">
            SERVICES
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#FF8C00]">
                &gt; Spa & Fitness
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#FF8C00]">
                &gt; Sports & Gaming
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#FF8C00]">
                &gt; Event & Party
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#FF8C00]">
                &gt; GYM & Yoga
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6">
        <div className="text-center text-md-start mb-0 border-t mt-11 pt-11 text-[19px]">
          &copy; Your Site Name. All Right Reserved. Designed By
          <span className="text-[#FF8C00] font-semibold">{" Arham Affan "}</span>
        </div>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#ff8c00] text-white py-3 px-4 shadow-md hover:bg-[#e67e00] transition-all float-animation"
          aria-label="Back to Top"
        >
          <FontAwesomeIcon icon={faAngleDoubleUp} size="lg" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
