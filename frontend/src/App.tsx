import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import './App.css';

export const App: React.FC = () => {
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
        </nav>
      </header>

      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
