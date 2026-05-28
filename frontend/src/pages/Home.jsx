import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SearchBar from '../components/store/SearchBar';
import ProductCard from '../components/store/ProductCard';
import CategoryPill from '../components/store/CategoryPill';
import SectionHeader from '../components/store/SectionHeader';
import FeaturedBanner from '../components/store/FeaturedBanner';

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

  // TEMP MOCK DATA
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return [
        {
          id: 1,
          title: 'Cyber Sneakers',
          category: 'shoes',
          status: 'active',
          price: 120,
          image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        },
        {
          id: 2,
          title: 'Neon Hoodie',
          category: 'clothing',
          status: 'active',
          price: 89,
          image:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        },
      ];
    },
  });

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase());

    const matchCat =
      activeCategory === 'all' ||
      p.category === activeCategory;

    return matchSearch && matchCat && p.status !== 'draft';
  });

  const featured = products
    .filter((p) => p.status === 'active')
    .slice(0, 6);

  return (
    <div className="px-4 pt-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-sm font-black text-primary-foreground">
                B
              </span>
            </div>

            <span className="text-lg font-bold tracking-tight">
              bao
            </span>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center">
          <span className="text-xs font-bold text-background">
            U
          </span>
        </div>
      </motion.div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Banner */}
      <FeaturedBanner />

      {/* Categories */}
      <div>
        <SectionHeader title="Categories" />

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
      </div>

      {/* Products */}
      <div>
        <SectionHeader
          title="Featured Products"
          linkTo="/explore"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl aspect-[3/4] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {(search || activeCategory !== 'all'
              ? filtered
              : featured
            ).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
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