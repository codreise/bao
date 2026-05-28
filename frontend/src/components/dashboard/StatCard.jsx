import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border/50 rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -translate-y-4 translate-x-4" />
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold relative z-10">{value}</p>
    </motion.div>
  );
}