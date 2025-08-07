import { Outlet } from 'react-router-dom';

export default function SignupLayout() {
  return (
    <div>
      {/* Main page layout, tabs, nav, etc. */}
      <nav>Signup Navigation</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
