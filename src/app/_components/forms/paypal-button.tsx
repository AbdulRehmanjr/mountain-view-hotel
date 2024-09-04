"use client";
import { type CreateOrderData } from "@paypal/paypal-js";
import { type OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useBooking } from "~/hooks/use-booking";
import { useCart } from "~/hooks/use-cart";
import { toast } from "~/hooks/use-toast";

export const PayPalButton = () => {
  const router = useRouter();

  const { cart, clearCart } = useCart();
  const { bookingId, total } = useBooking();
  const createOrder = async (_data: CreateOrderData) => {
    try {
      if (total === 0) {
        toast({
          variant: "destructive",
          description: "Invalid order amount",
        });
        return "";
      }
      const response = (
        await axios.post("/api/order", {
          bookingId: bookingId,
          total: total,
        })
      ).data as { id: string };

      return response.id;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: error.message,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          description: (error.response?.data.error as string) ?? "Error",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
      return "";
    }
  };

  const approveOrder = async (data: OnApproveData): Promise<void> => {
    try {
      await axios.post("/api/order/capture", {
        orderId: data.orderID,
        paypalBookingId: bookingId,
        cart: cart.rooms,
      });
      clearCart();
      router.push("/success");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: error.message,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          description: (error.response?.data.error as string) ?? "Error",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelOrder = (_data: any): void => {
    return;
  };

  return (
    <PayPalButtons
      className="my-8"
      disabled={true}
      createOrder={(data, _action) => createOrder(data)}
      onApprove={(data, _actions) => approveOrder(data)}
      onCancel={(data, _action) => cancelOrder(data)}
    />
  );
};
