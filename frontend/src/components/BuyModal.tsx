import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Product } from '../types/product';
import { buyProduct } from '../services/api';

interface BuyModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProduct: Product, quantity: number, totalCost: number) => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({ product, isOpen, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) {
    return null;
  }

  const maxStock = product.stock;
  const isOutOfStock = maxStock <= 0;
  const totalCost = quantity * product.price;

  const handleQuantityChange = (val: number) => {
    if (isNaN(val)) {
      setQuantity(1);
      return;
    }
    const clamped = Math.max(1, Math.min(val, maxStock > 0 ? maxStock : 1));
    setQuantity(clamped);
  };

  const handleConfirmBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOutOfStock) {
      setErrorMessage('Stok produk telah habis.');
      return;
    }

    if (quantity < 1 || quantity > maxStock) {
      setErrorMessage(`Jumlah harus antara 1 dan ${maxStock}.`);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await buyProduct(product._id, quantity);
      onSuccess(result.product, result.purchasedQuantity, result.totalCost);
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (resData && typeof resData === 'object' && 'message' in resData && typeof resData.message === 'string') {
          setErrorMessage(resData.message);
        } else if (err.message) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Gagal memproses pembelian.');
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan yang tidak terduga.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: '2rem',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)' }}>Konfirmasi Pembelian</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            &times;
          </button>
        </div>

        {/* Info Ringkas Produk */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--bg)',
            borderRadius: 8,
            border: '1px solid var(--border)',
            marginBottom: '1.2rem'
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{product.name}</h4>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '0.25rem'
              }}
            >
              Kategori: {product.category}
            </span>
            <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem' }}>
              Rp {product.price.toLocaleString('id-ID')} / unit
            </div>
            <div style={{ fontSize: '0.8rem', color: isOutOfStock ? 'var(--danger)' : 'var(--text-muted)' }}>
              Stok Tersedia: <strong>{product.stock}</strong> unit
            </div>
          </div>
        </div>

        {errorMessage && <div className="alert-error">{errorMessage}</div>}

        <form onSubmit={handleConfirmBuy} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Input Jumlah */}
          <div className="form-group">
            <label className="form-label" htmlFor="buy-quantity">
              Tentukan Jumlah yang Ingin Dibeli:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isOutOfStock}
                style={{
                  width: 38,
                  height: 38,
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                -
              </button>
              <input
                id="buy-quantity"
                type="number"
                min={1}
                max={maxStock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                disabled={isOutOfStock}
                className="form-input"
                style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', flex: 1 }}
                required
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxStock || isOutOfStock}
                style={{
                  width: 38,
                  height: 38,
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Rincian Biaya */}
          <div
            style={{
              padding: '0.4rem 0',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'baseline',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total:
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Rp {totalCost.toLocaleString('id-ID')}
            </span>
          </div>
          {/* Tombol Aksi */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              className="btn-buy"
              disabled={isSubmitting || isOutOfStock}
              style={{ padding: '0.65rem 1.5rem', flex: 'none' }}
            >
              {isSubmitting ? 'Memproses...' : 'Beli Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
