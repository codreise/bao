import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    // Додаємо pt-[var(--tg-safe-area-inset-top,0px)] 
    // або стиль безпосередньо, щоб посунути лише контент вниз
    <div className="fixed inset-0 h-full w-full bg-background flex flex-col overflow-hidden pt-[var(--tg-safe-area-inset-top,24px)]">
      
      {/* Контентна зона */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      {/* Нижня навігація */}
      <BottomNav />
    </div>
  );
}