import React from "react";
import PageHeader from "../components/PageHeader";
import AboutUs from "../components/About";
import Staff from "../components/Staff";

export default function About() {
    return (
        <>
            <PageHeader title={"About Us"}/>
            <AboutUs />
            <Staff />
        </>
    );
}
