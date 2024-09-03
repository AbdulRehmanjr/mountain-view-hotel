"use client";
import { debounce } from "lodash";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useHotel } from "~/hooks/use-hotel";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type RoomInputProps = {
  maxQuantity: number;
  roomId: string;
  className?: string;
};

export const RoomInput = ({
  roomId,
  maxQuantity,
  className,
}: RoomInputProps) => {
  const { room, setRoom } = useHotel();

  const [ratePlans] = api.room.getRoomRateByRoomId.useSuspenseQuery({
    roomId: roomId,
  });

  return (
    <Card className={cn("flex h-full w-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Booking information
        </CardTitle>
        <CardDescription className="line-clamp-3">
          Give some booking details so we can fetch best option for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="grid gap-2 rounded-md border p-2 shadow-md">
            <p className="text-xl text-gray-800">1. Occupancy</p>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="grid w-[18.3rem] gap-2 rounded-md border p-2 shadow-md md:w-[20rem]">
                <p className="text-xl text-gray-800">No. of adults</p>
                <div className="flex items-center gap-4">
                  <Button
                    className="w-full"
                    title="decrement"
                    size="sm"
                    type="button"
                    onClick={() => setRoom({ guests: room.guests - 1 })}
                    disabled={room.guests == 0}
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
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>
              <div className="grid w-[18.3rem] gap-2 rounded-md border p-2 shadow-md md:w-[20rem]">
                <p className="text-xl text-gray-800">No. of children</p>
                <div className="flex items-center gap-4">
                  <Button
                    className="w-full"
                    title="decrement"
                    size="sm"
                    type="button"
                    onClick={() => setRoom({ children: room.children - 1 })}
                    disabled={room.children == 0}
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
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid w-[20rem] gap-2 rounded-md border p-2 shadow-md">
            <p className="text-xl text-gray-800">2. Room category</p>
            <div className="flex items-center gap-4">
              <Select
                onValueChange={(value) => setRoom({ rateId: value,roomId: roomId })}
                value={room.rateId ?? ""}
              >
                <SelectTrigger className="bg-primary text-white">
                  <SelectValue placeholder="Room category" />
                </SelectTrigger>
                <SelectContent>
                  {ratePlans.map((rateplan) => (
                    <SelectItem
                      value={rateplan.ratePlanId}
                      key={rateplan.ratePlanId}
                    >
                      {rateplan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid w-[20rem] gap-2 rounded-md border p-2 shadow-md">
            <p className="text-xl text-gray-800">3. No. of rooms</p>
            <div className="flex items-center gap-4">
              <Button
                className="w-full"
                title="decrement"
                size="sm"
                type="button"
                onClick={debounce(
                  () => setRoom({ quantity: room.quantity - 1 }),
                  300,
                )}
                disabled={room.quantity == 0}
              >
                <MinusIcon />
              </Button>
              <p className="text-lg">{room.quantity}</p>
              <Button
                className="w-full"
                title="increment"
                size="sm"
                type="button"
                onClick={debounce(
                  () => setRoom({ quantity: room.quantity + 1 }),
                  300,
                )}
                disabled={room.quantity == maxQuantity}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
          <div className="grid w-[20rem] gap-2 rounded-md border p-2 shadow-md">
            <p className="text-xl text-gray-800">4. Extras (optional)</p>
            <div className="flex items-center gap-4">
              <Button
                className="w-full"
                type="button"
                onClick={() => {
                  setRoom({ extra: !room.extra });
                  const extraDiscount =
                    15 *
                    (room.guests + room.children) *
                    room.nights *
                    room.quantity;
                  if (room.total != 0) {
                    if (!room.extra) {
                      setRoom({ total: room.total - extraDiscount });
                    } else {
                      setRoom({ total: room.total + extraDiscount });
                    }
                  }
                }}
              >
                Breakfast only (15 €)
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
