/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCClientError } from "@trpc/client";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import axios, { AxiosError } from 'axios'
import { ZodError } from "zod";

type OrderRequestProps = {
    bookingId: string
    total: number
}

export async function POST(req: Request) {
    try {
        const { bookingId, total }: OrderRequestProps = await req.json()

        const payPalInfo: PayPalInfoProps = await db.sellerPayPal.findUniqueOrThrow({ where: { sellerPayPalId: env.SELLER_ID } })
        const username = env.PAYPAL_CLIENT
        const password = env.PAYPAL_SECERT
        const BN_CODE = env.BN_CODE
        const base64Credentials: string = Buffer.from(`${username}:${password}`).toString('base64')
        const config = {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'PayPal-Partner-Attribution-Id': BN_CODE
            }
        }

        const responseType = 'grant_type=client_credentials'
        const tokenResponse = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, responseType, config)
        const accessToken: string = tokenResponse.data.access_token
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
    
        const paymentJson = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: bookingId,
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
                    items: {
                        name: 'Buggy Service',
                        unit_amount: {
                            currency_code: 'EUR',
                            value: buggy.price.toFixed(2),
                        },
                        quantity: "1",
                        description: `Buggy rental, Date: ${buggy.date}`,
                        category: 'PHYSICAL_GOODS',
                    },
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
        const response = await axios.post(paypalApiUrl, paymentJson, { headers })
        return NextResponse.json({ id: response.data.id as string }, { status: 200 })
    } catch (error) {
        if (error instanceof TRPCClientError) {
            console.error("TRPC ERROR:", error.message)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        else if (error instanceof AxiosError) {
            console.error(error.response?.data)
            console.error("Axios ERROR:", error.response?.data.message)
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