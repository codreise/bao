import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden transition-all hover:glow-yellow-sm">
          <div className="aspect-square bg-secondary/50 relative overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary/60">
                    {product.title?.[0]?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="text-xs font-medium text-muted-foreground truncate">
              {product.category?.replace('_', ' ')}
            </p>
            <h3 className="text-sm font-semibold mt-0.5 truncate">{product.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold">${product.price?.toFixed(2)}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart?.(product);
                }}
                className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center hover:glow-yellow transition-all active:scale-90"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}