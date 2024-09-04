"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useBooking } from "~/hooks/use-booking";
import { useCart } from "~/hooks/use-cart";

export const CartDetail = () => {
  
  const { cart, removeRoomFromCart } = useCart();
  const { setTotal } = useBooking();
  useEffect(() => {
    const total = cart.rooms.reduce((total, room) => total + room.total, 0);
    setTotal(total);
  }, [cart.rooms, setTotal]);

  if (cart.rooms.length === 0)
    return (
      <section className="grid h-full place-content-center gap-8 p-4 shadow-lg">
        <h1 className="text-center text-3xl text-primary">
          Your cart is empty.
        </h1>
        <Button asChild>
          <Link href="/">Go back</Link>
        </Button>
      </section>
    );

  return (
    <section className="grid h-full grid-cols-1 gap-8 p-4 shadow-lg lg:grid-cols-3">
      {cart.rooms.map((room, index) => (
        <div
          key={index}
          className="flex h-fit flex-col justify-between rounded-lg border p-4 shadow"
        >
          <div className="mb-2 flex items-center justify-between md:mb-4">
            <h2 className="text-xl font-semibold">
              Room name: {room.roomName}
            </h2>
            <Button
              type="button"
              onClick={() => removeRoomFromCart(room.roomId)}
            >
              Remove
            </Button>
          </div>
          <div className="text-base text-gray-600">
            <p>Guests: {room.guests}</p>
            <p>Children: {room.children}</p>
            <p>Nights: {room.nights}</p>
            <p>Extra: {room.extra ? "Break fast only" : "Half board"}</p>
            <p>Quantity: {room.quantity}</p>
            <p>
              Date Range: {dayjs(room.startDate).format("DD-MM-YYYY")} to{" "}
              {dayjs(room.endDate).format("DD-MM-YYYY")}
            </p>
            <p className="font-bold">Total: ${room.total.toFixed(2)}</p>
          </div>
        </div>
      ))}
      <div className="col-span-3 flex justify-center">
        <Button asChild>
          <Link href={"/booking"}>Proceed to booking</Link>
        </Button>
      </div>
    </section>
  );
};
