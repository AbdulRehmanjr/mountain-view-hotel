import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";

export default function SuccessPage() {
  return (
    <main className="col-span-12 grid min-h-[calc(100vh_-_180px)] place-content-center place-items-center w-full gap-6 p-10">
      <Image
        src="/logo-10.png"
        className="my-8 aspect-video w-[10rem]"
        width={400}
        height={400}
        alt="Logo Image"
      />
      <h1 className="text-center text-2xl md:text-4xl">
        Thank you for your booking!
      </h1>
      <p className="text-center text-lg md:text-2xl">
        The payment was successful and you will receive a confirmation email.
      </p>
      <Button asChild>
        <Link href={"/"}>Go back to website</Link>
      </Button>

      <p>We are looking forward to welcoming you soon!</p>
    </main>
  );
}
