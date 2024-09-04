import Image from "next/image";
import { api } from "~/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Bed, Users, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const RoomCard: React.FC<{ room: RoomHotelProps }> = ({ room }) => (
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
      <CardTitle className="text-lg font-bold">{room.roomName}</CardTitle>
      <CardDescription className="text-sm text-gray-500">
        {room.hotel.hotelName}
      </CardDescription>
      <div className="mt-2 flex flex-wrap gap-1">
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
    <CardFooter className="flex flex-col gap-2 p-4">
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
          <p className="text-lg font-bold">${room.price}</p>
          <p className="text-xs text-gray-500">per night</p>
        </div>
      </div>
      <Button asChild className="w-full">
        <Link href={`/${room.roomId}`}>Details</Link>
      </Button>
    </CardFooter>
  </Card>
);

type SearchProps = {
  adults: number;
  children: number;
  startDate: string;
  endDate: string;
};
export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchProps;
}) {
  const rooms = await api.room.getRoomsBySellerId({
    adults: searchParams.adults,
    children: searchParams.children,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });

  return (
    <main className="container col-span-12 min-h-screen mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Available rooms
      </h1>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 h-full">
        {rooms.map((room) => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </section>
    </main>
  );
}
