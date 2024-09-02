'use client'

import { useHotel } from "~/hooks/use-hotel";
interface DataItemProps {
  label: string;
  value: string | number;
  unit?: string;
}

const DataItem: React.FC<DataItemProps> = ({ label, value, unit = '' }) => (
  <div className="flex flex-col justify-between border border-gray-300 rounded-lg p-3 min-w-[7rem] h-24 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
    <div className="flex items-baseline gap-1">
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {unit && <span className="text-sm text-gray-600">{unit}</span>}
    </div>
  </div>
);

export const HeaderData = () => {

  const {room} = useHotel()
  return (
    <div className="hidden md:flex md:w-full md:place-content-center md:gap-4">
      <DataItem label="Guests" value={room.guests} />
      <DataItem label="Children" value={room.children} />
      <DataItem label="Nights" value={room.nights} />
      <DataItem label="Rooms" value={room.quantity} />
      <DataItem 
        label="Extras" 
        value={room.extra ? 'Breakfast only':'none'} 
      />
      <DataItem label="Total" value={room.total} unit="€" />
    </div>
  );
};