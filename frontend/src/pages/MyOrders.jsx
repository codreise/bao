import React from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PackageOpen, Clock3, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderRow from '../components/dashboard/OrderRow';
import SectionHeader from '../components/store/SectionHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function StatSkeleton() {
  return <div className="h-[92px] rounded-2xl bg-card border border-border/50 animate-pulse" />;
}

function OrderSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 shrink-0 animate-pulse" />
        <div className="min-w-0 space-y-2">
          <div className="h-3 w-32 rounded-full bg-secondary/50 animate-pulse" />
          <div className="h-2.5 w-20 rounded-full bg-secondary/50 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-5 w-16 rounded-full bg-secondary/50 animate-pulse" />
        <div className="h-4 w-14 rounded-full bg-secondary/50 animate-pulse" />
      </div>
    </div>
  );
}

export default function MyOrders() {
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/me'),
  });

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingCount = orders.filter((order) => order.status === 'pending').length;

  return (
    <div className="px-4 pt-4 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <PackageOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">Мої замовлення</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Тут видно історію покупок, статуси та суму витрат.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {isLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Усього замовлень
                </p>
                <p className="mt-1 text-2xl font-bold">{orders.length}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">За весь час</p>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Витрачено
                </p>
                <p className="mt-1 text-2xl font-bold">${totalSpent.toFixed(0)}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">З усіх оформлень</p>
              </div>
            </>
          )}
        </div>

        {!isLoading && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <Clock3 className="w-3 h-3" />
              {pendingCount} pending
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Sparkles className="w-3 h-3" />
              Доступно онлайн
            </Badge>
          </div>
        )}
      </motion.div>

      <div>
        <SectionHeader title="Історія замовлень" />

        {isLoading ? (
          <div className="rounded-3xl bg-card border border-border/50 px-4 py-2">
            {[1, 2, 3, 4].map((item) => (
              <OrderSkeleton key={item} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-destructive">Не вдалося завантажити замовлення</p>
            <p className="text-xs text-destructive/80 mt-1">
              Спробуй оновити сторінку або зайти пізніше.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card px-5 py-8">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Поки що тут порожньо</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[260px]">
                Щойно ти оформлюєш перше замовлення, воно з&apos;явиться тут із датою, сумою та статусом.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full justify-center">
                <Button asChild className="rounded-xl">
                  <Link to="/explore">
                    Перейти до покупок
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link to="/cart">Відкрити кошик</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-card border border-border/50 px-4 py-2 shadow-sm">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-xl px-2 transition-colors hover:bg-muted/30"
              >
                <OrderRow order={order} />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}
