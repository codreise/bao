import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const statusStyles = {
  pending: 'bg-primary/15 text-primary border-primary/20',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function OrderRow({ order }) {
  const firstItem = order.items?.[0];
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0 overflow-hidden">
          {firstItem?.image_url ? (
            <img src={firstItem.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-muted-foreground">
              {firstItem?.title?.[0] || '?'}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{firstItem?.title || 'Order'}</p>
          <p className="text-[10px] text-muted-foreground">
            {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy') : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Badge className={`text-[10px] border ${statusStyles[order.status] || statusStyles.pending}`}>
          {order.status || 'pending'}
        </Badge>
        <span className="text-sm font-bold">${order.total?.toFixed(2)}</span>
      </div>
    </div>
  );
}