import React from "react";
import BookingForm from "../components/BookingForm";
import PageHeader from "../components/PageHeader";

export default function Booking() {
  return (
    <>
      <PageHeader title={"Booking"} />
      <BookingForm />
    </>
  );
}
