import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, createProduct } from '../services/api';
import type { Product } from '../types/product';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Gagal menghapus produk: ' + (err as Error).message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err) {
      alert('Gagal menambah item: ' + (err as Error).message);
    }
  };

  return (
    <div>
      <div className="catalog-header">
        <div>
          <h2>Katalog Produk</h2>
          <p style={{ color: 'var(--text-muted)' }}>Jelajahi berbagai pilihan produk terbaik kami</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Tambah Produk
        </button>
      </div>

      {/* Modal Input Tambah Produk */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 8, width: 440, maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tambah Produk Baru</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input type="text" placeholder="Nama Produk" required value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '0.6rem' }} />
              <input type="number" placeholder="Harga (IDR)" required value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} style={{ padding: '0.6rem' }} />
              <input type="text" placeholder="Kategori (e.g. Aksesoris, Gadget)" required value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.6rem' }} />
              <input type="number" placeholder="Stok Awal" required value={stock} onChange={(e) => setStock(Number(e.target.value))} style={{ padding: '0.6rem' }} />
              <input type="url" placeholder="URL Gambar (Opsional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: '0.6rem' }} />
              <textarea placeholder="Deskripsi Singkat" required value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '0.6rem', minHeight: 80 }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.6rem 1.2rem', cursor: 'pointer' }}>Batal</button>
                <button type="submit" className="btn-primary">Simpan Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Memuat data produk...</p>
      ) : products.length === 0 ? (
        <p>Belum ada produk yang tersedia saat ini. Silakan tambahkan produk baru.</p>
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
                  <Link to={`/products/${item._id}`} className="btn-detail">
                    Lihat Detail
                  </Link>
                  <button onClick={(e) => handleDelete(item._id, e)} className="btn-delete" title="Hapus Data">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
