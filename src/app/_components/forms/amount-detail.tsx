"use client";

import dayjs from "dayjs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useCart } from "~/hooks/use-cart";

export const AmountDetail = () => {
  const { cart } = useCart();
  return (
    <ScrollArea className="h-[310px] p-6 shadow-md">
      {cart.rooms.map((room, index) => (
        <div className="mb-6 text-gray-900 border-b-2" key={index}>
          <p className="flex items-center gap-2">
            <span className="font-bold">Nights:</span> {room.nights}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Adults:</span> {room.guests}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Children:</span> {room.children}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Meal:</span>
            {room.extra ? "Break fast only" : "Half board"}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Quantity:</span> {room.quantity}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Check-in:</span>{" "}
            {dayjs(room.startDate).format("DD-MM-YYYY")}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Check-out:</span>{" "}
            {dayjs(room.endDate).format("DD-MM-YYYY")}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Total:</span>€{room.total.toFixed(2)}
          </p>
        </div>
      ))}
    </ScrollArea>
  );
};
