import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookingState {
    bookingId: string
    total: number
    setTotal: (total: number) => void
    setBookingId: (bookingId: string) => void
    clearBooking: () => void
}


export const useBooking = create<BookingState>()(
    persist(
        (set) => ({
            bookingId: 'none',
            total: 0,
            setTotal: (total) => set({ total: total }),
            setBookingId: (bookingId) => set({ bookingId: bookingId }),
            clearBooking: () => set({ bookingId: 'none', total: 0 }),
        }),
        {
            name: 'MOUNTAIN-VIEW-HOTEL-CART',
        }
    )
);
