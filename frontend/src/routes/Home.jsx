import React from "react";
import Carousel from "../components/Carousel";
import Header from "../components/Header";
import '../components/Carousel.css'
import AboutUs from "../components/About";


export default function Home() {
    return (
        <>
            <Header />
            <Carousel />
            <AboutUs />
        </>
    );
}