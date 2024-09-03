"use client";

import dayjs from "dayjs";
import { useHotel } from "~/hooks/use-hotel";

export const AmountDetail = () => {
  const { room, dateRange } = useHotel();

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 text-gray-900">
        <p className="flex items-center gap-2">
          <span className="font-bold">Nights:</span> {room.nights}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-bold">Adults:</span> {room.guests}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-bold">Children:</span> {room.children}
        </p>
        <div className="mt-3">
          <p className="flex items-center gap-2">
            <span className="font-bold">Check-in:</span>{" "}
            {dayjs(dateRange.startDate).format("DD-MM-YYYY")}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-bold">Check-out:</span>{" "}
            {dayjs(dateRange.endDate).format("DD-MM-YYYY")}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          Price Summary
        </h3>
        <div className="mt-4 flex justify-between border-t pt-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-bold">${room.total} €</span>
        </div>
      </div>
    </div>
  );
};
