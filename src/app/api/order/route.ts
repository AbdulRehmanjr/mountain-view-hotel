
import { TRPCClientError } from "@trpc/client";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import axios, { AxiosError } from 'axios'
import { ZodError } from "zod";
import dayjs from "dayjs";

type OrderRequestProps = {
    bookingId: string
    total: number,
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
}

type ItemsProps = {
    name: string,
    unit_amount: {
        currency_code: string,
        value: string,
    },
    quantity: string,
    description: string
    category: 'PHYSICAL_GOODS',
}

export async function POST(req: Request) {
    try {
        const { bookingId, total, rooms } = await req.json() as OrderRequestProps

        const payPalInfo: PayPalInfoProps = await db.sellerPayPal.findUniqueOrThrow({ where: { sellerPayPalId: env.PAYPAL_SELLER } })
        const username = env.PAYPAL_CLIENT
        const password = env.PAYPAL_SECERT
        const BN_CODE = env.BN_CODE
        const base64Credentials: string = Buffer.from(`${username}:${password}`).toString('base64')
        const config = {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': `Basic ${base64Credentials} `,
                'Content-Type': 'application/x-www-form-urlencoded',
                'PayPal-Partner-Attribution-Id': BN_CODE
            }
        }

        const responseType = 'grant_type=client_credentials'
        const tokenResponse = (await axios.post(`${env.PAYPAL_API}/v1/oauth2/token`, responseType, config)).data as { access_token: string }
        const accessToken: string = tokenResponse.access_token
        const paypalApiUrl = `${env.PAYPAL_API}/v2/checkout/orders`
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Partner-Attribution-Id': BN_CODE
        }
        const totalPrice = total;
        const discount = 0;
        const totalPayable = total - discount;
        const platformFee = totalPayable * 0.016;

        const items: ItemsProps[] = []
        rooms.forEach(item => {
            items.push({
                name: item.roomName,
                unit_amount: {
                    currency_code: 'EUR',
                    value: (item.total).toFixed(2),
                },
                quantity: '1',
                description: `Room booking: ${item.roomName} -check in: ${item.startDate} -checkout: ${dayjs(item.endDate).add(1, 'day').format('YYYY-MM-DD')}- quantity:${item.quantity}`,
                category: 'PHYSICAL_GOODS',
            });
        });

        const paymentJson = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: `PMS_${bookingId}`,
                    description: "Mountain view hotel",
                    amount: {
                        currency_code: 'EUR',
                        value: totalPayable.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: "EUR",
                                value: totalPrice.toFixed(2)
                            },
                            discount: {
                                currency_code: "EUR",
                                value: discount.toFixed(2)
                            }
                        }
                    },
                    items: items,
                    payee: {
                        merchant_id: payPalInfo.merchantId
                    },
                    payment_instruction: {
                        disbursement_mode: 'INSTANT',
                        platform_fees: [
                            {
                                amount: {
                                    currency_code: 'EUR',
                                    value: platformFee.toFixed(2),
                                },
                                payee: {
                                    merchant_id: env.PAYPAL_ID
                                },
                            },
                        ],
                    },
                },
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING',
            },
        };
        const response = (await axios.post(paypalApiUrl, paymentJson, { headers })).data as { id: string }
        return NextResponse.json({ id: response.id }, { status: 200 })
    } catch (error) {
        if (error instanceof TRPCClientError) {
            console.error("TRPC ERROR:", error.message)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        else if (error instanceof AxiosError) {
            console.error(error.response?.data)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error("Axios ERROR:", error.response?.data.message)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            return NextResponse.json({ error: error.response?.data.message || 'Axios error occurred' }, { status: 500 })
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