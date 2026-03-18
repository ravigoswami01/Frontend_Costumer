import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { categories as categoriesData } from '../../utils/data';

export const Categories = () => {
  const [categories, setCategories] = useState<
    { id: string; name: string; icon?: string; itemCount?: number }[]
  >([]);

  useEffect(() => {
    setTimeout(() => {
      setCategories(categoriesData);
    }, 500);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-display font-bold text-dark-900 mb-4">
            Explore Delicious Cuisine by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our mission is to connect foodies with their favorite cuisines. Discover your favorite quick-fix meal or culinary adventure.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-primary-500"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-dark-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  {category.itemCount || 0} Items
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="bg-dark-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-dark-800 transition-colors">
            View All Categories
          </button>
        </motion.div>
      </div>
    </section>
  );
};