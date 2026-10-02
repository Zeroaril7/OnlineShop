import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="hero-card">
      <h1 className="hero-title">Selamat Datang di OnlineShop</h1>
      <p className="hero-subtitle">
        Temukan berbagai produk pilihan berkualitas dengan penawaran terbaik,
        serta pengalaman belanja yang mudah, aman, dan terpercaya.
      </p>
      <Link to="/products" className="btn-primary">
        Jelajahi Katalog Produk
      </Link>
    </div>
  );
};
