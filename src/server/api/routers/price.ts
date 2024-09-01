import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";




export const priceRouter = createTRPCRouter({

    getBlockDatesByRoomIdAndQuantity: publicProcedure
        .input(z.object({ roomId: z.string(), quantity: z.number() }))
        .query(async ({ ctx, input }): Promise<{
            startDate: string;
            endDate: string;
        }[]> => {
            try {
                const room = await ctx.db.room.findUnique({
                    where: { roomId: input.roomId },
                    select: { quantity: true }
                });

                if (!room) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: 'Room not found.'
                    });
                }

                const maxQuantity = room.quantity;

                // Fetch existing block dates
                const existingBlockDates = await ctx.db.blockDate.findMany({
                    where: { roomId: input.roomId },
                    select: { startDate: true, endDate: true }
                });

                // Fetch room bookings
                const roomBookings = await ctx.db.roomBooking.findMany({
                    where: { roomId: input.roomId },
                    select: { startDate: true, endDate: true, quantity: true }
                });

                // Process room bookings
                const bookingMap = new Map<string, { startDate: string, endDate: string, quantity: number }>();

                for (const booking of roomBookings) {
                    const key = `${booking.startDate}-${booking.endDate}`;
                    if (bookingMap.has(key)) {
                        bookingMap.get(key)!.quantity += booking.quantity;
                    } else {
                        bookingMap.set(key, { ...booking });
                    }
                }

                // Convert processed bookings back to array and check against max quantity
                const processedBookings = Array.from(bookingMap.values());
                const newBlockDates = processedBookings
                    .filter(booking => maxQuantity - booking.quantity < input.quantity)
                    .map(booking => ({ startDate: booking.startDate, endDate: booking.endDate }));

                // Combine existing block dates with new block dates
                const allBlockDates = [...existingBlockDates, ...newBlockDates];

                return allBlockDates;
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

    getPricesWithRateIdAndRoomId: publicProcedure
        .input(z.object({
            roomId: z.string(),
            rateId: z.string()
        }))
        .query(async ({ ctx, input }): Promise<FilteredPricesProps> => {
            try {
                const roomRatePlans: FilteredPricesProps | null = await ctx.db.roomRatePlan.findFirst({
                    where: {
                        AND: {
                            roomId: input.roomId,
                            rateId: input.rateId
                        }
                    },
                    include: {
                        RoomPrice: {
                            select: {
                                startDate: true,
                                endDate: true,
                                planCode: true,
                                price: true,
                            }
                        }
                    }
                })

                if (!roomRatePlans) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Not found'
                })

                return roomRatePlans
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
})