'use client'



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

export const HeaderData: React.FC = () => {

  return (
    <div className="hidden md:flex md:w-full md:place-content-center md:gap-4">
      <DataItem label="Guests" value={0} />
      <DataItem label="Children" value={0} />
      <DataItem label="Nights" value={0} />
      <DataItem label="Rooms" value={0} />
      <DataItem 
        label="Extras" 
        value={"None"} 
      />
      <DataItem label="Total" value={10} unit="€" />
    </div>
  );
};