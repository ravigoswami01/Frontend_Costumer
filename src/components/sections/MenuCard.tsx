import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus, ShoppingCart } from "lucide-react";
import { MenuItem } from "../../types";
import { useCartStore } from "../../store/cartStore";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const StarRating = ({ average, count }: { average: number; count: number }) => {
  const filled = Math.round(average);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= filled
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">({count})</span>
    </div>
  );
};

export const MenuCard = ({ item, index }: MenuCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCartStore();

  const fallbackImage = "https://placehold.co/300x300?text=No+Image";
  const imageUrl = item.imageUrl?.trim() ? item.imageUrl : fallbackImage;

  const handleAdd = async () => {
    await addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageError ? fallbackImage : imageUrl}
          alt={item.name ?? item.description}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {item.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow">
            {item.discount}% OFF
          </div>
        )}
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow">
            🔥 Popular
          </div>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-4 py-1.5 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-base text-dark-900 leading-snug truncate">
          {item.name ?? "Menu Item"}
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="mt-2">
          <StarRating average={item.rating.average} count={item.rating.count} />
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-dark-900">
                ₹{item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {item.calories && (
              <p className="text-xs text-gray-400 mt-0.5">{item.calories} kcal</p>
            )}
          </div>

          <motion.button
            onClick={handleAdd}
            disabled={!item.isAvailable || added}
            whileTap={{ scale: 0.93 }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              added
                ? "bg-green-500 text-white"
                : item.isAvailable
                ? "bg-primary-600 hover:bg-primary-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {added ? (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};