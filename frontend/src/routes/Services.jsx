import React from "react";
import Services from "../components/Services";
import Testimonials from "../components/Testimonial";
import PageHeader from "../components/PageHeader";

export default function Service() {
  return (
    <>
      <PageHeader title={"Services"} />
      <Services />
      <Testimonials />
    </>
  );
}

