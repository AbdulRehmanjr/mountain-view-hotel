"use client";
import { debounce } from "lodash";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useHotel } from "~/hooks/use-hotel";
import { api } from "~/trpc/react";

type RoomInputProps = {
  maxQuantity: number;
  roomId: string;
  roomName: string;
  className?: string;
};

export const RoomInput = ({
  roomId,
  roomName,
  maxQuantity,
}: RoomInputProps) => {
  const { room, setRoom } = useHotel();

  const [ratePlans] = api.room.getRoomRateByRoomId.useSuspenseQuery({
    roomId: roomId,
  });

  useEffect(() => {
    setRoom({ roomId: roomId });
  }, [roomId, setRoom]);

  useEffect(() => {
    if (room.quantity == 0) {
      setRoom({ guests: 0, children: 0 });
    }
  }, [room.quantity, setRoom]);

  const people = useMemo(() => {
    if (roomName.toLowerCase().includes("deluxe")) return 2 * room.quantity;
    else if (roomName.toLowerCase().includes("superior"))
      return 2 * room.quantity;
    else if (roomName.toLowerCase().includes("family"))
      return 3 * room.quantity;
    return 0;
  }, [room.quantity, roomName]);

  const getRoomType = useCallback(
    (roomName: string, adults: number, children: number) => {
      const findRatePlan = (type: string) =>
        ratePlans.find((rateplan) => rateplan.name.toLowerCase() === type)
          ?.ratePlanId;

      let rateId: string | undefined;

      if (roomName.toLowerCase().includes("deluxe")) {
        if (adults === 1 && children === 0) {
          rateId = findRatePlan("single");
        } else if (
          (adults === 2 && children === 0) ||
          (adults === 1 && children === 1)
        ) {
          rateId = findRatePlan("double");
        }
      } else if (roomName.toLowerCase().includes("superior")) {
        if (adults === 1 && children === 0) {
          rateId = findRatePlan("single");
        } else if (
          (adults === 2 && children === 0) ||
          (adults === 1 && children === 1)
        ) {
          rateId = findRatePlan("double");
        }
      } else if (roomName.toLowerCase().includes("family")) {
        if (adults === 3 && children === 0) {
          rateId = findRatePlan("triple");
        } else if (
          (adults === 2 && children <= 1) ||
          (adults === 1 && children <= 2)
        ) {
          rateId = findRatePlan("double");
        }
      }

      if (rateId) {
        setRoom({ rateId });
      }
    },
    [ratePlans, setRoom],
  );

  useEffect(() => {
    getRoomType(roomName, room.guests, room.children);
  }, [roomName, room.guests, room.children, getRoomType]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold font-dosis">1. Rooms</CardTitle>
          <CardDescription className="line-clamp-3 font-relaway text-para">
            Select the number of rooms
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center  gap-4">
          <Button

            title="decrement"
            size="sm"
            type="button"
            onClick={debounce(
              () => setRoom({ quantity: room.quantity - 1 }),
              100,
            )}
            disabled={room.quantity === 0}
          >
            <MinusIcon />
          </Button>
          <p className="text-lg">{room.quantity}</p>
          <Button

            title="increment"
            size="sm"
            type="button"
            onClick={debounce(
              () => setRoom({ quantity: room.quantity + 1 }),
              100,
            )}
            disabled={room.quantity === maxQuantity}
          >
            <PlusIcon />
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold font-dosis">2. Guests</CardTitle>
          <CardDescription className="line-clamp-3 font-relaway text-para">
            Select the number of adults and children
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <div className="flex items-center gap-4 rounded-sm border p-2 shadow-sm">
            <p className="text-xl text-gray-800">Adults</p>
            <div className="flex items-center gap-4">
              <Button
                className="w-full"
                title="decrement"
                size="sm"
                type="button"
                onClick={() => setRoom({ guests: room.guests - 1 })}
                disabled={room.guests === 0}
              >
                <MinusIcon />
              </Button>
              <p className="text-lg">{room.guests}</p>
              <Button
                className="w-full"
                title="increment"
                size="sm"
                type="button"
                onClick={() => setRoom({ guests: room.guests + 1 })}
                disabled={room.guests + room.children == people}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-sm border p-2 shadow-sm">
            <p className="text-xl text-gray-800">Children</p>
            <div className="flex items-center gap-4">
              <Button
                className="w-full"
                title="decrement"
                size="sm"
                type="button"
                onClick={() => setRoom({ children: room.children - 1 })}
                disabled={room.children === 0}
              >
                <MinusIcon />
              </Button>
              <p className="text-lg">{room.children}</p>
              <Button
                className="w-full"
                title="increment"
                size="sm"
                type="button"
                onClick={() => setRoom({ children: room.children + 1 })}
                disabled={room.guests + room.children == people}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold font-dosis">
            3. Extras (optional)
          </CardTitle>
          <CardDescription className="line-clamp-3 font-relaway text-para">
            Choose breakfast only if do not want to have dinner
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Button
            type="button"
            onClick={() => {
              setRoom({ extra: !room.extra });
              const extraDiscount =
                15 *
                (room.guests + room.children) *
                room.nights *
                room.quantity;
              if (room.total !== 0) {
                if (!room.extra) {
                  setRoom({ total: room.total - extraDiscount });
                } else {
                  setRoom({ total: room.total + extraDiscount });
                }
              }
            }}
          >
            Breakfast only (-15 € pp)
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
