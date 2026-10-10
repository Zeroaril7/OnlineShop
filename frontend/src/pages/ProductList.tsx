import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getProducts, deleteProduct, createProduct } from '../services/api';
import type { Product } from '../types/product';
import { useAuth } from '../context/AuthContext';
import { BuyModal } from '../components/BuyModal';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Buy Modal state
  const [selectedProductToBuy, setSelectedProductToBuy] = useState<Product | null>(null);

  // Form states untuk Tambah Produk (Admin)
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const handleBuyClick = (product: Product) => {
    if (!isAuthenticated) {
      // Paksa login jika belum login
      alert('Anda harus login terlebih dahulu untuk melakukan pembelian.');
      navigate('/login', { state: { from: { pathname: '/products' } } });
      return;
    }

    // Tampilkan modal pembelian untuk user terautentikasi
    setSelectedProductToBuy(product);
  };

  const handlePurchaseSuccess = (updatedProduct: Product) => {
    // Perbarui state produk di katalog
    setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setSuccessMessage('Pembelian Berhasil');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Operasi ini hanya dapat dilakukan oleh Administrator.');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.message;
        alert('Gagal menghapus produk: ' + msg);
      } else if (err instanceof Error) {
        alert('Gagal menghapus produk: ' + err.message);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Hanya Administrator yang dapat menambah produk.');
      return;
    }

    try {
      const created = await createProduct({
        name,
        price,
        category,
        stock,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'
      });
      setProducts([created, ...products]);
      setShowModal(false);
      // Reset form
      setName('');
      setPrice(0);
      setCategory('');
      setStock(1);
      setDescription('');
      setImageUrl('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.message;
        alert('Gagal menambah item: ' + msg);
      } else if (err instanceof Error) {
        alert('Gagal menambah item: ' + err.message);
      }
    }
  };

  return (
    <div>
      <div className="catalog-header">
        <div>
          <h2>Katalog Produk</h2>
          <p style={{ color: 'var(--text-muted)' }}>Jelajahi berbagai pilihan produk terbaik kami</p>
        </div>
        {/* Tombol Tambah Produk HANYA untuk Admin */}
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Tambah Produk
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert-success" style={{ marginBottom: '1.2rem' }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert-error" style={{ marginBottom: '1rem' }}>
          Gagal memuat katalog: {errorMessage}
        </div>
      )}

      {/* Modal Input Tambah Produk (Khusus Admin) */}
      {showModal && isAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ marginBottom: '1.2rem', color: 'var(--text-main)', fontSize: '1.3rem' }}>Tambah Produk Baru</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="create-name">Nama Produk</label>
                <input id="create-name" type="text" className="form-input" placeholder="Nama Produk" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="create-price">Harga (IDR)</label>
                <input id="create-price" type="number" className="form-input" placeholder="Harga" required value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="create-category">Kategori</label>
                <input id="create-category" type="text" className="form-input" placeholder="Kategori (e.g. Aksesoris, Gadget)" required value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="create-stock">Stok Awal</label>
                <input id="create-stock" type="number" className="form-input" placeholder="Stok Awal" required value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="create-image">URL Gambar (Opsional)</label>
                <input id="create-image" type="url" className="form-input" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="create-desc">Deskripsi</label>
                <textarea id="create-desc" className="form-input" placeholder="Deskripsi Singkat" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 90 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.65rem 1.3rem',
                    border: 'none',
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pembelian Produk (Untuk User Terautentikasi) */}
      <BuyModal
        product={selectedProductToBuy}
        isOpen={!!selectedProductToBuy}
        onClose={() => setSelectedProductToBuy(null)}
        onSuccess={handlePurchaseSuccess}
      />

      {loading ? (
        <p>Memuat data produk...</p>
      ) : products.length === 0 ? (
        <p>Belum ada produk yang tersedia saat ini.</p>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <div key={item._id} className="product-card">
              <img src={item.imageUrl} alt={item.name} className="product-card-image" />
              <div className="card-body">
                <span className="card-badge">{item.category}</span>
                <h3 className="card-title">{item.name}</h3>
                <p className="card-price">Rp {item.price.toLocaleString('id-ID')}</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                  Stok: <strong>{item.stock}</strong> unit
                </p>

                <div className="card-actions">
                  {isAdmin ? (
                    /* ADMIN: Tombol Lihat Detail dan Hapus (TIDAK ADA TOMBOL BUY) */
                    <>
                      <Link to={`/products/${item._id}`} className="btn-detail">
                        Detail
                      </Link>
                      <button onClick={(e) => handleDelete(item._id, e)} className="btn-delete" title="Hapus Data">
                        Hapus
                      </button>
                    </>
                  ) : (
                    /* USER & GUEST: Tombol Beli dan Details (TIDAK ADA TOMBOL HAPUS) */
                    <>
                      <button
                        type="button"
                        onClick={() => handleBuyClick(item)}
                        className="btn-buy"
                        disabled={item.stock <= 0}
                      >
                        {item.stock <= 0 ? 'Habis' : 'Beli'}
                      </button>
                      <Link to={`/products/${item._id}`} className="btn-detail">
                        Detail
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
