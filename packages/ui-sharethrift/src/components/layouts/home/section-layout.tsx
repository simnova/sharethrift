import { Outlet } from 'react-router-dom';

export default function HomeTabsLayout() {
  return (
    <div>
      {/* Main page layout, tabs, nav, etc. */}
      <nav>Home Tabs Navigation</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
