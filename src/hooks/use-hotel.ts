import { type Dayjs } from 'dayjs';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RoomType = {
    guests: number;
    children: number;
    nights: number;
    rooms: number;
    extra: boolean;
    quantity: number;
    total: number;
};

type DateRangeType = {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
};

type BookingType = {
    room: RoomType;
    dateRange: DateRangeType;
};

const initialStore: BookingType = {
    room: {
        guests: 0,
        children: 0,
        nights: 0,
        rooms: 0,
        extra: false,
        quantity: 0,
        total: 0,
    },
    dateRange: {
        startDate:  null,
        endDate:  null
    }
};


interface HotelState {
  room: RoomType
  dateRange: DateRangeType
  setRoom: (room: Partial<RoomType>) => void
  setDateRange: (dateRange: Partial<DateRangeType>) => void
  resetStore: () => void
}

export const useHotel = create<HotelState>()(
  persist(
    (set) => ({
      ...initialStore,
      setRoom: (room) => set((state) => ({ room: { ...state.room, ...room } })),
      setDateRange: (dateRange) => set((state) => ({ dateRange: { ...state.dateRange, ...dateRange } })),
      resetStore: () => set(initialStore),
    }),
    {
      name: 'MOUNTAIN-VIEW-HOTEL',
    }
  )
)


