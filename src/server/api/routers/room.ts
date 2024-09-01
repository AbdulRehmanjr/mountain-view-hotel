import { type Prisma } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const roomRouter = createTRPCRouter({

    getRoomsBySellerId: publicProcedure
        .input(z.object({
            adults: z.number().optional(),
            children: z.number().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
        }))
        .query(async ({ ctx, input }) => {
            try {

                const { adults, children, startDate, endDate } = input;

                const whereClause: Prisma.RoomWhereInput = {
                    hotel: {
                        accountId: env.SELLER_ID
                    }
                };

                if (adults !== undefined) {
                    whereClause.capacity = {
                        gte: adults + (children ?? 0)
                    };
                }

                if (startDate && endDate) {
                    whereClause.NOT = {
                        RoomBooking: {
                            some: {
                                OR: [
                                    {
                                        startDate: { lte: endDate },
                                        endDate: { gte: startDate }
                                    },
                                    {
                                        startDate: { gte: startDate, lte: endDate }
                                    }
                                ]
                            }
                        }
                    };
                }

                const rooms: RoomHotelProps[] = await ctx.db.room.findMany({
                    where: whereClause,
                    include: {
                        hotel: {
                            select: {
                                hotelName: true,
                                island: true,
                                address: true,
                                longitude: true,
                                latitude: true
                            }
                        }
                    }
                });

                return rooms;
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    getRoomById: publicProcedure
        .input(z.object({ roomId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {

                const room: RoomHotelProps | null = await ctx.db.room.findUnique({
                    where: { roomId: input.roomId },
                    include: {
                        hotel: {
                            select: {
                                hotelName: true,
                                island: true,
                                address: true,
                                longitude: true,
                                latitude: true
                            }
                        }
                    }
                });

                if (!room) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Room not found.'
                })

                return room;
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                }
                else if (error instanceof TRPCError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: error.code,
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        })

})
