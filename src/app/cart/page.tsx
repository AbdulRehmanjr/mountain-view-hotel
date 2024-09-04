import { CartDetail } from "~/app/_components/cart/cart-detail";

export default function BookingPage() {
  return (
    <main className="container col-span-12 mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh_-_180px)]">
      <h1 className="mb-12 text-center text-4xl font-bold text-primary">
        Cart details
      </h1>
      <CartDetail />
    </main>
  );
}
