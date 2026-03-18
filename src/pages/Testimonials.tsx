import React from 'react';
import { motion } from 'framer-motion';
import { Review } from '../types';

const Testimonials: React.FC = () => {
  const reviews: Review[] = [
    {
      id: '1',
      image: 'https://i.pravatar.cc/100?img=1',
      name: 'Sarah Johnson',
      role: 'Food Blogger',
      rating: 5,
      text: 'Absolutely amazing! The burgers are incredible and the delivery was super fast. Highly recommend DelishDrop to anyone who loves great food!',
    },
    {
      id: '2',
      image: 'https://i.pravatar.cc/100?img=2',
      name: 'Michael Chen',
      role: 'Regular Customer',
      rating: 5,
      text: 'Best food delivery service in town! Fresh ingredients, delicious taste, and excellent customer service. They never disappoint!',
    },
    {
      id: '3',
      image: 'https://i.pravatar.cc/100?img=3',
      name: 'Emily Davis',
      role: 'Home Chef',
      rating: 5,
      text: 'The quality is outstanding! Every meal tastes like it came from a 5-star restaurant. My family and I order from here weekly.',
    },
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg">
            Don't just take our word for it - hear from our happy customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg cursor-pointer"
            >
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
              <div className="flex items-center space-x-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
