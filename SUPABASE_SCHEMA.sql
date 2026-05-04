
-- Schema strictly matching the TypeScript interfaces in types.ts

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables with exact case-sensitive column names
CREATE TABLE IF NOT EXISTS rooms (
    "id" TEXT PRIMARY KEY,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentGuestId" TEXT,
    "extraCharges" NUMERIC DEFAULT 0,
    "price" NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guests (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "checkInDate" TEXT,
    "checkInTime" TEXT,
    "checkOutDate" TEXT,
    "checkOutTime" TEXT,
    "roomId" TEXT REFERENCES rooms("id"),
    "paymentStatus" TEXT,
    "paymentMethod" TEXT,
    "amountPaid" NUMERIC DEFAULT 0,
    "notes" TEXT,
    "dailyRate" NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reservations (
    "id" TEXT PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "document" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "date" TEXT,
    "time" TEXT,
    "roomId" TEXT REFERENCES rooms("id"),
    "status" TEXT,
    "paymentStatus" TEXT,
    "paymentMethod" TEXT,
    "amountPaid" NUMERIC DEFAULT 0,
    "notes" TEXT,
    "dailyRate" NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notes (
    "id" TEXT PRIMARY KEY,
    "text" TEXT NOT NULL,
    "category" TEXT, -- Request | Warning | Info
    "time" TEXT,
    "timestamp" BIGINT
);

CREATE TABLE IF NOT EXISTS products (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" NUMERIC NOT NULL,
    "stock" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS purchases (
    "id" TEXT PRIMARY KEY,
    "roomId" TEXT REFERENCES rooms("id"),
    "productId" TEXT REFERENCES products("id"),
    "productName" TEXT,
    "price" NUMERIC NOT NULL,
    "timestamp" BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    "id" TEXT PRIMARY KEY,
    "name" TEXT,
    "primaryColor" TEXT,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Permissive Policies (All operations for Anon Key)
DO $$ 
BEGIN
    EXECUTE 'CREATE POLICY "Public Access" ON rooms FOR ALL USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Public Access" ON guests FOR ALL USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Public Access" ON reservations FOR ALL USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Public Access" ON notes FOR ALL USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Public Access" ON products FOR ALL USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Public Access" ON purchases FOR ALL USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Public Access" ON settings FOR ALL USING (true) WITH CHECK (true)';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Policies might already exist';
END $$;

-- 5. Enable Realtime for all tables
-- This allows different browsers to sync instantly when data changes
-- Note: You might need to manually enable this in the Supabase Dashboard if the publication doesn't exist yet
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE guests;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE purchases;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;
