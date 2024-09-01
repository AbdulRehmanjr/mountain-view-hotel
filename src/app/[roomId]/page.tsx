import { api } from "~/trpc/server";
import { RoomImageCarousel } from "~/app/_components/room/room-carosuel";
import { RoomDetails } from "~/app/_components/room/room-detail";
import { RoomCalendar } from "~/app/_components/room/room-calendar";

export default async function RoomDetailPage({
  params,
}: {
  params: { roomId: string };
}) {
  const room: RoomHotelProps = await api.room.getRoomById({
    roomId: params.roomId,
  });
  return (
    <main className="col-span-12 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl sm:text-4xl font-bold text-white">
        {room.roomName}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoomImageCarousel
          images={room.pictures}
          className="w-full max-w-2xl mx-auto lg:max-w-none"
        />
        <RoomDetails room={room} className="w-full max-w-2xl mx-auto lg:max-w-none" />
        <RoomCalendar roomId={room.roomId} className="col-span-2 w-full max-w-2xl mx-auto lg:max-w-none" />
      </div>
    </main>
  );
}
