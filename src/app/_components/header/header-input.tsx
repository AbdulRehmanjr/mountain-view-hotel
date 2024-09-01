"use client";
import {
  PersonIcon,
  MinusIcon,
  PlusIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import dayjs from "dayjs";
import { Calendar } from "~/components/ui/calendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HeaderData } from "~/app/_components/header/header-data";

export const HeaderInputs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const [searchFilter, setSearchFilter] = useState<{
    adults: number;
    children: number;
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
  }>({
    adults: 0,
    children: 0,
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const applyFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (searchFilter.adults > 0) {
      newSearchParams.set("adults", searchFilter.adults.toString());
    } else {
      newSearchParams.delete("adults");
    }

    if (searchFilter.children > 0) {
      newSearchParams.set("children", searchFilter.children.toString());
    } else {
      newSearchParams.delete("children");
    }

    if (searchFilter.dateRange.from && searchFilter.dateRange.to) {
      newSearchParams.set(
        "startDate",
        dayjs(searchFilter.dateRange.from).format("DD-MM-YYYY"),
      );
      newSearchParams.set(
        "endDate",
        dayjs(searchFilter.dateRange.to).format("DD-MM-YYYY"),
      );
    } else {
      newSearchParams.delete("startDate");
      newSearchParams.delete("endDate");
    }

    router.push(`?${newSearchParams.toString()}`);
  };

  const clearFilter = () => {
    setSearchFilter((prev) => ({ ...prev, adults: 0, children: 0 }));
    router.push(`/`);
  };

  const ButtonTemplate = () => (
    <div className="flex items-center justify-center gap-2">
      <Button variant={"outline"} type="button" onClick={clearFilter}>
        Clear
      </Button>
      <Button type="button" onClick={applyFilter}>
        Apply
      </Button>
    </div>
  );

  return (
    <>
      {pathName != "/" ? (
        <HeaderData />
      ) : (
        <div className="flex w-full place-content-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"} className="flex h-fit w-fit gap-2">
                <PersonIcon className="h-4 w-4" />
                <p className="flex flex-col items-start gap-1">
                  <span className="text-xs">Guest</span>
                  <span className="text-sm">
                    {" "}
                    {searchFilter.adults} Adults, {searchFilter.children}{" "}
                    Children
                  </span>
                </p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select number of people</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-4 border-b-2 p-2">
                  <p className="text-base text-gray-800">Adults</p>
                  <div className="flex items-center gap-4">
                    <Button
                      className="rounded-full border-2 p-2"
                      title="decrement"
                      type="button"
                      onClick={() =>
                        setSearchFilter((prev) => ({
                          ...prev,
                          adults: searchFilter.adults - 1,
                        }))
                      }
                      disabled={searchFilter.adults == 0}
                    >
                      <MinusIcon />
                    </Button>
                    <p className="text-lg">{searchFilter.adults}</p>
                    <Button
                      className="rounded-full border-2 p-2"
                      title="increment"
                      type="button"
                      onClick={() =>
                        setSearchFilter((prev) => ({
                          ...prev,
                          adults: searchFilter.adults + 1,
                        }))
                      }
                      disabled={searchFilter.adults == 5}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-b-2 p-2">
                  <p className="text-base text-gray-800">0-3 years</p>
                  <div className="flex items-center gap-4">
                    <Button
                      className="rounded-full border-2 p-2"
                      title="decrement"
                      type="button"
                      onClick={() =>
                        setSearchFilter((prev) => ({
                          ...prev,
                          children: searchFilter.children - 1,
                        }))
                      }
                      disabled={searchFilter.children == 0}
                    >
                      <MinusIcon />
                    </Button>
                    <p className="text-lg">{searchFilter.children}</p>
                    <Button
                      className="rounded-full border-2 p-2"
                      title="increment"
                      type="button"
                      onClick={() =>
                        setSearchFilter((prev) => ({
                          ...prev,
                          children: searchFilter.children + 1,
                        }))
                      }
                      disabled={searchFilter.children == 5}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                </div>
                <ButtonTemplate />
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                className="flex h-fit min-w-[200px] gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <p className="flex flex-col items-start gap-1">
                  <span className="text-xs">Time period</span>
                  <span className="text-sm">
                    {" "}
                    {searchFilter.dateRange.from ? (
                      `${dayjs(searchFilter.dateRange.from).format("DD-MM-YYYY")} - ${dayjs(searchFilter.dateRange.to).format("DD-MM-YYYY")}`
                    ) : (
                      <span className="text-sm">DD-MM-YYYY - DD-MM-YYYY</span>
                    )}
                  </span>
                </p>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-fit">
              <DialogHeader>
                <DialogTitle>Select the date range</DialogTitle>{" "}
              </DialogHeader>
              <Calendar
                className="w-fit"
                mode="range"
                selected={searchFilter.dateRange}
                onSelect={(date) =>
                  setSearchFilter((prev) => ({
                    ...prev,
                    dateRange: { from: date?.from, to: date?.to },
                  }))
                }
                disabled={(date) => date < new Date()}
                initialFocus
              />
              <ButtonTemplate />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
