import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { IoTStoreProvider } from './data/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { DepartmentMembers } from './pages/DepartmentMembers';
import { MemberProfile } from './pages/MemberProfile';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { MemberSignUp } from './pages/MemberSignUp';
import { MemberDashboard } from './pages/MemberDashboard';

// Layout manager to toggle global header/footer visibility
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Hide global navbar and footer on admin dashboards or login consoles
  const hideLayout = ['/admin', '/admin-login', '/signup', '/member-dashboard'].includes(location.pathname);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)' }}>
      {!hideLayout && <Navbar />}
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

function App() {
  return (
    <IoTStoreProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members/:year" element={<DepartmentMembers />} />
            <Route path="/profile/:id" element={<MemberProfile />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/signup" element={<MemberSignUp />} />
            <Route path="/member-dashboard" element={<MemberDashboard />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </IoTStoreProvider>
  );
}

export default App;
