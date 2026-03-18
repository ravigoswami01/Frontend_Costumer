import React from 'react';
import { motion } from 'framer-motion';

const SpecialOffers: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="offers" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Tasty Meals Offer */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -10 }}
            className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl p-8 md:p-10 relative overflow-hidden cursor-pointer shadow-lg"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full opacity-20 -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold mb-4">
                  🔥 LIMITED TIME
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                Irresistibly Tasty Meals
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                MADE FRESH • SERVED HOT
              </p>
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-5xl font-display font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Up to 40%
                </span>
                <span className="text-2xl text-gray-700">OFF</span>
              </div>
              <button className="px-6 py-3 bg-white text-orange-500 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center space-x-2">
                <span>Order Now</span>
                <i className="fas fa-fire text-orange-500"></i>
              </button>
            </div>
            <div className="mt-6">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop"
                alt="Delicious Food"
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
            </div>
          </motion.div>

          {/* Loaded Beef Burgers */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -10 }}
            className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden cursor-pointer shadow-lg"
          >
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full opacity-10 -ml-20 -mb-20"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-yellow-400 text-orange-900 rounded-full text-sm font-bold mb-4">
                  ⭐ LIMITED TIME OFFER
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">
                LOADED BEEF BURGERS
              </h3>
              <div className="bg-white text-red-500 inline-block rounded-full px-6 py-3 mb-4">
                <span className="text-sm font-semibold">Up to</span>
                <span className="text-4xl font-display font-bold ml-2">30%</span>
              </div>
              <div className="mb-6">
                <span className="inline-block px-6 py-2 bg-yellow-400 text-orange-900 rounded-full text-sm font-bold">
                  SPECIAL DISCOUNT
                </span>
              </div>
              <button className="px-6 py-3 bg-white text-orange-500 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center space-x-2">
                <span>Order Now</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="mt-6">
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=300&fit=crop"
                alt="Beef Burger"
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
            </div>
          </motion.div>

          {/* Super Delicious Pizza */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -10 }}
            className="bg-gradient-to-br from-green-900 to-green-700 rounded-3xl p-8 md:p-10 text-white md:col-span-2 lg:col-span-1 relative overflow-hidden cursor-pointer shadow-lg"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400 rounded-full opacity-10 -mr-24 -mt-24"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-yellow-400 text-green-900 rounded-full text-sm font-bold">
                    ⚡ SUPER OFFER
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  SUPER DELICIOUS PIZZA
                </h3>
                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-5xl font-display font-bold text-yellow-400">
                    Up to 50%
                  </span>
                  <span className="text-2xl">OFF</span>
                </div>
                <button className="px-6 py-3 bg-yellow-400 text-green-900 rounded-full font-semibold hover:bg-yellow-300 transition-all shadow-lg">
                  Order Now
                </button>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop"
                  alt="Delicious Pizza"
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffers;
