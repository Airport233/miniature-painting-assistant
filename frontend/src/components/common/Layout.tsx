import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: 56,
          flex: 1,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
