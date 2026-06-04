import React from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Badge } from '@/components/ui/badge';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
        <p className="text-lg font-bold">Product not found</p>
        <p className="text-sm text-muted-foreground mt-2">
          The item may have been removed or the link is invalid.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  const price = Number(product.price || 0);

  return (
    <div className="min-h-screen">
      <div className="relative aspect-square bg-card">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/50">{product.title?.[0]}</span>
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-background/80 glass-card flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-2xl bg-background/80 glass-card flex items-center justify-center active:scale-90 transition-transform">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-2xl bg-background/80 glass-card flex items-center justify-center active:scale-90 transition-transform">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative -mt-6 bg-background rounded-t-3xl px-5 pt-6 pb-28"
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="text-[10px] font-semibold mb-2">
              {product.category?.replace('_', ' ')}
            </Badge>
            <h1 className="text-xl font-bold leading-tight">{product.title}</h1>
          </div>
          <div className="flex items-center gap-1 bg-card px-2.5 py-1 rounded-xl">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs font-bold">4.8</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {product.description || 'Premium quality product from verified seller. Fast shipping and secure checkout available.'}
        </p>

        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {product.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-card border border-border/50 rounded-lg text-[10px] font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto glass-card bg-background/95 border-t border-border/50 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium">Price</p>
              <p className="text-xl font-bold">${price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => {
                addItem(product);
                navigate('/cart');
              }}
              className="flex-1 max-w-[200px] flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-2xl font-bold text-sm glow-yellow active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
