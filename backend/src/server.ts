import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import { autoSeedIfEmpty } from './seeds/sampleData.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const app = express();
const PORT = Number(process.env.BACKEND_PORT || process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online_shop';

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Online Shop Backend Ready' });
});

// Database Connection & Server Listener
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Berhasil terkoneksi ke MongoDB (online_shop)');
    await autoSeedIfEmpty();
    app.listen(PORT, () => {
      console.log(`🚀 Backend server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal koneksi ke MongoDB:', err);
    process.exit(1);
  });
