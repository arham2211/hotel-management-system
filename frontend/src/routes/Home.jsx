import React from "react";
import Carousel from "../components/Carousel";
import AboutUs from "../components/About";
import Room from "../components/Room";


export default function Home() {
    return (
        <>
            <Carousel />
            <AboutUs />
            <Room />
        </>
    );
}