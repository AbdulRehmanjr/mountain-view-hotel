import Link from "next/link";
import Image from "next/image";
import { HeaderInputs } from "~/app/_components/header/header-input";
import { Suspense } from "react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-[1000] col-span-12 flex flex-col gap-2 bg-white p-3 md:flex-row md:items-center">
      <Link href={"https://www.mountainviewhotel-seychelles.com/en/"}>
        <Image src="/logo-10.png" width={120} height={240} alt="Logo Image" />
      </Link>
      <Suspense>
        <HeaderInputs />
      </Suspense>
    </header>
  );
};
