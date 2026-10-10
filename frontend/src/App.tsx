import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

export const App: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <header className="navbar">
        <Link to="/" className="brand">OnlineShop</Link>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Beranda
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Daftar Produk
          </NavLink>

          {isAuthenticated ? (
            <div className="nav-user-section">
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Profil
              </NavLink>
              <span className="user-pill" title={`Login sebagai ${user?.email}`}>
                👤 {user?.name}
              </span>
              <button onClick={logout} className="btn-logout" title="Keluar dari akun">
                Keluar
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <NavLink to="/login" className="btn-nav-login">
                Masuk
              </NavLink>
              <NavLink to="/register" className="btn-nav-register">
                Daftar
              </NavLink>
            </div>
          )}
        </nav>
      </header>

      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
