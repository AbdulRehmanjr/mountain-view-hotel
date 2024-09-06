"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useBooking } from "~/hooks/use-booking";
import { useCart } from "~/hooks/use-cart";

export const AmountDetail = () => {
  const { cart, removeRoomFromCart } = useCart();
  const { total, setTotal } = useBooking();

  useEffect(() => {
    const total = cart.rooms.reduce((total, room) => total + room.total, 0);
    setTotal(total);
  }, [cart.rooms, setTotal]);
  return (
    <div className="grid gap-6 p-6 font-relaway shadow-md">
      <Button variant={"outline"} className="w-fit" asChild>
        <Link href={"/"}>Add another room</Link>
      </Button>
      <div className="space-y-10">
        {cart.rooms.map((room, index) => (
          <div className="mb-6 space-y-2 text-gray-900" key={index}>
            <div className="flex justify-between">
              <p className="text-xl font-extrabold">{room.roomName}</p>
              <Button
                type="button"
                onClick={() => removeRoomFromCart(room.cartItemId)}
              >
                Remove
              </Button>
            </div>
            <p className="flex items-center gap-2">
              <span className="font-bold">Nights:</span> {room.nights}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">Adults:</span> {room.guests}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">Children:</span> {room.children}
            </p>
            {!room.extra && (
              <p className="flex items-center gap-2">
                <span className="font-bold">Meal:</span>
                Breakfast + dinner
              </p>
            )}
            {room.extra && (
              <p className="flex items-center gap-2">
                <span className="font-bold">Extras:</span>
                Breakfast only
              </p>
            )}

            <p className="flex items-center gap-2">
              <span className="font-bold">Rooms:</span> {room.quantity}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">Check-in:</span>{" "}
              {dayjs(room.startDate).format("DD.MM.YYYY")}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">Check-out:</span>{" "}
              {dayjs(room.endDate).format("DD.MM.YYYY")}
            </p>
            <p className="flex justify-between border-y-2 p-2 text-lg font-bold">
              <span>Total:</span> <span>€{room.total.toFixed(2)}</span>
            </p>
          </div>
        ))}
        <p className="flex justify-between border-y-2 p-2 text-xl font-bold">
          <span>Grand total:</span> <span>€{total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};
