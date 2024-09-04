import { api, HydrateClient } from "~/trpc/server";
import { RoomImageCarousel } from "~/app/_components/room/room-carosuel";
import { RoomDetails } from "~/app/_components/room/room-detail";
import { RoomCalendar } from "~/app/_components/room/room-calendar";
import { RoomInput } from "~/app/_components/room/room-input";
import { Suspense } from "react";
import { SimpleLoader } from "~/app/_components/skeletons/simple-loader";

export default async function RoomDetailPage({params}: {params: { roomId: string }}) {
  const room: RoomHotelProps = await api.room.getRoomById({roomId: params.roomId})
  void api.room.getRoomRateByRoomId.prefetch({ roomId: params.roomId });
  return (
    <HydrateClient>
      <main className="container col-span-12 mx-auto flex flex-col space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <RoomImageCarousel images={room.pictures} />
        <RoomDetails room={room} />
        <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-5">
          <Suspense fallback={<SimpleLoader />}>
            <RoomInput roomId={params.roomId} roomName={room.roomName} maxQuantity={room.quantity} />
          </Suspense>
        </div>
        <RoomCalendar roomId={room.roomId} hotelId={room.hotelId} roomName={room.roomName} />
      </main>
    </HydrateClient>
  );
}
