import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { initialProducts } from './seeds/sampleData.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online_shop';

const runSeed = async () => {
  try {
    console.log('🔄 Menghubungkan ke MongoDB untuk seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Terhubung ke MongoDB.');

    await Product.deleteMany({});
    console.log('🧹 Menghapus koleksi produk lama...');

    const inserted = await Product.insertMany(initialProducts);
    console.log(`🌱 Sukses memasukkan ${inserted.length} data produk sample:`);
    inserted.forEach((p, idx) => {
      console.log(`   ${idx + 1}. [${p.category}] ${p.name} - Rp ${p.price.toLocaleString('id-ID')}`);
    });

    await mongoose.disconnect();
    console.log('🏁 Seeding selesai dengan sukses.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal melakukan seeding:', error);
    process.exit(1);
  }
};

runSeed();
