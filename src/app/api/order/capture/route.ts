
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { env } from "~/env";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

type OrderRequestProps = {
    orderId: string
    bookingId: string
    rooms: {
        hotelId: string
        roomName: string
        roomId: string;
        rateId: string;
        guests: number;
        children: number;
        nights: number;
        extra: boolean;
        quantity: number;
        total: number;
        startDate: string;
        endDate: string;
    }[]
    form: FormDataProps
}

type FormDataProps = {
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    city: string,
    zip: string,
    phone: string,
    address: string,
    arrivalTime: string
}

export async function POST(req: Request) {
    try {
        const { orderId, bookingId, rooms, form } = await req.json() as OrderRequestProps
        const username = env.PAYPAL_CLIENT
        const password = env.PAYPAL_SECERT
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
        const config = {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Paypal-Partner-Attribution-Id': env.BN_CODE
            },
        };
        const responseType = 'grant_type=client_credentials';
        const tokenResponse = (await axios.post(`${env.PAYPAL_API}/v1/oauth2/token`, responseType, config)).data as { access_token: string }
        const accessToken: string = tokenResponse.access_token
        const paypalApiUrl = `${env.PAYPAL_API}/v2/checkout/orders/${orderId}/capture`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Paypal-Partner-Attribution-Id': env.BN_CODE
        }
        const response = await axios.post(paypalApiUrl, {}, { headers })
        const bookingInfo: BookingInfoProps = await db.bookingDetail.create({
            data: {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                country: form.country,
                city: form.city,
                arrivalTime: form.arrivalTime,
                zip: form.zip,
                address: form.address,
            }
        })

        for (const roomData of rooms) {
            const room = await db.room.findUnique({
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
            const rate = await db.ratePlan.findUnique({ where: { ratePlanId: roomData.rateId } })
            if (!rate) throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Rate plans not found'
            })
            await processRoomBooking(roomData.startDate, dayjs(roomData.endDate).subtract(1, 'day').format('YYYY-MM-DD'), room.quantity, roomData.quantity, rate.code, roomData.roomId, room.code, room.hotel.code)
            await db.roomBooking.create({
                data: {
                    startDate: roomData.startDate,
                    endDate: dayjs(roomData.endDate).subtract(1, 'day').format('YYYY-MM-DD'),
                    price: roomData.total,
                    type: "website",
                    quantity: roomData.quantity,
                    mealType: roomData.extra ? 'Break fast only' : 'Half-board',
                    extras: [''],
                    roomId: roomData.roomId,
                    bookingDetailId: bookingInfo.bookingDetailId,
                    payPalBookingId: bookingId
                }
            })
        }

        const emailObject = {
            orderId: orderId,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            country: form.country,
            city: form.city,
            arrivalTime: form.arrivalTime,
            zip: form.zip,
            address: form.address,
            rooms: rooms
        }
        
        await Promise.all([
            api.email.buyerMail(emailObject),
            api.email.sellerMail(emailObject)
        ])

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return NextResponse.json({ order: response.data }, { status: 200 })
    } catch (error) {
        if (error instanceof TRPCClientError) {
            console.error("TRPC Client ERROR:", error.message)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        else if (error instanceof TRPCError) {
            console.log('TRPC Error:', error.message)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        else if (error instanceof AxiosError) {
            console.error(error.response?.data)
            const err = error.response?.data as { message: string }
            console.error("Axios ERROR:", err.message)
            return NextResponse.json({ error: err.message || 'Axios error occurred' }, { status: 500 })
        }
        else if (error instanceof ZodError) {
            console.error("ZOD:", error.message)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        else if (error instanceof Error) {
            console.error("Error:", error.message)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
        else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
        }
    }

}

async function processRoomBooking(
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