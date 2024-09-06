import { BookingForm } from "~/app/_components/forms/booking-form";
import { AmountDetail } from "~/app/_components/forms/amount-detail";

export default function BookingPage() {
  return (
    <main className="container col-span-12 mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-[calc(100vh_-_180px)]">
      <h1 className="mb-12 text-center text-4xl font-bold text-para font-dosis">
        Booking details
      </h1>
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="order-2 rounded-lg p-6 shadow-lg md:order-1 lg:col-span-2 h-fit">
          <h2 className="mb-6 text-2xl font-semibold text-para font-dosis">
            Personal information
          </h2>
          <BookingForm />
        </div>
        <div className="order-1 md:order-2 lg:col-span-1">
          <h2 className="mb-6 text-2xl font-semibold text-para font-dosis">
            Booking summary
          </h2>
          <AmountDetail />
        </div>
      </section>
    </main>
  );
}
