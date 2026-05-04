-- SQL Schema for Supabase Integration

-- 1. Guests Table
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  document TEXT,
  phone TEXT,
  email TEXT,
  "checkInDate" TEXT,
  "checkInTime" TEXT,
  "checkOutDate" TEXT,
  "checkOutTime" TEXT,
  "roomId" TEXT,
  "paymentStatus" TEXT,
  "paymentMethod" TEXT,
  "amountPaid" NUMERIC DEFAULT 0,
  notes TEXT,
  "dailyRate" NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  type TEXT,
  status TEXT,
  "currentGuestId" TEXT,
  "extraCharges" NUMERIC DEFAULT 0,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  "guestName" TEXT NOT NULL,
  document TEXT,
  phone TEXT,
  email TEXT,
  date TEXT,
  time TEXT,
  "roomId" TEXT,
  status TEXT,
  notes TEXT,
  "paymentStatus" TEXT,
  "paymentMethod" TEXT,
  "amountPaid" NUMERIC DEFAULT 0,
  "dailyRate" NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sales (Purchases) Table
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  "roomId" TEXT,
  "productId" TEXT,
  "productName" TEXT,
  price NUMERIC DEFAULT 0,
  timestamp BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Reception Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT,
  time TEXT,
  timestamp BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY, -- 'hotel_config' or others
  name TEXT,
  "primaryColor" TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE guests, rooms, reservations, products, purchases, notes, settings;
