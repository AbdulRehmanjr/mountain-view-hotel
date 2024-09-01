"use client";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

type RoomInputProps = {
  maxQuantity: number;
  className?: string;
};

export const RoomInput = ({ maxQuantity, className }: RoomInputProps) => {
  const [adults, setAdults] = useState<number>(0);
  const [children, setchildren] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
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
        <div className="flex flex-col md:flex-row gap-3">
          <div className="grid gap-2 rounded-md border p-2 shadow-md">
            <p className="text-xl text-gray-800">1. Occupancy</p>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="grid w-[18.3rem] md:w-[20rem] gap-2 rounded-md border p-2 shadow-md">
                <p className="text-xl text-gray-800">No. of adults</p>
                <div className="flex items-center gap-4">
                  <Button
                    className="w-full"
                    title="decrement"
                    size="sm"
                    type="button"
                    onClick={() => setAdults((prev) => prev - 1)}
                    disabled={adults == 0}
                  >
                    <MinusIcon />
                  </Button>
                  <p className="text-lg">{adults}</p>
                  <Button
                    className="w-full"
                    title="increment"
                    size="sm"
                    type="button"
                    onClick={() => setAdults((prev) => prev + 1)}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>
              <div className="grid w-[18.3rem] md:w-[20rem] gap-2 rounded-md border p-2 shadow-md">
                <p className="text-xl text-gray-800">No. of children</p>
                <div className="flex items-center gap-4">
                  <Button
                    className="w-full"
                    title="decrement"
                    size="sm"
                    type="button"
                    onClick={() => setchildren((prev) => prev - 1)}
                    disabled={children == 0}
                  >
                    <MinusIcon />
                  </Button>
                  <p className="text-lg">{children}</p>
                  <Button
                    className="w-full"
                    title="increment"
                    size="sm"
                    type="button"
                    onClick={() => setchildren((prev) => prev + 1)}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid w-[20rem] gap-2 rounded-md border p-2 shadow-md">
            <p className="text-xl text-gray-800">2. No. of rooms</p>
            <div className="flex items-center gap-4">
              <Button
                className="w-full"
                title="decrement"
                size="sm"
                type="button"
                onClick={() => setQuantity((prev) => prev - 1)}
                disabled={quantity == 0}
              >
                <MinusIcon />
              </Button>
              <p className="text-lg">{quantity}</p>
              <Button
                className="w-full"
                title="increment"
                size="sm"
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                disabled={quantity == maxQuantity}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
          <div className="grid w-[20rem] gap-2 rounded-md border p-2 shadow-md">
            <p className="text-xl text-gray-800">3. Extras (optional)</p>
            <div className="flex items-center gap-4">
              <Button className="w-full" type="button">
                Breakfast only (15 €)
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
