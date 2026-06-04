import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SearchBar from '../components/store/SearchBar';
import ProductCard from '../components/store/ProductCard';
import CategoryPill from '../components/store/CategoryPill';
import SectionHeader from '../components/store/SectionHeader';
import FeaturedBanner from '../components/store/FeaturedBanner';
import { api } from '@/lib/api';
import { useCart } from '../context/CartContext';

const categories = [
  { key: 'all', label: 'All', icon: '✦' },
  { key: 'clothing', label: 'Clothing', icon: '👕' },
  { key: 'shoes', label: 'Shoes', icon: '👟' },
  { key: 'accessories', label: 'Accessories', icon: '⌚' },
  { key: 'electronics', label: 'Electronics', icon: '📱' },
  { key: 'digital', label: 'Digital', icon: '💿' },
  { key: 'services', label: 'Services', icon: '⚡' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addItem } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products'),
  });

  const filtered = products.filter((product) => {
    const title = product.title || '';
    const matchSearch = !search || title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || product.category === activeCategory;
    return matchSearch && matchCat && product.status !== 'draft';
  });

  const featured = products.filter((product) => product.status === 'active').slice(0, 6);

  return (
    <div className="px-4 pt-4 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-sm font-black text-primary-foreground">B</span>
          </div>
          <span className="text-lg font-bold tracking-tight">bao</span>
        </div>

        <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center">
          <span className="text-xs font-bold text-background">U</span>
        </div>
      </motion.div>

      <SearchBar value={search} onChange={setSearch} />
      <FeaturedBanner />

      <div>
        <SectionHeader title="Categories" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((category) => (
            <CategoryPill
              key={category.key}
              label={category.label}
              icon={category.icon}
              isActive={activeCategory === category.key}
              onClick={() => setActiveCategory(category.key)}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Featured Products" linkTo="/explore" />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {(search || activeCategory !== 'all' ? filtered : featured).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addItem} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No products found
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}
