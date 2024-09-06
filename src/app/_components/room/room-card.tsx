import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Bed, Users, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export const RoomCard: React.FC<{ room: RoomHotelProps }> = ({ room }) => (
  <Card className="overflow-hidden hover:cursor-pointer">
    <CardHeader className="p-0">
      <div className="relative h-48 w-full">
        <Image
          src={room.dp}
          alt={room.roomName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="font-dosis text-2xl font-bold">
        {room.roomName}
      </CardTitle>
      <div className="mt-3 flex flex-wrap gap-1 font-relaway">
        <Badge variant="outline" className="text-xs">
          {room.roomType}
        </Badge>
        {room.features.slice(0, 2).map((feature) => (
          <Badge key={feature} variant="secondary" className="text-xs">
            {feature}
          </Badge>
        ))}
        {room.features.length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{room.features.length - 2} more
          </Badge>
        )}
      </div>
    </CardContent>
    <CardFooter className="flex flex-col gap-2 p-4 font-relaway">
      <div className="flex w-full justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{room.capacity}</span>
          <Bed size={16} />
          <span>{room.beds}</span>
          <Square size={16} />
          <span>{room.area} m²</span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            <span className="text-xs text-gray-500">Starting from: </span>€
            {room.price}
          </p>
          <p className="text-xs text-gray-500">per night</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button asChild>
          <Link href={`/${room.roomId}`}>details</Link>
        </Button>
      </div>
    </CardFooter>
  </Card>
);
