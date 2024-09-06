"use client";

import dayjs from "dayjs";
import { useHotel } from "~/hooks/use-hotel";
interface DataItemProps {
  label: string;
  value: string | number;
  unit?: string;
}

const DataItem: React.FC<DataItemProps> = ({ label, value, unit = "" }) => (
  <div className="flex h-24 min-w-[8rem] flex-col justify-between rounded-lg border border-gray-300 p-3 shadow-sm transition-shadow hover:shadow-md">
    <p className="font-dosis text-lg font-extrabold text-gray-500">{label}</p>
    <div className="flex items-baseline gap-1 font-relaway">
      <p className="text-base text-gray-800">{value}</p>
      {unit && <span className="text-base">{unit}</span>}
    </div>
  </div>
);

export const HeaderData = () => {
  const { room, dateRange } = useHotel();
  return (
    <div className="hidden md:flex md:w-full md:place-content-center md:gap-4">
      <DataItem label="Adults" value={room.guests} />
      <DataItem label="Children" value={room.children} />
      <DataItem label="Nights" value={room.nights} />
      <DataItem label="Rooms" value={room.quantity} />
      <DataItem
        label="Arrival date"
        value={
          dateRange.startDate
            ? dayjs(dateRange.startDate).format("DD.MM.YYYY")
            : "DD.MM.YYYY"
        }
      />
      <DataItem
        label="Departure date"
        value={
          dateRange.endDate
            ? dayjs(dateRange.endDate).format("DD.MM.YYYY")
            : "DD.MM.YYYY"
        }
      />
      <DataItem label="Extras" value={room.extra ? "Breakfast only" : "none"} />
      <DataItem label="Total" value={room.total} unit="€" />
    </div>
  );
};
