import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { ArrowLeft, Lock, Check, ShoppingBag, Clock3, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const initialForm = { name: '', email: '', address: '' };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const sellerIds = useMemo(
    () => [...new Set(items.map((item) => item.seller_id).filter(Boolean))],
    [items]
  );

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Вкажи ім’я отримувача';
    if (!form.email.trim()) {
      nextErrors.email = 'Вкажи email';
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Вкажи коректний email';
    }
    if (!form.address.trim()) nextErrors.address = 'Вкажи адресу доставки';
    if (items.length === 0) nextErrors.items = 'Кошик порожній';
    if (sellerIds.length === 0) nextErrors.seller = 'У товарах немає seller information';
    if (sellerIds.length > 1) nextErrors.seller = 'Checkout підтримує тільки одного продавця за раз';

    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextFieldErrors = validateForm();
    setFieldErrors(nextFieldErrors);
    setError('');

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const createdOrder = await api.post('/orders', {
        items,
        total,
        buyer_name: form.name.trim(),
        buyer_email: form.email.trim(),
        shipping_address: form.address.trim(),
        seller_id: sellerIds[0],
        status: 'pending',
      });

      clearCart();
      setSuccessOrder(createdOrder);
    } catch (submitError) {
      setError(
        submitError?.data?.message ||
          submitError?.message ||
          'Не вдалося створити замовлення. Спробуй ще раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="min-h-screen px-4 py-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-28 w-28 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center glow-yellow mb-5 shadow-lg shadow-primary/20"
              >
                <Check className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold">
                Order placed
              </p>
              <h2 className="mt-2 text-2xl font-bold">Замовлення успішно створено</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-[280px]">
                Ми вже зберегли твоє замовлення. Його номер і статус доступні нижче.
              </p>

              <div className="mt-6 grid w-full grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/50 bg-background/70 p-4 text-left">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Order #</p>
                  <p className="mt-1 text-lg font-bold">#{successOrder.id}</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-background/70 p-4 text-left">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
                  <p className="mt-1 text-lg font-bold">${Number(successOrder.total || total).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 w-full rounded-2xl border border-border/50 bg-background/70 p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock3 className="w-4 h-4 text-primary" />
                  <span>Статус: pending</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Твоє замовлення прийнято. Наступний крок - підтвердження продавцем.
                </p>
              </div>

              <div className="mt-6 flex w-full flex-col sm:flex-row gap-3">
                <Button asChild className="rounded-xl flex-1">
                  <Link to="/orders">
                    Мої замовлення
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl flex-1">
                  <Link to="/explore">Продовжити покупки</Link>
                </Button>
              </div>

              <button
                onClick={() => navigate('/')}
                className="mt-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Повернутися на головну
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isDisabled =
    loading ||
    !form.name.trim() ||
    !form.email.trim() ||
    !form.address.trim() ||
    items.length === 0 ||
    sellerIds.length !== 1;

  return (
    <div className="px-4 pt-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Checkout</h1>
          <p className="text-xs text-muted-foreground">Перевір дані перед підтвердженням</p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-4">
        <h3 className="text-sm font-bold mb-3">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.title} x {item.quantity}
              </span>
              <span className="font-medium">${(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="h-px bg-border mt-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${Number(total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold">Shipping Details</h3>
        <div className="space-y-2">
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl bg-card border-border/50"
          />
          {fieldErrors.name ? <p className="text-xs text-destructive">{fieldErrors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl bg-card border-border/50"
          />
          {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email}</p> : null}
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Shipping address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="rounded-xl bg-card border-border/50 min-h-[96px]"
          />
          {fieldErrors.address ? (
            <p className="text-xs text-destructive">{fieldErrors.address}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3.5 h-3.5" />
        <span>Secure checkout · Encrypted data</span>
      </div>

      {fieldErrors.items ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {fieldErrors.items}
        </div>
      ) : null}

      {fieldErrors.seller ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {fieldErrors.seller}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm glow-yellow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `Pay $${Number(total || 0).toFixed(2)}`
        )}
      </button>

      {!loading && sellerIds.length !== 1 ? (
        <p className="text-[11px] text-muted-foreground text-center">
          Checkout currently supports one seller per order.
        </p>
      ) : null}
    </div>
  );
}
