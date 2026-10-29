// app/RootLayout.tsx  — this is your App.tsx, renamed
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { NavBar } from './NavBar';

export const RootLayout = () => (
  <div className="app-shell">
    <NavBar />

    <main className="app-main">
      <Outlet />
    </main>

    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      newestOnTop
      pauseOnHover
      theme="colored"
    />
  </div>
);
