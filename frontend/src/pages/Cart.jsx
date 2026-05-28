import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-3 bg-card border border-border/50 rounded-2xl p-3"
    >
      <div className="w-20 h-20 rounded-xl bg-secondary/50 overflow-hidden shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-bold text-muted-foreground">{item.title?.[0]}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold truncate">{item.title}</h3>
          <p className="text-sm font-bold text-primary mt-0.5">${item.price?.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
              className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center active:scale-90 transition-transform"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center active:scale-90 transition-transform"
            >
              <Plus className="w-3 h-3 text-primary-foreground" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.product_id)}
            className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-bold">Cart</h1>
        {itemCount > 0 && (
          <span className="px-2 py-0.5 bg-primary/15 text-primary text-xs font-bold rounded-full">
            {itemCount}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-3xl bg-card border border-border/50 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Your cart is empty</p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary"
          >
            Start shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-primary">Free</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full text-center bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm glow-yellow active:scale-[0.98] transition-all"
          >
            Proceed to Checkout
          </Link>
        </>
      )}

      <div className="h-4" />
    </div>
  );
}