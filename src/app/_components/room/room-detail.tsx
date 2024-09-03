import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import {MdBalcony,MdPool,MdCoffee} from 'react-icons/md'
import {TiTree} from 'react-icons/ti'
import { TbAirConditioning } from "react-icons/tb";
import {FaMountain,FaBath,FaTv,FaWifi} from 'react-icons/fa6'
import { LuRefrigerator } from "react-icons/lu";
import { BsSafe2Fill } from "react-icons/bs";
import { PiHairDryerFill } from "react-icons/pi";

const FeatureProps = [
  { label: "Balcony", value: "Balcony", icon: <MdBalcony /> },
  { label: "Garden view", value: "Garden view", icon: <TiTree/> },
  { label: "Pool view", value: "Pool view", icon: <MdPool/> },
  { label: "Mountain view", value: "Mountain view", icon: <FaMountain /> },
  { label: "Air condition", value: "Air condition", icon: <TbAirConditioning /> },
  { label: "Own bathroom(ensuite)", value: "Own bathroom(ensuite)", icon: <FaBath/> },
  { label: "Flat - screen TV", value: "Flat - screen TV", icon: <FaTv/> },
  { label: "Terrace", value: "Terrace", icon: <MdBalcony /> },
  { label: "Minibar", value: "Minibar", icon: <LuRefrigerator /> },
  { label: "Safe", value: "Safe", icon: <BsSafe2Fill /> },
  { label: "Free Wifi", value: "Free Wifi", icon: <FaWifi/> },
  { label: "Hairdryer", value: "Hairdryer", icon: <PiHairDryerFill /> },
  { label: "Tea & coffee", value: "Tea & coffee", icon: <MdCoffee /> },
];

type RoomComponentProps = {
  room: RoomHotelProps;
  className?: string;
};

export const RoomDetails = ({ room, className }: RoomComponentProps) => {
  return (
    <Card className={cn("flex h-full w-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-4xl font-bold">{room.roomName}</CardTitle>
        <CardDescription className="line-clamp-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, saepe eius delectus id corrupti nulla ipsa, nemo ab earum, autem architecto! Quisquam facere omnis incidunt quo placeat accusantium a distinctio deserunt est et veniam ut voluptatem consequatur sequi sint blanditiis nesciunt iste, nulla labore doloribus. Natus quae, labore aliquam ad tempora harum, dignissimos excepturi atque iure dolore laborum. Illo ab atque ratione iste natus, molestiae nisi possimus debitis voluptate aperiam!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm">
            {room.capacity} Guests
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {room.area} m²
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {room.beds} {room.beds > 1 ? "Beds" : "Bed"}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {room.roomType}
          </Badge>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Room amenities</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {room.features.map((feature, index) => (
              <p key={index} className="text-sm md:text-base">
                {feature}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Hotel information</h3>
          <p className="text-sm">
            <strong>Name:</strong> {room.hotel.hotelName}
          </p>
          <p className="text-sm">
            <strong>Island:</strong> {room.hotel.island}
          </p>
          <p className="text-sm">
            <strong>Address:</strong> {room.hotel.address}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center">
        <div className="text-2xl font-bold">
          ${room.price} <span className="text-sm font-normal">/ night</span>
        </div>
      </CardFooter>
    </Card>
  );
};
