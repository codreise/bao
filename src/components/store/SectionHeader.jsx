import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SectionHeader({ title, linkTo, linkLabel = 'See all' }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-bold tracking-tight">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          {linkLabel}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}