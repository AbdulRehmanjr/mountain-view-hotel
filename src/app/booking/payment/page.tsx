import { PayPalButton } from "~/app/_components/forms/paypal-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";

export default function BookingPaymentPage() {
  return (
    <main className="container col-span-12 mx-auto min-h-[calc(100vh_-_180px)] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-center text-4xl font-bold text-para font-dosis">
        Book now
      </h1>
      <section className="grid h-full place-content-center gap-8 p-4 shadow-lg">
        <Card className="m-3 md:m-0">
          <CardHeader>
            <CardDescription className="font-relaway text-para">
              Secure your payment quickly and easily by clicking the PayPal
              button below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PayPalButton />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
