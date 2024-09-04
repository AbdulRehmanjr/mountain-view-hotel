"use client";

import { TRPCReactProvider } from "~/trpc/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { env } from "~/env";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <PayPalScriptProvider
        options={{
          currency: "EUR",
          clientId: env.NEXT_PUBLIC_PAYPAL,
          disableFunding: ["paylater"],
        }}
      >
        {children}
      </PayPalScriptProvider>
    </TRPCReactProvider>
  );
}
