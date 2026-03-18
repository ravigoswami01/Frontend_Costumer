import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { menuItems } from '../../utils/data';
import { Button } from '../common/Button';
import { useCartStore } from '../../store/cartStore';

export const Deals = () => {
  const { addItem } = useCartStore();
  const dealItems = menuItems.filter(item => item.discount && item.discount > 0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-4xl font-display font-bold text-dark-900 mb-2">
              Flash Deals: Ending Soon!
            </h2>
            <p className="text-gray-600">Limited time offers you don't want to miss</p>
          </div>
          <div className="flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">Hot Deals</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-red-100"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  -{item.discount}%
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl text-dark-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-red-600">${item.price.toFixed(2)}</span>
                      <span className="text-lg text-gray-500 line-through">${item.originalPrice?.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Save ${((item.originalPrice || 0) - item.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => addItem(item)} className="flex-1">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
