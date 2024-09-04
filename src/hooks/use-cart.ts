import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartRoomType = {
  hotelId:string
  roomName:string
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
};

type CartType = {
  rooms: CartRoomType[];
};

const initialCartStore: CartType = {
  rooms: [],
};

interface CartState {
  cart: CartType;
  addRoomToCart: (room: CartRoomType) => void;
  removeRoomFromCart: (roomId: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: initialCartStore,
      addRoomToCart: (room) =>
        set((state) => ({
          cart: { rooms: [...state.cart.rooms, room] },
        })),
      removeRoomFromCart: (roomId) =>
        set((state) => ({
          cart: {
            rooms: state.cart.rooms.filter(
              (room) => room.roomId !== roomId
            ),
          },
        })),
      clearCart: () => set({ cart: initialCartStore }),
    }),
    {
      name: 'MOUNTAIN-VIEW-HOTEL-CART',
    }
  )
);
