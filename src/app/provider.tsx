"use client";

import { TRPCReactProvider } from "~/trpc/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      {children}
    </TRPCReactProvider>
  );
}
