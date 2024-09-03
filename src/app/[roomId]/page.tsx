import { api, HydrateClient } from "~/trpc/server";
import { RoomImageCarousel } from "~/app/_components/room/room-carosuel";
import { RoomDetails } from "~/app/_components/room/room-detail";
import { RoomCalendar } from "~/app/_components/room/room-calendar";
import { RoomInput } from "~/app/_components/room/room-input";
import { Suspense } from "react";
import { SimpleLoader } from "~/app/_components/skeletons/simple-loader";

export default async function RoomDetailPage({
  params,
}: {
  params: { roomId: string };
}) {
  const room: RoomHotelProps = await api.room.getRoomById({
    roomId: params.roomId,
  });

  void api.room.getRoomRateByRoomId.prefetch({ roomId: params.roomId });
  return (
    <HydrateClient>
      <main className="container col-span-12 mx-auto flex flex-col space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <RoomImageCarousel images={room.pictures} />
        <RoomDetails room={room} />
        <Suspense fallback={<SimpleLoader />}>
          <RoomInput roomId={params.roomId} maxQuantity={room.quantity} />
        </Suspense>
        <RoomCalendar roomId={room.roomId} />
      </main>
    </HydrateClient>
  );
}
