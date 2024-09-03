import { BookingForm } from "~/app/_components/forms/booking-form";
import { AmountDetail } from "~/app/_components/forms/amount-detail";

export default function BookingPage() {
  return (
    <section className="container col-span-12 mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-center text-4xl font-bold text-primary">
        Booking Details
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="order-2 rounded-lg p-6 shadow-lg md:order-1 lg:col-span-2">
          <h2 className="mb-6 text-2xl font-semibold text-primary">
            Personal Information
          </h2>
          <BookingForm />
        </div>
        <div className="order-1 md:order-2 lg:col-span-1">
          <h2 className="mb-6 text-2xl font-semibold text-primary">
            Booking Summary
          </h2>
          <AmountDetail />
        </div>
      </div>
    </section>
  );
}
