import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-card border border-border/60 rounded-2xl text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
      />
    </div>
  );
}