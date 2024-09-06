import { api } from "~/trpc/server";
import { RoomCard } from "~/app/_components/room/room-card";


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
    <main className="container col-span-12 mx-auto min-h-[calc(100vh_-_180px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-para font-dosis">Choose your preferred room</h1>
      <section className="grid  grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {rooms.length <= 0 ? (
          <div className="col-span-1 flex items-center justify-center lg:col-span-2 xl:col-span-3">
            <p className="text-lg font-bold text-primary md:text-2xl lg:text-4xl">
              No room found
            </p>
          </div>
        ) : (
          rooms.map((room) => <RoomCard key={room.roomId} room={room} />)
        )}
      </section>
    </main>
  );
}
