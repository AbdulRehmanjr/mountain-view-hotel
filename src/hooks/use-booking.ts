import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
    bookingId: string
    setBookingId: (bookingId: string) => void
    clearBookingId: () => void
}


export const useBooking = create<CartState>()(
    persist(
        (set) => ({
            bookingId: 'none',
            setBookingId: (bookingId) => set({ bookingId: bookingId }),
            clearBookingId: () => set({ bookingId: 'none' }),
        }),
        {
            name: 'MOUNTAIN-VIEW-HOTEL-CART',
        }
    )
);
