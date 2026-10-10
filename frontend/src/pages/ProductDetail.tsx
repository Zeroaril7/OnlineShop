import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getProductById, updateProduct, deleteProduct } from '../services/api';
import type { Product } from '../types/product';
import { useAuth } from '../context/AuthContext';
import { BuyModal } from '../components/BuyModal';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Admin Edit Modal states
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Buy Modal state (User & Guest)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);

  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Form fields for editing (Admin)
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      alert('Anda harus login terlebih dahulu untuk melakukan pembelian.');
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    setIsBuyModalOpen(true);
  };

  const handlePurchaseSuccess = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    setSuccessMessage('Pembelian Berhasil');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleOpenEdit = () => {
    if (!isAdmin || !product) return;
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setDescription(product.description);
    setImageUrl(product.imageUrl || '');
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !isAdmin) return;
    setSaving(true);
    try {
      const updated = await updateProduct(id, {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        description,
        imageUrl: imageUrl || undefined
      });
      setProduct(updated);
      setShowEditModal(false);
      setSuccessMessage('Data produk berhasil diperbarui!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.message;
        alert('Gagal memperbarui produk: ' + msg);
      } else if (err instanceof Error) {
        alert('Gagal memperbarui produk: ' + err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isAdmin) return;

    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      alert('Produk berhasil dihapus!');
      navigate('/products');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.message;
        alert('Gagal menghapus produk: ' + msg);
      } else if (err instanceof Error) {
        alert('Gagal menghapus produk: ' + err.message);
      }
    }
  };

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Gagal memuat produk.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Memuat rincian produk...</p>;
  if (error || !product) return <p>Data produk tidak ditemukan.</p>;

  return (
    <div>
      <Link to="/products" className="back-link">
        &larr; Kembali ke Katalog
      </Link>

      {successMessage && (
        <div className="alert-success" style={{ marginBottom: '1.2rem' }}>
          {successMessage}
        </div>
      )}

      <div className="detail-layout">
        <div className="detail-image-box">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="detail-info-box">
          <div>
            <span className="card-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
            <p className="card-price" style={{ fontSize: '1.75rem' }}>
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="detail-meta">
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status Stok</span>
              <p style={{ fontWeight: 600 }}>{product.stock > 0 ? `${product.stock} Unit Tersedia` : 'Habis'}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Terakhir Diperbarui</span>
              <p style={{ fontWeight: 600 }}>{new Date(product.updatedAt || Date.now()).toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Deskripsi Produk</h3>
            <p style={{ lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>{product.description}</p>
          </div>

          {/* Action Buttons Sesuai Role & Auth State */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '1.5rem' }}>
            {isAdmin ? (
              /* ADMIN: Hanya tombol Edit dan Hapus (TIDAK ADA TOMBOL BUY) */
              <>
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="btn-primary"
                  style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}
                >
                  Edit Data Produk
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn-delete"
                  style={{ padding: '0.8rem 1.5rem', cursor: 'pointer' }}
                >
                  Hapus Produk
                </button>
              </>
            ) : (
              /* USER & GUEST: HANYA TOMBOL BUY SAJA (TIDAK ADA EDIT & HAPUS) */
              <button
                type="button"
                onClick={handleBuyClick}
                className="btn-buy"
                disabled={product.stock <= 0}
                style={{ padding: '0.9rem', fontSize: '1.05rem', fontWeight: 700 }}
              >
                {product.stock <= 0 ? 'Stok Habis' : 'Beli'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Beli Produk (User Biasa & Guest) */}
      <BuyModal
        product={product}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onSuccess={handlePurchaseSuccess}
      />

      {/* Modal Edit Produk (Khusus Admin) */}
      {/* Modal Edit Produk */}
      {showEditModal && isAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ marginBottom: '1.2rem', color: 'var(--text-main)', fontSize: '1.3rem' }}>Edit Produk</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-name">Nama Produk</label>
                <input id="edit-name" type="text" className="form-input" placeholder="Nama Produk" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-price">Harga (IDR)</label>
                <input id="edit-price" type="number" className="form-input" placeholder="Harga" required value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-category">Kategori</label>
                <input id="edit-category" type="text" className="form-input" placeholder="Kategori (e.g. Aksesoris, Gadget)" required value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-stock">Stok</label>
                <input id="edit-stock" type="number" className="form-input" placeholder="Stok" required value={stock} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-image">URL Gambar</label>
                <input id="edit-image" type="url" className="form-input" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-desc">Deskripsi</label>
                <textarea id="edit-desc" className="form-input" placeholder="Deskripsi Lengkap" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 90 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
                  disabled={saving}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
