"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useBooking } from "~/hooks/use-booking";
import { useBookingForm } from "~/hooks/use-booking-form";
import { api } from "~/trpc/react";

const formSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zip: z.string().min(3, "Postal code must be at least 3 characters"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  arrivalTime: z.string().optional(),
});

export const BookingForm = () => {
  const router = useRouter();
  const { setBookingId } = useBooking();
  const { setFormData } = useBookingForm();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createBooking = api.room.createBooking.useMutation({
    onSuccess: (bookingId: string) => {
      setBookingId(bookingId);
      router.push("/booking/payment");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setFormData({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      country: values.country,
      city: values.city,
      zip: values.zip,
      phone: values.phone,
      address: values.address,
      arrivalTime: values.arrivalTime ?? "none",
    });
    createBooking.mutate({ email: values.email });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 font-relaway text-para"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    className="border-para placeholder:text-para"
                    placeholder="John"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    className="border-para placeholder:text-para"
                    placeholder="Doe"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="border-para placeholder:text-para"
                  placeholder="example@gmail.com"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    className="border-para placeholder:text-para"
                    placeholder="Country"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    className="border-para placeholder:text-para"
                    placeholder="City"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal code</FormLabel>
                <FormControl>
                  <Input
                    className="border-para placeholder:text-para"
                    placeholder="Postal code"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone no.</FormLabel>
                <FormControl>
                  <Input
                    className="border-para placeholder:text-para"
                    placeholder="Phone"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  className="border-para placeholder:text-para"
                  placeholder="Address"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="arrivalTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrival time (optional)</FormLabel>
              <FormControl>
                <Input
                  className="w-fit border-para placeholder:text-para"
                  type="time"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" disabled={createBooking.isPending}>
            {createBooking.isPending ? "Processing..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
