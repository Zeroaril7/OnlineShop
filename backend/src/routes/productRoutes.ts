import { Router, Request, Response } from 'express';
import { Product } from '../models/Product.js';

const router = Router();

// GET: Ambil semua data produk
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// GET: Ambil satu produk by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'ID produk tidak valid' });
  }
});

// POST: Tambah produk baru
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      category,
      imageUrl: imageUrl || undefined,
      stock: Number(stock)
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// PUT: Perbarui data produk
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// DELETE: Hapus produk
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }
    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
