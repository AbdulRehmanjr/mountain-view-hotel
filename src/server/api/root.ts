import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "~/server/api/routers/room";
import { priceRouter } from "~/server/api/routers/price";
import { emailRouter } from "~/server/api/routers/email";


export const appRouter = createTRPCRouter({
  room:roomRouter,
  price:priceRouter,
  email:emailRouter
});


export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
