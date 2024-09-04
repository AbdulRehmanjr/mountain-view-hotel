import { MdBalcony, MdPool, MdCoffee } from "react-icons/md";
import { TiTree } from "react-icons/ti";
import { TbAirConditioning } from "react-icons/tb";
import { FaMountain, FaBath, FaTv, FaWifi } from "react-icons/fa6";
import { LuRefrigerator } from "react-icons/lu";
import { BsSafe2Fill } from "react-icons/bs";
import { PiHairDryerFill } from "react-icons/pi";

const FEATURES = [
  { label: "Balcony", value: "Balcony", icon: <MdBalcony /> },
  { label: "Garden view", value: "Garden view", icon: <TiTree /> },
  { label: "Pool view", value: "Pool view", icon: <MdPool /> },
  { label: "Mountain view", value: "Mountain view", icon: <FaMountain /> },
  { label: "Air condition", value: "Air condition", icon: <TbAirConditioning /> },
  { label: "Own bathroom (ensuite)", value: "Own bathroom (ensuite)", icon: <FaBath /> },
  { label: "Flat-screen TV", value: "Flat-screen TV", icon: <FaTv /> },
  { label: "Terrace", value: "Terrace", icon: <MdBalcony /> },
  { label: "Minibar", value: "Minibar", icon: <LuRefrigerator /> },
  { label: "Safe", value: "Safe", icon: <BsSafe2Fill /> },
  { label: "Free Wifi", value: "Free Wifi", icon: <FaWifi /> },
  { label: "Hairdryer", value: "Hairdryer", icon: <PiHairDryerFill /> },
  { label: "Tea & coffee", value: "Tea & coffee", icon: <MdCoffee /> },
];

export const RoomAmenities = ({ features }: { features: string[] }) => {
  const filteredFeatures = FEATURES.filter((feature) =>
    features.includes(feature.value)
  );

  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
      {filteredFeatures.map((feature, index) => (
        <div className="flex flex-col items-center text-center" key={index}>
          <div className="text-5xl mb-2">
            {feature.icon}
          </div>
          <div className="text-lg font-medium">
            {feature.label}
          </div>
        </div>
      ))}
    </div>
  );
};
