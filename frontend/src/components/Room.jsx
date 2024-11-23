import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faStar,faBed,faBath,faWifi} from "@fortawesome/free-solid-svg-icons";
import api from "../Api";

export default function Room() {
  const [roomData, setRoomData] = useState([]);
  const [imageSources, setImageSources] = useState({});

  const fetchRoomData = async () => {
    try {
      const response = await api.get("/rooms/three/");
      setRoomData(response.data);
      loadImages(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const loadImages = async (rooms) => {
    const sources = {};
    for (const room of rooms) {
      if (room.image) {
        try {
          const image = await import(/* @vite-ignore */ room.image);
          sources[room.image] = image.default;
        } catch (error) {
          console.error(`Failed to load image: ${room.image}`, error);
        }
      } else {
        sources[room.image] = "/path/to/default/image.jpg";
      }
    }
    setImageSources(sources);
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  return (
    <div className="container px-10 mx-auto py-10">
      <div className="text-center mb-14">
        <div className="flex items-center justify-center">
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
          <h2 className="text-[1.2rem] text-[#ff8c00] font-bold uppercase py-3 px-1">
            Our Rooms
          </h2>
          <div className="bg-[#ff8c00] w-[45px] h-[2px]"></div>
        </div>
        <h1 className="text-5xl font-bold mb-5">
          Explore Our <span className="uppercase text-[#ff8c00]">Rooms</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomData.length > 0 ? (
          roomData.map((room) => (
            <div
              key={room.image}
              className="shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)] rounded-2[px]"
            >
              <div className="relative">
                <img
                  className="w-full object-cover rounded-[2px]"
                  src={imageSources[room.image] || "/path/to/default/image.jpg"}
                  alt={room.type}
                />
                <small className="absolute left-4 bottom-[-14px] bg-[#ff8c00] text-[15px] text-white py-1 px-3 rounded-[2px]">
                  ${room.price}/Night
                </small>
              </div>

              <div className="p-4 py-7 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-2xl font-semibold">{room.type}</h5>

                  <div className="space-x-1 text-[#ff8c00]">
                    {[...Array(room.rating)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </div>
                </div>

                <div className="flex mb-3 space-x-3 text-lg">
                  <small className="border-r border-[#dcdedf] pr-3 text-[#666565]">
                    <FontAwesomeIcon
                      icon={faBed}
                      className="mr-2 text-[#ff8c00]"
                    />
                    {room.beds} Bed
                  </small>
                  <small className="border-r border-[#dcdedf] pr-3 text-[#666565]">
                    <FontAwesomeIcon
                      icon={faBath}
                      className="mr-2 text-[#ff8c00]"
                    />
                    {room.baths} Bath
                  </small>
                  <small className="text-[#666565]">
                    <FontAwesomeIcon
                      icon={faWifi}
                      className="mr-2 text-[#ff8c00]"
                    />
                    Wifi
                  </small>
                </div>

                <p className="text-[#666565] text-[1.1rem] mb-3">
                  {room.description}
                </p>

                <div className="flex justify-between">
                  <a
                    className="bg-[#ff8c00] text-white rounded-[2px] py-2 px-5 text-md uppercase mt-2"
                    href="/roomdetails"
                  >
                    View Detail
                  </a>
                  <a
                    className="bg-[#002366] text-white rounded-[2px] py-2 px-5 text-md uppercase mt-2"
                    href="/booking"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No rooms available</p>
        )}
      </div>
    </div>
  );
}
