import React from 'react';
import { api } from "@/lib/api";
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingCart, Star, Plus, Settings, ClipboardList } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import OrderRow from '../components/dashboard/OrderRow';
import SectionHeader from '../components/store/SectionHeader';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.entities.Product.list('-created_date', 100),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.entities.Order.list('-created_date', 20),
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeProducts = products.filter((p) => p.status === 'active').length;

  const quickActions = [
    { label: 'Add Product', icon: Plus, path: '/add-product' },
    { label: 'Manage Store', icon: Settings, path: '/' },
    { label: 'All Orders', icon: ClipboardList, path: '/dashboard' },
  ];

  return (
    <div className="px-4 pt-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center glow-yellow-sm">
              <span className="text-sm font-black text-primary-foreground">B</span>
            </div>
            <span className="text-lg font-bold">Seller Dashboard</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Order Management & Analytics</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Gross Revenue" value={`$${totalRevenue.toFixed(0)}`} icon={DollarSign} delay={0} />
        <StatCard label="Active Products" value={activeProducts} icon={Package} delay={0.05} />
        <StatCard label="New Orders" value={orders.length} icon={ShoppingCart} delay={0.1} />
        <StatCard label="Rating" value="4.8" icon={Star} delay={0.15} />
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex items-center gap-2 px-4 py-3 bg-card border border-border/50 rounded-2xl whitespace-nowrap hover:border-primary/30 transition-all active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <action.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <SectionHeader title="Recent Orders" />
        <div className="bg-card border border-border/50 rounded-2xl px-4 py-2">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            orders.slice(0, 5).map((order) => (
              <OrderRow key={order.id} order={order} />
            ))
          )}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}