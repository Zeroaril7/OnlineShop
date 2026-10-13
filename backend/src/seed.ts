import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import { initialProducts, initialUsers } from './seeds/sampleData.js';

dotenv.config({ quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), '../.env'), quiet: true });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online_shop';

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    await Product.deleteMany({});
    await Product.insertMany(initialProducts);

    await User.deleteMany({});
    for (const u of initialUsers) {
      const hashedPassword = await bcrypt.hash(u.plainPassword, 10);
      await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role
      });
    }

    await mongoose.disconnect();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
