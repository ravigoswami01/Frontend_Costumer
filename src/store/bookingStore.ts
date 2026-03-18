import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking } from '../types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getBookingsByUser: (userId: string) => Booking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (booking) => {
        const newBooking: Booking = {
          ...booking,
          id: Date.now().toString(),
          status: 'pending',
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map(booking =>
            booking.id === id ? { ...booking, status } : booking
          ),
        }));
      },

      getBookingsByUser: (userId) => {
        return get().bookings.filter(booking => booking.userId === userId);
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);
