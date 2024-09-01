import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "~/server/api/routers/room";
import { priceRouter } from "~/server/api/routers/price";


export const appRouter = createTRPCRouter({
  room:roomRouter,
  price:priceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
