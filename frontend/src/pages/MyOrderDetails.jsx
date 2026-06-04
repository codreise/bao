import React from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CreditCard, MapPin, Package, ShoppingBag, Truck, CheckCircle2, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusConfig = {
  pending: {
    label: 'Очікує підтвердження',
    icon: Clock3,
    className: 'bg-primary/15 text-primary border-primary/20',
  },
  confirmed: {
    label: 'Підтверджено',
    icon: CheckCircle2,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  shipped: {
    label: 'Відправлено',
    icon: Truck,
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  delivered: {
    label: 'Доставлено',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  cancelled: {
    label: 'Скасовано',
    icon: Package,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 rounded-3xl bg-card border border-border/50 animate-pulse" />
      <div className="h-40 rounded-3xl bg-card border border-border/50 animate-pulse" />
      <div className="h-32 rounded-3xl bg-card border border-border/50 animate-pulse" />
    </div>
  );
}

export default function MyOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['my-order', id],
    queryFn: () => api.get(`/orders/me/${id}`),
    enabled: Boolean(id),
  });

  const status = statusConfig[order?.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const total = Number(order?.total || 0);
  const items = order?.items || [];

  return (
    <div className="px-4 pt-4 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl font-bold">Деталі замовлення</h1>
          <p className="text-xs text-muted-foreground truncate">#{id}</p>
        </div>
      </div>

      {isLoading ? (
        <DetailSkeleton />
      ) : isError || !order ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-destructive">Не вдалося відкрити замовлення</p>
          <p className="text-xs text-destructive/80 mt-1">
            Воно могло бути видалене або недоступне для твого акаунта.
          </p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/orders">Повернутися до списку</Link>
          </Button>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-card border border-border/50 p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Статус</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className={`gap-1.5 ${status.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Сума</p>
                <p className="mt-1 text-2xl font-bold">${total.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-background/60 border border-border/50 p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Дата</p>
                <div className="mt-1 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {order.created_date ? new Date(order.created_date).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-background/60 border border-border/50 p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Оплата</p>
                <div className="mt-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Онлайн</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="rounded-3xl bg-card border border-border/50 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold">Склад замовлення</h2>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product_id || item.id || item.title}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity} · ${Number(item.price || 0).toFixed(2)} each
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold">
                      ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-background/60 border border-border/50 p-4">
              <span className="text-sm text-muted-foreground">Разом</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border/50 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold">Доставка</h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border/50 bg-background/60 p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Отримувач</p>
                <p className="mt-1 text-sm font-medium">{order.buyer_name}</p>
                <p className="text-xs text-muted-foreground">{order.buyer_email}</p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/60 p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Адреса</p>
                <p className="mt-1 text-sm font-medium leading-relaxed">{order.shipping_address}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="rounded-xl">
              <Link to="/orders">Назад до замовлень</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/explore">Продовжити покупки</Link>
            </Button>
          </div>
        </>
      )}

      <div className="h-4" />
    </div>
  );
}
