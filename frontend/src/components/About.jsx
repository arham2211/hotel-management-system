import React, { useRef, useState, useEffect } from "react"; 
import CountUp from "react-countup";
import { motion, useInView } from "framer-motion"; 
import about1 from "../assets/about-1.jpg";
import about2 from "../assets/about-2.jpg";
import about3 from "../assets/about-3.jpg";
import about4 from "../assets/about-4.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faHotel, faUsersCog } from "@fortawesome/free-solid-svg-icons"; 

const AboutUs = () => {
  const ref = useRef(null); 
  const inView = useInView(ref, { once: false }); 
  const [countStarted, setCountStarted] = useState(false); 

  useEffect(() => {
    if (inView) {
      setCountStarted(true);
    }
  }, [inView]);

  return (
    <div className="container px-10 mx-auto py-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center" ref={ref}>
        <div>
          <motion.h6
            className="font-[700] text-lg text-start uppercase text-[#ff8c00]"
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }} 
            transition={{ duration: 0.5 }}
          >
            About Us <hr className="w-12 h-[3px] bg-[#ff8c00] inline-block ml-1 mb-1"/>
          </motion.h6>
          <motion.h1
            className="my-3 text-5xl font-[600]"
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Welcome to <span className="hotel-span uppercase text-[#ff8c00]">Hotelier</span>
          </motion.h1>
          <motion.p
            className="mb-4 text-[#666565]"
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.
            Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.
          </motion.p>
          <div className="grid grid-cols-3 gap-5 pb-4">
            {[{ label: "Rooms", icon: faHotel, count: 1234 },
              { label: "Staffs", icon: faUsersCog, count: 1234 },
              { label: "Clients", icon: faUsers, count: 1234 }].map((item, index) => (
                <motion.div
                  key={index}
                  className="border border-[#dee2e6] rounded p-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }} 
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                >
                  <div className="border border-[#dee2e6] rounded text-center p-8">
                    <FontAwesomeIcon icon={item.icon} className="fa-2x mb-2 text-[#ff8c00]" /> {/* Use FontAwesomeIcon here */}
                    <h2 className="mb-1 text-3xl font-bold">
                      <CountUp end={item.count} duration={3} start={countStarted} separator="" />
                    </h2>
                    <p className="mb-0 text-[#666565]">{item.label}</p>
                  </div>
                </motion.div>
              ))}
          </div>
          <motion.a
            className="text-xl uppercase bg-[#ff8c00] text-white py-4 px-8 mt-4 inline-block"
            href="#"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }} 
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Explore More
          </motion.a>
        </div>

        {/* Image Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-end items-end">
            <motion.img
              className="rounded w-3/4 h-max"
              src={about1}
              alt="About 1"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
          <div className="flex justify-start">
            <motion.img
              className="rounded w-full"
              src={about2}
              alt="About 2"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <div className="flex justify-end">
            <motion.img
              className="rounded w-1/2 h-3/5"
              src={about3}
              alt="About 3"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
          <div className="flex justify-start">
            <motion.img
              className="rounded w-3/4"
              src={about4}
              alt="About 4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

