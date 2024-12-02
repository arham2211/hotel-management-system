import React from "react";
import TeamComponent from "../components/Team";
import Testimonials from "../components/Testimonial";
import PageHeader from "../components/PageHeader";

export default function Service() {
  return (
    <>
      <PageHeader title={"Team"} />
      <TeamComponent />
      <Testimonials />
    </>
  );
}

