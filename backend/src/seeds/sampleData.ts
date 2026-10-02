import { Product } from '../models/Product.js';

export const initialProducts = [
  {
    name: 'Monitor Skyworth F24G41F 24" FHD 240Hz',
    description:
      '- Ukuran Layar: 24 Inch\n- Resolusi: Full HD (1920 x 1080)\n- Refresh Rate: 240Hz\n- Seri: Gaming Monitor\n- Brand: Skyworth\n- Model: F24G41F',
    price: 1788000,
    category: 'Elektronik',
    imageUrl:
      'https://d2po8s8685fal.cloudfront.net/ecommerce/storage/169495/id-11134207-8224r-mjp2s7d3y8sga8.jpg',
    stock: 10
  },
  {
    name: 'Ugreen HDMI 2.1 8K 60Hz Cable 48Gbps Ultra High Speed',
    description:
      '- 48Gbps Super High Speed\n- 8K@ 60Hz HDMI 2.1\n- Support Dynamic HDR& eARC',
    price: 102724,
    category: 'Aksesoris',
    imageUrl:
      'https://nz.ugreen.com/cdn/shop/products/71QyqlAnQuL.jpg?v=1701074280&width=990',
    stock: 3
  }
];

export const autoSeedIfEmpty = async (): Promise<void> => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(initialProducts);
    console.log(`🌱 Database kosong. Berhasil menanam (auto-seed) ${initialProducts.length} sample data produk.`);
  }
};
