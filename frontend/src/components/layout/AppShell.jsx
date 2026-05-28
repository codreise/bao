import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    // Замінюємо min-h-screen на h-[100dvh], щоб висота чітко тримала рамки екрана,
    // і робимо flex-контейнер для правильного притискання меню
    <div className="h-[100dvh] w-full bg-background flex flex-col relative overflow-hidden">
      
      {/* Контентна зона, яка займає весь простір і має власний скрол */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      {/* Нижня навігація, яка тепер завжди зафіксована чітко знизу екрана */}
      <BottomNav />
    </div>
  );
}