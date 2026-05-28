import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    // Використовуємо класи top-0 left-0 та жорстку висоту екрана
    <div className="absolute top-0 left-0 w-full h-[var(--tg-viewport-height,100vh)] bg-background flex flex-col overflow-hidden">
      
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
}