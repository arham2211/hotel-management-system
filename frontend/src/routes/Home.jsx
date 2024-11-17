import React from "react";
import Carousel from "../components/Carousel";
import AboutUs from "../components/About";
import Room from "../components/Room";
import Services from "../components/Services";
import Testimonials from "../components/Testimonial";
import Staff from "../components/Staff";

export default function Home() {
    return (
        <>
            <Carousel />
            <AboutUs />
            <Room />
            <Services />
            <Testimonials />
            <Staff />
            
        </>
    );
}