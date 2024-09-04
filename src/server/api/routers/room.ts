import { type PrismaClient, type Prisma } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios, { AxiosError } from 'axios'
import { type DefaultArgs } from "@prisma/client/runtime/library";

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
        }),

    getRoomRateByRoomId: publicProcedure
        .input(z.object({ roomId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {

                const ratePlan = await ctx.db.ratePlan.findMany({
                    where: {
                        hotel: {
                            Room: {
                                some: {
                                    roomId: input.roomId
                                }
                            }
                        }
                    }
                });

                if (!ratePlan) throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Room not found.'
                })

                return ratePlan;
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
        }),

    createBooking: publicProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            phone: z.string(),
            country: z.string(),
            city: z.string(),
            zip: z.string(),
            address: z.string(),
            arrivalTime: z.string(),
            type: z.string(),
            rooms: z.array(z.object({
                hotelId: z.string(),
                roomName: z.string(),
                roomId: z.string(),
                rateId: z.string(),
                guests: z.number(),
                children: z.number(),
                nights: z.number(),
                extra: z.boolean(),
                quantity: z.number(),
                total: z.number(),
                startDate: z.string(),
                endDate: z.string(),
            }))
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                const bookingInfo: BookingInfoProps = await ctx.db.bookingDetail.create({
                    data: {
                        firstName: input.firstName,
                        lastName: input.lastName,
                        email: input.email,
                        phone: input.phone,
                        country: input.country,
                        city: input.city,
                        arrivalTime: input.arrivalTime,
                        zip: input.zip,
                        address: input.address,
                    }
                })

                let total = 0
                for (const roomData of input.rooms) {
                    const room = await ctx.db.room.findUnique({
                        where: { roomId: roomData.roomId },
                        select: {
                            hotelId: true,
                            code: true,
                            quantity: true,
                            hotel: {
                                select: {
                                    code: true
                                }
                            }
                        }
                    })

                    if (!room) throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Room not found'
                    })
                    const rate = await ctx.db.ratePlan.findUnique({ where: { ratePlanId: roomData.rateId } })

                    if (!rate) throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Rate plans not found'
                    })
                    total += roomData.total
                    await processRoomBooking(ctx.db, roomData.startDate, dayjs(roomData.endDate).subtract(1, 'day').format('YYYY-MM-DD'), room.quantity, roomData.quantity, rate.code, roomData.roomId, room.code, room.hotel.code)
                    await ctx.db.roomBooking.create({
                        data: {
                            startDate: roomData.startDate,
                            endDate: dayjs(roomData.endDate).subtract(1, 'day').format('YYYY-MM-DD'),
                            price: roomData.total,
                            type: input.type,
                            quantity: roomData.quantity,
                            mealType: roomData.extra ? 'Break fast only' : 'Half-board',
                            extras: [''],
                            roomId: roomData.roomId,
                            bookingDetailId: bookingInfo.bookingDetailId,
                        }
                    })
                }
                return { bookingId: bookingInfo.bookingDetailId, total: total }
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message);
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    });
                } else if (error instanceof AxiosError) {
                    const suError = error.response?.data as SUErrorProps;
                    console.error(suError);
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: suError.Errors[0]?.ShortText
                    });
                }
                console.error(error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Something went wrong"
                });
            }
        }),
})


async function processRoomBooking(
    db: PrismaClient<{
        log: ("query" | "warn" | "error")[];
    }, never, DefaultArgs>,
    arrivalDate: string,
    departureDate: string,
    roomQuantity: number,
    bookedQuantity: number,
    ratePlan: string,
    roomId: string,
    roomCode: string,
    hotelCode: string
) {
    const roomBookings = await db.roomBooking.findMany({
        where: {
            Room: { roomId: roomId },
            AND: [
                { startDate: { gte: arrivalDate } },
                { endDate: { lte: departureDate } }
            ]
        },
        select: { startDate: true, endDate: true }
    });

    console.log(roomBookings)
    const bookingMap = new Map<string, number>();
    const getDatesInRange = (start: string, end: string): string[] => {
        const dates: string[] = [];
        let currentDate = dayjs(start);
        const endDate = dayjs(end);
        while (currentDate.isBefore(endDate, 'day') || currentDate.isSame(endDate, 'day')) {
            dates.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }
        return dates;
    };

    roomBookings.forEach(booking => {
        getDatesInRange(booking.startDate, booking.endDate).forEach(date => {
            bookingMap.set(date, (bookingMap.get(date) ?? 0) + 1);
        });
    });

    const bookingDates = getDatesInRange(arrivalDate, departureDate);
    const minAvailableRooms = Math.min(
        ...bookingDates.map(date => roomQuantity - (bookingMap.get(date) ?? 0) - bookedQuantity)
    );

    console.log(minAvailableRooms)
    const rateJson = {
        hotelid: hotelCode,
        room: [{
            roomid: roomCode,
            date: [{
                from: arrivalDate,
                to: departureDate,
                rate: [{
                    rateplanid: ratePlan
                }],
                roomstosell: Math.max(0, minAvailableRooms),
                closed: "0",
            }]
        }]
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${env.API_KEY}`,
        'app-id': env.APP_ID
    };

    await axios.post(`${env.API_SU}/availability`, rateJson, { headers });
}