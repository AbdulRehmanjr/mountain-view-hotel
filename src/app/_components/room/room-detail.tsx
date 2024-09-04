import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { RoomAmenities } from "~/app/_components/room/room-amenities";

type RoomComponentProps = {
  room: RoomHotelProps;
  className?: string;
};

export const RoomDetails = ({ room, className }: RoomComponentProps) => {
  return (
    <Card className={cn("flex h-full w-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-4xl font-bold">{room.roomName}</CardTitle>
        <CardDescription className="line-clamp-3">{room.code}</CardDescription>
        <CardDescription className="line-clamp-3">
          {room.description}
        </CardDescription>
        <div className="text-2xl font-bold">
          ${room.price} <span className="text-sm font-normal">/ night</span>
        </div>
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
          <h3 className="mb-2 space-y-3 text-3xl">Room amenities</h3>
          <RoomAmenities features={room.features} />
        </div>
      </CardContent>
    </Card>
  );
};
