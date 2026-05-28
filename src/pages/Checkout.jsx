import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from "@/lib/api";
import { ArrowLeft, Lock, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.address) return;
    setLoading(true);
    await api.entities.Order.create({
      items,
      total,
      buyer_name: form.name,
      buyer_email: form.email,
      shipping_address: form.address,
      status: 'pending',
    });
    setLoading(false);
    setSuccess(true);
    clearCart();
    setTimeout(() => navigate('/'), 2500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center glow-yellow mb-6"
        >
          <Check className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h2 className="text-xl font-bold">Order Confirmed!</h2>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Your order has been placed successfully. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      {/* Order Summary */}
      <div className="bg-card border border-border/50 rounded-2xl p-4">
        <h3 className="text-sm font-bold mb-3">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.title} × {item.quantity}</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="h-px bg-border mt-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold">Shipping Details</h3>
        <Input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl bg-card border-border/50"
        />
        <Input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-xl bg-card border-border/50"
        />
        <Textarea
          placeholder="Shipping address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="rounded-xl bg-card border-border/50 min-h-[80px]"
        />
      </div>

      {/* Secure Checkout */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3.5 h-3.5" />
        <span>Secure checkout · Encrypted data</span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !form.name || !form.email || !form.address}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm glow-yellow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>
    </div>
  );
}