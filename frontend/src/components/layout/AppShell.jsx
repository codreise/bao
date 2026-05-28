import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="fixed inset-0 h-full w-full bg-background flex flex-col overflow-hidden pt-[var(--tg-safe-area-inset-top,45px)]">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}