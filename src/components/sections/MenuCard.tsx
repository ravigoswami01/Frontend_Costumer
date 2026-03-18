import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../common/Button';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const StarRating = ({ average, count }: { average: number; count: number }) => {
  const filled = Math.round(average);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= filled ? (
          <Star key={star} className="w-4 h-4 text-primary-500 fill-primary-500" />
        ) : (
          <Star key={star} className="w-4 h-4 text-gray-300 fill-gray-300" />
        )
      )}
      <span className="text-xs text-gray-500 ml-1">({count})</span>
    </div>
  );
};

export const MenuCard = ({ item, index }: MenuCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCartStore();

  const fallbackImage = 'https://placehold.co/300x300?text=No+Image';
  const imageUrl = item.imageUrl?.trim() ? item.imageUrl : fallbackImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageError ? fallbackImage : imageUrl}
          alt={item.name ?? item.description}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        />
        {item.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {item.discount}% OFF
          </div>
        )}
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Popular
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-dark-900 leading-tight">
          {item.name ?? 'Menu Item'}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>

        <div className="mt-2">
          <StarRating average={item.rating.average} count={item.rating.count} />
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-dark-900">
                ₹{item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {item.calories && (
              <p className="text-xs text-gray-400 mt-1">{item.calories} Cal</p>
            )}
          </div>

          <Button
            onClick={() => addItem(item)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};