"use client";
import Link from "next/link";
import Image from "next/image";
import { HeaderInputs } from "~/app/_components/header/header-input";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export const Header = () => {
  const pathName = usePathname();
  return (
    <header
      className={cn(
        "sticky top-0 z-[1000] col-span-12 flex flex-col gap-2 bg-white p-3 md:flex-row md:items-center md:justify-between",
        pathName == "/success" && "hidden",
      )}
    >
      <Link href={"https://www.mountainviewhotel-seychelles.com/en/"}>
        <Image src="/logo-10.png" width={120} height={240} alt="Logo Image" />
      </Link>
      <Suspense>
        <HeaderInputs />
      </Suspense>
    </header>
  );
};
