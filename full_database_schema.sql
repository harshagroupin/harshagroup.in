-- ==========================================
-- HARSHA HEIGHTS CMS - FULL DATABASE SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROPERTIES TABLE
-- ==========================================
DROP TABLE IF EXISTS properties CASCADE;
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  location text NOT NULL,
  price text NOT NULL,
  area text,
  type text,
  category text DEFAULT 'office',
  image_url text,
  video_url text,
  description text,
  features text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  display_location text DEFAULT 'homepage',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. GALLERY IMAGES TABLE
-- ==========================================
DROP TABLE IF EXISTS gallery_images CASCADE;
CREATE TABLE gallery_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url text,
  video_url text,
  media_type text DEFAULT 'image',
  alt_text text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. HERO CONTENT TABLE
-- ==========================================
DROP TABLE IF EXISTS hero_content CASCADE;
CREATE TABLE hero_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading text NOT NULL,
  subheading text NOT NULL,
  image_url text,
  video_url text,
  media_type text DEFAULT 'image',
  cta_primary_text text DEFAULT 'Explore Properties',
  cta_secondary_text text DEFAULT 'Contact Now',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default hero content
INSERT INTO hero_content (heading, subheading) 
VALUES (
  'Premium Commercial Spaces That Drive Business Growth',
  'Invest | Lease | Grow with Harsha Group — Your trusted partner for premium commercial real estate.'
);

-- ==========================================
-- 4. PAGE CONTENT TABLE
-- ==========================================
DROP TABLE IF EXISTS page_content CASCADE;
CREATE TABLE page_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default page content (About section)
INSERT INTO page_content (section_key, content)
VALUES (
  'about_section',
  '{"title": "About Harsha Group", "description": "Harsha Group is a leading real estate developer...", "stats": [{"label": "Years Experience", "value": "20+"}, {"label": "Projects Delivered", "value": "50+"}]}'::jsonb
);

-- ==========================================
-- 4.5. INQUIRIES & FRACTIONAL INQUIRIES TABLES
-- ==========================================
DROP TABLE IF EXISTS inquiries CASCADE;
CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TABLE IF EXISTS fractional_inquiries CASCADE;
CREATE TABLE fractional_inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  investment_budget text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_inquiries ENABLE ROW LEVEL SECURITY;

-- Properties Policies
CREATE POLICY "Allow public read access on properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on properties" ON properties FOR ALL USING (auth.role() = 'authenticated');

-- Gallery Images Policies
CREATE POLICY "Allow public read access on gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- Hero Content Policies
CREATE POLICY "Allow public read access on hero_content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on hero_content" ON hero_content FOR ALL USING (auth.role() = 'authenticated');

-- Page Content Policies
CREATE POLICY "Allow public read access on page_content" ON page_content FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access on page_content" ON page_content FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries Policies
CREATE POLICY "Allow public insert access on inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');

-- Fractional Inquiries Policies
CREATE POLICY "Allow public insert access on fractional_inquiries" ON fractional_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access on fractional_inquiries" ON fractional_inquiries FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 6. STORAGE BUCKETS (Optional, if using Supabase Storage)
-- ==========================================
-- Note: These need to be created via the Supabase Dashboard UI or using the Supabase API, 
-- but here are the SQL commands if you have the storage schema enabled:

INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('property-images', 'gallery-images', 'hero-images'));
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
