import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';

const Layout = () => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Header />

      <div style={{ display: 'flex', marginTop: '60px' }}>
        {/* Sidebar */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <Navbar />
        </div>

        {/* Main Content (Outlet)  */}
        <div style={{
          flex: 1,
          padding: '20px',
          minWidth: 0 
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
