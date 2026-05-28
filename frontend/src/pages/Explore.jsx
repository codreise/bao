import React, { useState } from 'react';
import { api } from "@/lib/api";
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SearchBar from '../components/store/SearchBar';
import ProductCard from '../components/store/ProductCard';
import CategoryPill from '../components/store/CategoryPill';
import { useCart } from '../context/CartContext';
import { Compass } from 'lucide-react';

const categories = [
  { key: 'all', label: 'All', icon: '✦' },
  { key: 'clothing', label: 'Clothing', icon: '👕' },
  { key: 'shoes', label: 'Shoes', icon: '👟' },
  { key: 'accessories', label: 'Accessories', icon: '⌚' },
  { key: 'electronics', label: 'Electronics', icon: '📱' },
  { key: 'digital', label: 'Digital', icon: '💿' },
  { key: 'services', label: 'Services', icon: '⚡' },
];

export default function Explore() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addItem } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.entities.Product.list('-created_date', 100),
  });

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCat && p.status !== 'draft';
  });

  return (
    <div className="px-4 pt-4 space-y-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
      >
        <Compass className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold">Explore</h1>
      </motion.div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search marketplace..." />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <CategoryPill
            key={cat.key}
            label={cat.label}
            icon={cat.icon}
            isActive={activeCategory === cat.key}
            onClick={() => setActiveCategory(cat.key)}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addItem} />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No products found in this category
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}