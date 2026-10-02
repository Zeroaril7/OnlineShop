# Online Shop Web Application

Aplikasi web e-commerce modern berbasis full-stack. Menyediakan antarmuka katalog produk yang responsif, RESTful API dengan operasi CRUD lengkap, dan penyimpanan data menggunakan MongoDB.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Option 1: Docker Deployment (Recommended)](#option-1-docker-deployment-recommended)
- [Option 2: Manual Setup (Local Development)](#option-2-manual-setup-local-development)
- [Service URLs & API Endpoints](#service-urls--api-endpoints)
- [Database Seeding](#database-seeding)

---

## Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, React Router 7, Vite | Single Page Application (SPA), Flexbox & CSS Grid, Axios client |
| **Frontend Server** | Nginx Alpine | Production web server & reverse proxy untuk internal routing |
| **Backend API** | Node.js, Express 5, TypeScript | RESTful API modular, Mongoose ODM |
| **Database** | MongoDB | Document-based NoSQL database |
| **Containerization** | Docker & Docker Compose | Multi-container setup terisolasi pada network `shop_net` |

---

## Project Structure

```text
Online-Shop/
├── backend/                  # Express & TypeScript backend service
│   ├── src/
│   │   ├── models/           # Mongoose Data Models (Product.ts)
│   │   ├── routes/           # RESTful API Route Handlers (productRoutes.ts)
│   │   ├── seeds/            # Initial seed dataset (sampleData.ts)
│   │   ├── seed.ts           # Standalone CLI database seeder
│   │   └── server.ts         # Server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # React SPA & Vite frontend service
│   ├── src/
│   │   ├── pages/            # Application pages (Home, ProductList, ProductDetail)
│   │   ├── services/         # Axios API client (api.ts)
│   │   ├── types/            # TypeScript interfaces & types
│   │   └── App.tsx           # Router & layout shell
│   ├── nginx.conf            # Nginx production reverse proxy config
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # Docker multi-container orchestration
├── .env.example              # Global environment variables template
└── README.md                 # Project documentation
```

---

## Environment Variables

Aplikasi dirancang dengan prinsip **Zero Configuration**. Jika file `.env` tidak dibuat, aplikasi akan otomatis menggunakan konfigurasi default.

```bash
# Salin template env di root project (opsional)
cp .env.example .env
```

### Global Configuration (`.env` di root)

| Variable | Default Value | Description |
|---|---|---|
| `FRONTEND_PORT` | `3000` | Port host untuk Frontend (Vite lokal & Docker port) |
| `BACKEND_PORT` | `5000` | Port host untuk Backend (Express lokal & Docker port) |
| `MONGO_PORT` | `27017` | Port database MongoDB host |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/online_shop` | URI koneksi MongoDB lokal |

---

## Option 1: Docker Deployment (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) atau Docker Engine + Docker Compose sudah terpasang dan berjalan.

### Getting Started

1. **Build and Run Containers:**
   ```bash
   docker compose up -d --build
   ```

2. **Check Container Status:**
   ```bash
   docker compose ps
   ```

3. **View Real-time Logs:**
   ```bash
   docker compose logs -f
   ```

4. **Run Database Seed (Sample Data):**
   ```bash
   docker compose exec backend npm run seed
   ```

5. **Stop Containers:**
   ```bash
   docker compose down
   ```
   *(Gunakan `docker compose down -v` jika ingin menghapus volume database).*

---

## Option 2: Manual Setup (Local Development)

### Prerequisites
- **Node.js** (v18 ke atas) & **npm**
- **MongoDB** instance aktif di lokal (`mongodb://localhost:27017`)

---

### Step 1: Backend Setup

Buka terminal pertama:

```bash
# 1. Navigasi ke direktori backend
cd backend

# 2. Install dependencies
npm install

# 3. Jalankan development server (hot-reload dengan tsx)
npm run dev

*Backend server akan berjalan di `http://localhost:5000`.*

> **Optional Seeding:**  
> Untuk memasukkan sample data produk ke MongoDB lokal:
> ```bash
> npm run seed:dev
> ```

---

### Step 2: Frontend Setup

Buka terminal kedua:

```bash
# 1. Navigasi ke direktori frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Jalankan Vite development server
npm run dev
```

---

## Service URLs & API Endpoints

### Service URLs

| Service | Docker Environment | Manual Development |
|---|---|---|
| **Frontend Web** | [http://localhost:3000](http://localhost:3000) | [http://localhost:3000](http://localhost:3000) |
| **Backend REST API** | [http://localhost:5000/api/products](http://localhost:5000/api/products) | [http://localhost:5000/api/products](http://localhost:5000/api/products) |
| **API Health Check** | [http://localhost:5000/health](http://localhost:5000/health) | [http://localhost:5000/health](http://localhost:5000/health) |
| **MongoDB** | `mongodb://localhost:27017/online_shop` | `mongodb://localhost:27017/online_shop` |

---

### RESTful API Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/products` | Fetch all products list | None |
| `GET` | `/api/products/:id` | Fetch product details by ID | None |
| `POST` | `/api/products` | Create a new product | JSON (`name`, `price`, `category`, `stock`, `description`, `imageUrl`) |
| `PUT` | `/api/products/:id` | Update product details | JSON *(supports partial updates)* |
| `DELETE` | `/api/products/:id` | Delete product by ID | None |

---

## Database Seeding

Aplikasi dilengkapi dataset sample produk awal (*Monitor Skyworth 240Hz* & *Ugreen HDMI 2.1 Cable*):

1. **Automatic Seeding (Cold Start):**
   Saat backend terkoneksi ke MongoDB dan mendeteksi database masih kosong, sistem akan **secara otomatis menanam (*auto-seed*)** data produk tersebut.

2. **Manual Seeding (Reset Data):**
   - **Docker:**
     ```bash
     docker compose exec backend npm run seed
     ```
   - **Manual/Local:**
     ```bash
     cd backend && npm run seed:dev
     ```
