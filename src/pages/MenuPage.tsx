import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MenuCard } from "../components/sections/MenuCard";
import { useMenuStore } from "../store/menuStore";

export const MenuPage = () => {
  const { menuItems, categories, fetchMenu, loading, error } = useMenuStore();

  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // remove duplicate categories
  const uniqueCategories = useMemo(() => {
    return [...new Set(categories)];
  }, [categories]);

  // filter logic
  const filteredItems = useMemo(() => {
    if (selectedCategory === "ALL") return menuItems;

    return menuItems.filter(
      (item) => item.category === selectedCategory
    );
  }, [menuItems, selectedCategory]);

  if (loading) {
    return (
      <div className="pt-24 text-center">
        <p className="text-lg">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-dark-900 mb-4">
            Our Menu
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our wide range of delicious dishes
          </p>
        </motion.div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">

          {uniqueCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-primary-600 text-white"
                  : "bg-white text-dark-900 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}

          {/* View All Button */}
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === "ALL"
                ? "bg-primary-600 text-white"
                : "bg-white text-dark-900 hover:bg-gray-100"
            }`}
          >
            View All Categories
          </button>

        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <MenuCard key={item._id} item={item} index={index} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No items found in this category
            </p>
          </div>
        )}

      </div>
    </div>
  );
};