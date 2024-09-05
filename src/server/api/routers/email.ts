
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";
import { createTransport } from "nodemailer";
import path from "path";
import { cwd } from "process";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const emailRouter = createTRPCRouter({

    buyerMail: publicProcedure
        .input(z.object({
            orderId: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            phone: z.string(),
            country: z.string(),
            city: z.string(),
            arrivalTime: z.string(),
            zip: z.string(),
            address: z.string(),
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
        .mutation(async ({ input }) => {
            try {
                const sender = env.ZOHO_EMAIL;
                const password = env.ZOHO_PASSWORD;

                const transporter = createTransport({
                    host: "smtp.zoho.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: sender,
                        pass: password,
                    },
                });

                const pdfFilePath = path.join(cwd(), 'public', 'Cancellation.pdf');
                const attachments = [{
                    filename: 'Cancellation_Policy.pdf',
                    path: pdfFilePath
                }];

                const roomDetails = input.rooms.map(room => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                      <p style="margin: 5px 0;"><strong>Room Name:</strong> ${room.roomName}</p>
                      <p style="margin: 5px 0;"><strong>Guests:</strong> ${room.guests}</p>
                      <p style="margin: 5px 0;"><strong>Children:</strong> ${room.children}</p>
                      <p style="margin: 5px 0;"><strong>Nights:</strong> ${room.nights}</p>
                      <p style="margin: 5px 0;"><strong>Extra Services:</strong> ${room.extra ? 'Yes' : 'No'}</p>
                      <p style="margin: 5px 0;"><strong>Quantity:</strong> ${room.quantity}</p>
                      <p style="margin: 5px 0;"><strong>Total:</strong> €${room.total}</p>
                      <p style="margin: 5px 0;"><strong>Start Date:</strong> ${room.startDate}</p>
                      <p style="margin: 5px 0;"><strong>End Date:</strong> ${room.endDate}</p>
                    </td>
                  </tr>
                `).join('');

                const emailContent = `
                  <html>
                    <head>
                      <style>
                        body, table, td, p, a, li, blockquote {
                          -webkit-text-size-adjust: 100%;
                          -ms-text-size-adjust: 100%;
                        }
                        table, td {
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                        }
                        img {
                          -ms-interpolation-mode: bicubic;
                        }
                        body {
                          margin: 0;
                          padding: 0;
                        }
                        img {
                          border: 0;
                          height: auto;
                          line-height: 100%;
                          outline: none;
                          text-decoration: none;
                        }
                        table {
                          border-collapse: collapse !important;
                        }
                        body {
                          font-family: Arial, sans-serif;
                          height: 100% !important;
                          margin: 0 !important;
                          padding: 0 !important;
                          width: 100% !important;
                        }
                      </style>
                    </head>
                    <body style="margin: 0; padding: 0;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="padding: 20px 0 30px 0;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
                              <tr>
                                <td align="center" bgcolor="#f3f4f6" style="padding: 40px 0 30px 0;">
                                  <img src="https://res.cloudinary.com/dbjiys9se/image/upload/v1725497516/kolibristay/logo-10_tcwmpn.png" alt="Mountain View Hotel" width="100" style="display: block;" />
                                </td>
                              </tr>
                              <tr>
                                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                    <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif;">
                                        <h1 style="font-size: 24px; margin: 0;">Booking Confirmation</h1>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
                                        <p style="margin: 0;">Dear ${input.firstName.trim()},</p>
                                        <p>Thank you for your booking. We are happy to host you for your stay on La Digue:</p>
                                        <p><strong>Your confirmation number is:</strong> ${input.orderId}</p>
                                        <p style="font-size:18px; font-weight: bold;">Your room booking details are below:</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                          ${roomDetails}
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
                                        <p><strong>Total amount:</strong> €${input.rooms.reduce((sum, room) => sum + room.total, 0)}</p>
                                        <p><strong>Arrival time:</strong> ${input.arrivalTime}</p>
                                        <p><strong>Check-in:</strong> 12 pm</p>
                                        <p><strong>Check-out:</strong> 10 am</p>
                                        <p>Please feel free to reach out to us if you need to cancel or reschedule your booking. Cancellation policy is attached below.</p>
                                        <p>We are looking forward to seeing you soon.</p>
                                        <p>Best regards,</p>
                                        <h2>Team of Hotel Mountain View</h2>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td bgcolor="#f3f4f6" style="padding: 30px 30px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                    <tr>
                                      <td style="color: #000000; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
                                        <img src="https://res.cloudinary.com/dbjiys9se/image/upload/v1725497516/kolibristay/logo-10_tcwmpn.png" alt="Mountain View" width="100" style="display: block; margin: 0 auto 10px auto;" />
                                        <p style="margin: 0;">Hotel Mountain View</p>
                                        <p style="margin: 0;">Grand Anse, La Digue</p>
                                        <p style="margin: 0;">Seychelles</p>
                                        <p style="margin: 0;">hotelmountainview7@gmail.com</p>
                                        <p style="margin: 0;">+248 2 59 00 73</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </body>
                  </html>
                `;

                const email = {
                    from: `${sender}`,
                    to: `${input.email}`,
                    subject: "Hotel Mountain View Booking Confirmation",
                    html: emailContent,
                    attachments: attachments
                };

                await transporter.sendMail(email);

            } catch (error) {
                console.log(error);
                throw new Error(error instanceof TRPCClientError ? error.message : "Error sending email");
            }
        }),

    sellerMail: publicProcedure
        .input(z.object({
            orderId: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
            phone: z.string(),
            country: z.string(),
            city: z.string(),
            arrivalTime: z.string(),
            zip: z.string(),
            address: z.string(),
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
        .mutation(async ({ input }) => {
            try {
                const sender = env.ZOHO_EMAIL;
                const password = env.ZOHO_PASSWORD;
                const sellerEmail = env.ZOHO_SELLER;

                const transporter = createTransport({
                    host: "smtp.zoho.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: sender,
                        pass: password,
                    },
                });

                const roomDetails = input.rooms.map(room => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                      <p style="margin: 5px 0;"><strong>Room Name:</strong> ${room.roomName}</p>
                      <p style="margin: 5px 0;"><strong>Guests:</strong> ${room.guests}</p>
                      <p style="margin: 5px 0;"><strong>Children:</strong> ${room.children}</p>
                      <p style="margin: 5px 0;"><strong>Nights:</strong> ${room.nights}</p>
                      <p style="margin: 5px 0;"><strong>Extra Services:</strong> ${room.extra ? 'Yes' : 'No'}</p>
                      <p style="margin: 5px 0;"><strong>Quantity:</strong> ${room.quantity}</p>
                      <p style="margin: 5px 0;"><strong>Total:</strong> €${room.total}</p>
                      <p style="margin: 5px 0;"><strong>Start Date:</strong> ${room.startDate}</p>
                      <p style="margin: 5px 0;"><strong>End Date:</strong> ${room.endDate}</p>
                    </td>
                  </tr>
                `).join('');

                const emailContent = `
                  <html>
                    <head>
                      <style>
                        body, table, td, p, a, li, blockquote {
                          -webkit-text-size-adjust: 100%;
                          -ms-text-size-adjust: 100%;
                        }
                        table, td {
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                        }
                        img {
                          -ms-interpolation-mode: bicubic;
                        }
                        body {
                          margin: 0;
                          padding: 0;
                        }
                        img {
                          border: 0;
                          height: auto;
                          line-height: 100%;
                          outline: none;
                          text-decoration: none;
                        }
                        table {
                          border-collapse: collapse !important;
                        }
                        body {
                          font-family: Arial, sans-serif;
                          height: 100% !important;
                          margin: 0 !important;
                          padding: 0 !important;
                          width: 100% !important;
                        }
                      </style>
                    </head>
                    <body style="margin: 0; padding: 0;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="padding: 20px 0 30px 0;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
                              <tr>
                                <td align="center" bgcolor="#f3f4f6" style="padding: 40px 0 30px 0;">
                                  <img src="https://res.cloudinary.com/dbjiys9se/image/upload/v1725497516/kolibristay/logo-10_tcwmpn.png" alt="Mountain View Hotel" width="100" style="display: block;" />
                                </td>
                              </tr>
                              <tr>
                                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                    <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif;">
                                        <h1 style="font-size: 24px; margin: 0;">New Booking Received</h1>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
                                        <p style="margin: 0;">Dear Hotel Mountain View,</p>
                                        <p>You have received a new booking with the following details:</p>
                                        <p><strong>Order ID:</strong> ${input.orderId}</p>
                                        <p><strong>Customer Name:</strong> ${input.firstName} ${input.lastName}</p>
                                        <p><strong>Email:</strong> ${input.email}</p>
                                        <p><strong>Phone:</strong> ${input.phone}</p>
                                        <p><strong>Address:</strong> ${input.address}, ${input.city}, ${input.country}, ${input.zip}</p>
                                        <p><strong>Arrival time:</strong> ${input.arrivalTime}</p>
                                        <p style="font-size:18px; font-weight: bold;">Room booking details:</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                          ${roomDetails}
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
                                        <p><strong>Total amount:</strong> €${input.rooms.reduce((sum, room) => sum + room.total, 0)}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td bgcolor="#f3f4f6" style="padding: 30px 30px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                    <tr>
                                      <td style="color: #000000; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
                                        <img src="https://res.cloudinary.com/dbjiys9se/image/upload/v1725497516/kolibristay/logo-10_tcwmpn.png" alt="Mountain View" width="100" style="display: block; margin: 0 auto 10px auto;" />
                                        <p style="margin: 0;">Hotel Mountain View</p>
                                        <p style="margin: 0;">Grand Anse, La Digue</p>
                                        <p style="margin: 0;">Seychelles</p>
                                        <p style="margin: 0;">hotelmountainview7@gmail.com</p>
                                        <p style="margin: 0;">+248 2 59 00 73</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </body>
                  </html>
                `;

                const email = {
                    from: `${sender}`,
                    to: sellerEmail,
                    subject: "New Booking Received - Hotel Mountain View",
                    html: emailContent,
                };

                const pamEmail = {
                    from: `${sender}`,
                    to: 'pamina.z@aon.at',
                    subject: "New Booking Received - Hotel Mountain View",
                    html: emailContent,
                };

                await transporter.sendMail(email);
                await transporter.sendMail(pamEmail);

            } catch (error) {
                console.log(error);
                throw new Error(error instanceof TRPCClientError ? error.message : "Error sending email");
            }
        })


})