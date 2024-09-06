"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import isBetween from "dayjs/plugin/isBetween";
import { useHotel } from "~/hooks/use-hotel";
import { useCart } from "~/hooks/use-cart";
import { useRouter } from "next/navigation";



dayjs.extend(isBetween);

type RoomCalendarProps = {
  roomId: string;
  roomName:string
  hotelId:string
  className?: string;
};

export const RoomCalendar = ({ roomId, roomName,hotelId, className }: RoomCalendarProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const { room, dateRange, setDateRange, setRoom,resetStore } = useHotel();
  const router = useRouter()
  const {addRoomToCart} = useCart()

  const pricesData = api.price.getPricesWithRateIdAndRoomId.useQuery(
    { roomId: roomId, rateId: room.rateId },
    { enabled: room.rateId != "none" },
  );

  const blockDates = api.price.getBlockDatesByRoomIdAndQuantity.useQuery(
    { roomId: roomId, quantity: room.quantity },
    { enabled: room.quantity != 0 },
  );

  const currentMonth: Dayjs[][] = useMemo(() => {
    const currentMonth = selectedMonth || dayjs();
    const firstDay = currentMonth.clone().startOf("month").day();
    const daysInMonth = currentMonth.daysInMonth();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const emptyDaysBefore: Dayjs[] = Array(firstDay).fill(null);
    const currentMonthDays: Dayjs[] = Array.from(
      { length: daysInMonth },
      (_, i) => dayjs(currentMonth).date(i + 1),
    );
    const calendarGrid: Dayjs[] = [...emptyDaysBefore, ...currentMonthDays];
    const weekgrid: Dayjs[][] = [];
    const chunkSize = 7;
    for (let i = 0; i < calendarGrid.length; i += chunkSize)
      weekgrid.push(calendarGrid.slice(i, i + chunkSize));
    return weekgrid;
  }, [selectedMonth]);

  const getPrice = useCallback(
    (date: Dayjs): number => {
      if (pricesData.data) {
        const priceEntry = pricesData.data.RoomPrice.find((data) =>
          date.isBetween(
            dayjs(data.startDate),
            dayjs(data.endDate),
            "day",
            "[]",
          ),
        );
        return priceEntry?.price ?? 0;
      }
      return 0;
    },
    [pricesData.data],
  );

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      let total = 0;
      let currentDate = dayjs(dateRange.startDate).clone();

      while (
        currentDate.isBefore(dateRange.endDate,'day')
      ) {
        const price = getPrice(currentDate);
        total += price;
        currentDate = currentDate.add(1, "day");
      }
      const persons = (room.guests ?? 0) + (room.children ?? 0);
      total = total * persons * room.quantity;
      setRoom({ total });
    }
  }, [
    dateRange.endDate,
    dateRange.startDate,
    getPrice,
    room.children,
    room.guests,
    room.quantity,
    setRoom,
  ]);

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => prev.add(1, "month"));
  };

  const isDateBlocked = (date: Dayjs) => {
    return blockDates.data?.some(({ startDate, endDate }) => {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      return date.isBetween(start, end, "day", "[]");
    });
  };

  const isInRange = (date: Dayjs) => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    return date.isBetween(dateRange.startDate, dateRange.endDate, "day", "[]");
  };

  const handleDateClick = (date: Dayjs) => {
    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      setDateRange({ startDate: date, endDate: null });
      setRoom({ nights: 1 });
    } else {
      if (date.isBefore(dateRange.startDate)) {
        setDateRange({ startDate: date, endDate: dateRange.startDate });
      } else {
        setDateRange({ startDate: dateRange.startDate, endDate: date });
      }
      const nights = date.diff(dateRange.startDate, "day");
      setRoom({ nights });
    }
  };

  const DateTemplate = ({ date }: { date: Dayjs }) => {
    if (!date)
      return (
        <Button
          type="button"
          variant={"outline"}
          className="h-[64px] w-[41px] border border-gray-700 md:h-24 md:w-[199.7px] rounded-none"
          disabled
        ></Button>
      );

    const isPast = date.isBefore(dayjs(), "day");
    const isBlocked = isDateBlocked(date);
    const isSelected =
      date.isSame(dateRange.startDate, "day") ||
      date.isSame(dateRange.endDate, "day");
    const isInSelectedRange = isInRange(date);
    const price = getPrice(date);

    return (
      <Button
        variant={isBlocked ? "destructive" : "outline"}
        type="button"
        className={cn(
          "relative flex h-[64px] w-[41px] flex-col gap-1 border border-gray-700 text-gray-600 md:h-24 md:w-[199.7px] rounded-none font-relaway text-lg",
          isBlocked && "text-white",
          isSelected && "bg-red-500 text-white",
          isInSelectedRange && "bg-red-700 text-white",
        )}
        disabled={isPast || isBlocked}
        onClick={() => handleDateClick(date)}
      >
        <span className="font-bold">{date.date()}</span>
        {!isPast && !isBlocked && <span className="text-base font-bold">{price} €</span>}
      </Button>
    );
  };

  const addToCart = () => {
    const roomToAdd = {
      ...room,
      cartItemId: crypto.randomUUID(),
      roomName:roomName,
      hotelId:hotelId,
      startDate: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
    };
    addRoomToCart(roomToAdd);
    resetStore()
    router.push('/booking')
  };

  return (
    <Card className={cn("flex h-full w-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-dosis">Arrival and departure date</CardTitle>
        <CardDescription className="text-para font-relaway">Select your booking dates</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <Button
          variant={"outline"}
          className="w-fit"
          type="button"
          onClick={() => {
            setDateRange({ startDate: null, endDate: null });
            setRoom({ total: 0 });
          }}
        >
          Clear
        </Button>
        <div className="mb-6 flex items-center justify-between">
          <Button type="button" size="sm" onClick={handlePreviousMonth}>
            Previous
          </Button>
          <h2 className="text-xl font-bold font-relaway">
            {selectedMonth.format("MMMM YYYY")}
          </h2>
          <Button type="button" size="sm" onClick={handleNextMonth}>
            Next
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekdayNames.map((day) => (
            <p key={day} className="text-center font-semibold text-para font-relaway">
              {day}
            </p>
          ))}
          {currentMonth.map((week, index) => (
            <div key={index} className="col-span-7 flex gap-1">
              {week.map((date, dateIndex) => (
                <DateTemplate date={date} key={dateIndex} />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-center">
        <Button type="button" onClick={addToCart} disabled={room.total == 0} >
          Continue
        </Button>

      </CardFooter>
    </Card>
  );
};
