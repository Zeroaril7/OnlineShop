import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct, deleteProduct } from '../services/api';
import type { Product } from '../types/product';
export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Form fields for editing
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleOpenEdit = () => {
    if (!product) return;
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
    if (!id) return;
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
      alert('Produk berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui produk: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      alert('Produk berhasil dihapus!');
      navigate('/products');
    } catch (err) {
      alert('Gagal menghapus produk: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Memuat rincian produk...</p>;
  if (error || !product) return <p>Data produk tidak ditemukan.</p>;

  return (
    <div>
      <Link to="/products" className="back-link">
        &larr; Kembali ke Katalog
      </Link>

      {/* Flexbox Two-Column Layout */}
      <div className="detail-layout">
        <div className="detail-image-box">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="detail-info-box">
          <span className="card-badge">{product.category}</span>
          <h2>{product.name}</h2>
          <p className="card-price" style={{ fontSize: '1.75rem' }}>
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <div className="detail-meta">
            <p><strong>Stok:</strong> {product.stock} unit</p>
            <p><strong>Kode Produk (SKU):</strong> <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product._id}</span></p>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Deskripsi:</h4>
            <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{product.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button onClick={handleOpenEdit} className="btn-primary" style={{ padding: '0.6rem 1.2rem', cursor: 'pointer' }}>
              ✏️ Edit Produk
            </button>
            <button onClick={handleDelete} className="btn-delete" style={{ padding: '0.6rem 1.2rem' }}>
              Hapus Produk
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit Produk */}
      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 8, width: 440, maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Edit Data Produk</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input type="text" placeholder="Nama Produk" required value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '0.6rem' }} />
              <input type="number" placeholder="Harga (IDR)" required value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} style={{ padding: '0.6rem' }} />
              <input type="text" placeholder="Kategori (e.g. Aksesoris, Gadget)" required value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.6rem' }} />
              <input type="number" placeholder="Stok" required value={stock} onChange={(e) => setStock(Number(e.target.value))} style={{ padding: '0.6rem' }} />
              <input type="url" placeholder="URL Gambar (Opsional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: '0.6rem' }} />
              <textarea placeholder="Deskripsi Singkat" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '0.6rem', minHeight: 80 }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '0.6rem 1.2rem', cursor: 'pointer' }} disabled={saving}>Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
