import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function FeaturedBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl bg-foreground p-5 glow-yellow"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/15 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">New Collection</span>
        </div>
        <h3 className="text-lg font-bold text-background leading-tight">
          Explore Digital<br />Services & Products
        </h3>
        <p className="text-xs text-background/60 mt-1.5 max-w-[200px]">
          Premium curated marketplace for the next generation
        </p>
        <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:glow-yellow transition-all active:scale-95">
          Browse Now
        </button>
      </div>
    </motion.div>
  );
}