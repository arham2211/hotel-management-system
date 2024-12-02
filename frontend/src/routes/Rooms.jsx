import React from "react";
import Room from "../components/Room";
import Testimonials from "../components/Testimonial";
import PageHeader from "../components/PageHeader";

export default function Service() {
  return (
    <>
      <PageHeader title={"Rooms"} />
      <Room limit={6}/>
      <Testimonials />
    </>
  );
}

