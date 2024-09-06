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
    <Card className={cn("flex h-full w-full flex-col space-y-6", className)}>
      <CardHeader className="space-y-16">
        <CardTitle className="font-dosis text-4xl font-bold">
          {room.roomName}
        </CardTitle>
        <div className="flex flex-wrap gap-2 font-relaway">
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
      </CardHeader>
      <CardContent className="flex-grow space-y-14">
        <CardDescription className="line-clamp-3 font-relaway text-para">
          {room.description}
        </CardDescription>
        <div>
          <h3 className="mb-2 py-6 font-dosis text-3xl">Room amenities</h3>
          <RoomAmenities features={room.features} />
        </div>
      </CardContent>
    </Card>
  );
};
