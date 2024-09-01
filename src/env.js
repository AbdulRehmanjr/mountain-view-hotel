import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PAYPAL_ID: z.string(),
    PAYPAL_CLIENT: z.string(),
    PAYPAL_SECERT: z.string(),
    PAYPAL_API: z.string(),
    BN_CODE: z.string(),
    SELLER_ID: z.string(),
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    PAYPAL_ID: process.env.PAYPAL_ID,
    PAYPAL_CLIENT: process.env.PAYPAL_CLIENT,
    PAYPAL_SECERT: process.env.PAYPAL_SECERT,
    PAYPAL_API: process.env.PAYPAL_API,
    BN_CODE: process.env.BN_CODE,
    SELLER_ID: process.env.SELLER_ID,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
