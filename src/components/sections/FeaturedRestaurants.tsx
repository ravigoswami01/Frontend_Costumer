import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRestaurantStore } from '../../store/restaurantStore';
import { useAuthStore } from '../../store/authStore';
import { Restaurant } from '../../types';
import { restaurantService } from '../../Api/restaurantService';

export const FeaturedRestaurants = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setSelectedRestaurant } = useRestaurantStore();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeaturedRestaurants();
    }
  }, [isAuthenticated]);

  const loadFeaturedRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getRestaurants();
      setRestaurants(data.slice(0, 6));
    } catch (error) {
      console.error('Failed to load featured restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedRestaurant(restaurant);
    navigate(`/restaurant/${restaurant.id}`);
  };

  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Sign in to explore our featured restaurants.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Restaurants
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover top-rated restaurants delivering exceptional cuisine to your door
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => handleRestaurantClick(restaurant)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold text-gray-900">{restaurant.rating}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                    <span className="flex items-center gap-1">
                      ⏱ {restaurant.deliveryTime} mins
                    </span>
                    <span className="text-blue-600 font-semibold">₹{restaurant.deliveryFee}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.cuisine.slice(0, 2).map((c) => (
                      <span key={c} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {c}
                      </span>
                    ))}
                    {restaurant.cuisine.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        +{restaurant.cuisine.length - 2}
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                    View Menu
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => isAuthenticated ? navigate('/restaurants') : navigate('/login')}
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors inline-block text-lg"
          >
            View All Restaurants
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
