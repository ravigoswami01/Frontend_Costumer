import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Mail, Phone, CheckCircle, XCircle, Clock as Pending } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { format } from 'date-fns';

export const BookingsPage = () => {
  const { user } = useAuthStore();
  const { bookings, updateBookingStatus } = useBookingStore();
  const userBookings = bookings.filter(b => b.userId === user?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Pending className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-display font-bold text-dark-900 mb-8">
            My Bookings
          </h1>

          {userBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Calendar className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-dark-900 mb-2">No Bookings Yet</h2>
              <p className="text-gray-600">You haven't made any table reservations yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {userBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-dark-900">
                            Table Reservation
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-2">{booking.status}</span>
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">Booking ID: {booking.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold">{format(new Date(booking.date), 'MMMM dd, yyyy')}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-gray-700">
                          <Clock className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-semibold">{booking.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-gray-700">
                          <Users className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-xs text-gray-500">Guests</p>
                            <p className="font-semibold">{booking.guests} People</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Mail className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-semibold text-sm">{booking.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-gray-700">
                          <Phone className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-semibold">{booking.phone}</p>
                          </div>
                        </div>

                        {booking.specialRequests && (
                          <div className="pt-2">
                            <p className="text-xs text-gray-500 mb-1">Special Requests</p>
                            <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
