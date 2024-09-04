import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
interface FormState {
    formData: FormDataProps
    setFormData: (formData: Partial<FormDataProps>) => void
    clearFormData: () => void
}

const initalValue = {
    firstName: 'none',
    lastName: 'none',
    email: 'none',
    country: 'none',
    city: 'none',
    zip: 'none',
    phone: 'none',
    address: 'none',
    arrivalTime: 'none'
}

export const useBookingForm = create<FormState>()(
    persist(
        (set) => ({
            formData: { ...initalValue },
            setFormData: (formData) => set((state) => ({ formData: { ...state.formData, ...formData } })),
            clearFormData: () => set({ formData: initalValue }),
        }),
        {
            name: 'MOUNTAIN-VIEW-HOTEL-FORM',
        }
    )
);
