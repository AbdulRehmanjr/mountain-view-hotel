"use client";
import { useMemo, useState } from "react";
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

dayjs.extend(isBetween);

type RoomCalendarProps = {
  roomId: string;
  className?: string;
};

type DayjsRangeProps = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
};

export const RoomCalendar = ({ roomId, className }: RoomCalendarProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedRange, setSelectedRange] = useState<DayjsRangeProps>({
    startDate: null,
    endDate: null,
  });
  const pricesData = api.price.getPricesWithRateIdAndRoomId.useQuery({
    roomId: "aa52abdb-c26c-48c6-b229-de89f148ebdd",
    rateId: " 91d02c49-5eaa-4233-825f-f272018a09c6,",
  });
  const blockDates = api.price.getBlockDatesByRoomIdAndQuantity.useQuery({
    roomId: roomId,
    quantity: 1,
  });

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
    if (!selectedRange.startDate || !selectedRange.endDate) return false;
    return date.isBetween(
      selectedRange.startDate,
      selectedRange.endDate,
      "day",
      "[]",
    );
  };

  const handleDateClick = (date: Dayjs) => {
    if (
      !selectedRange.startDate ||
      (selectedRange.startDate && selectedRange.endDate)
    ) {
      setSelectedRange({ startDate: date, endDate: null });
    } else if (date.isBefore(selectedRange.startDate)) {
      setSelectedRange({ startDate: date, endDate: selectedRange.startDate });
    } else {
      setSelectedRange({ ...selectedRange, endDate: date });
    }
  };

  const calculatePrice = (priceEntry: number, incrementPercentage: number) =>
    6 > 3
      ? priceEntry + priceEntry * (incrementPercentage / 100)
      : priceEntry;

  const getPrice = (date: Dayjs): number => {
    if (pricesData.data) {
      const priceEntry = pricesData.data.RoomPrice.find((data) =>
        date.isBetween(dayjs(data.startDate), dayjs(data.endDate), "day", "[]"),
      );
      return priceEntry ? calculatePrice(priceEntry.price, 10) : 0;
    }
    return 0;
  };

  const DateTemplate = ({ date }: { date: Dayjs }) => {
    if (!date)
      return (
        <Button
          type="button"
          variant={"outline"}
          className="h-16 w-[199.7px] border border-gray-700"
          disabled
        ></Button>
      );

    const isPast = date.isBefore(dayjs(), "day");
    const isBlocked = isDateBlocked(date);
    const isSelected =
      date.isSame(selectedRange.startDate, "day") ||
      date.isSame(selectedRange.endDate, "day");
    const isInSelectedRange = isInRange(date);
    const price = getPrice(date)

    return (
      <Button
        variant={isBlocked ? "destructive" : "outline"}
        type="button"
        className={cn(
          "relative h-16 w-[199.7px] border border-gray-700 text-gray-600",
          isBlocked && "text-white",
          isSelected && "bg-red-500 text-white",
          isInSelectedRange && "bg-red-700 text-white",
        )}
        disabled={isPast || isBlocked}
        onClick={() => handleDateClick(date)}
      >
        {date.date()}
        {!isPast && ! isBlocked && <span>{price} €</span>}
      </Button>
    );
  };

  return (
    <Card className={cn("flex h-full w-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Date selection</CardTitle>
        <CardDescription>Select booking dates for room</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="mb-6 flex items-center justify-between">
          <Button size="sm" onClick={handlePreviousMonth}>
            Previous
          </Button>
          <h2 className="text-xl font-bold">
            {selectedMonth.format("MMMM YYYY")}
          </h2>
          <Button size="sm" onClick={handleNextMonth}>
            Next
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekdayNames.map((day) => (
            <p key={day} className="text-center font-semibold">
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
        <p>Room ID: {roomId}</p>
      </CardFooter>
    </Card>
  );
};
