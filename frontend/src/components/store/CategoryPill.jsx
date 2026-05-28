import { motion } from 'framer-motion';

export default function CategoryPill({ label, icon, isActive, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
        isActive
          ? 'bg-primary text-primary-foreground border-primary glow-yellow-sm'
          : 'bg-card text-foreground border-border/50 hover:border-primary/30'
      }`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
}