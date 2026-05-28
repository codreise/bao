import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Grid3X3, label: 'Explore' },
  { path: '/cart', icon: ShoppingBag, label: 'Cart' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Seller' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card bg-card/90 border-t border-border/50">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/15 rounded-xl glow-yellow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[10px] font-medium relative z-10 transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}