-- ============================================
-- Harsha Heights CMS — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable storage for images
-- (Supabase Storage is already available; we just need the buckets)

-- 1. HERO SECTION CONTENT
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  heading text NOT NULL DEFAULT 'Premium Commercial Spaces That Drive Business Growth',
  subheading text NOT NULL DEFAULT 'Invest | Lease | Grow with Harsha Group — Your trusted partner for premium commercial real estate in Indirapuram.',
  image_url text,
  video_url text,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  cta_primary_text text DEFAULT 'Explore Properties',
  cta_secondary_text text DEFAULT 'Contact Now',
  updated_at timestamptz DEFAULT now()
);

-- Insert default row
INSERT INTO hero_content (heading, subheading)
VALUES (
  'Premium Commercial Spaces That Drive Business Growth',
  'Invest | Lease | Grow with Harsha Group — Your trusted partner for premium commercial real estate in Indirapuram.'
) ON CONFLICT DO NOTHING;

-- 2. FEATURED PROPERTIES
CREATE TABLE IF NOT EXISTS properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  location text NOT NULL,
  price text NOT NULL,
  area text NOT NULL,
  type text NOT NULL DEFAULT 'Office',
  category text NOT NULL DEFAULT 'office' CHECK (category IN ('office', 'shop')),
  image_url text,
  video_url text,
  description text,
  features text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert sample properties
INSERT INTO properties (title, location, price, area, type, category, is_featured, sort_order) VALUES
  ('Premium Office Suite A', 'Harsha City Mall, Indirapuram', '₹45,000/mo', '1,200 sq ft', 'Office', 'office', true, 1),
  ('Luxury Retail Outlet', 'Ground Floor, Harsha Mall', '₹80,000/mo', '800 sq ft', 'Shop', 'shop', true, 2),
  ('Corporate Office Tower', 'Shakti Khand 2, Ghaziabad', '₹1.2 Cr', '3,500 sq ft', 'Office', 'office', true, 3),
  ('Co-Working Space', 'Harsha Business Center', '₹25,000/mo', '500 sq ft', 'Office', 'office', true, 4),
  ('Executive Office Suite', 'Harsha City Mall, Floor 5', '₹55,000/mo', '1,500 sq ft', 'Premium', 'office', false, 5),
  ('Co-Working Hub', 'Harsha Business Center', '₹15,000/mo', '300 sq ft', 'Flexible', 'office', false, 6),
  ('Luxury Brand Outlet', 'Ground Floor, Harsha City Mall', '₹1.2 Cr', '1,000 sq ft', 'Sale', 'shop', false, 7),
  ('Food Court Space', 'Level 2, Harsha City Mall', '₹50,000/mo', '600 sq ft', 'Lease', 'shop', false, 8);

-- 3. GALLERY IMAGES
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. PAGE CONTENT (for about, stats, testimonials, partners)
CREATE TABLE IF NOT EXISTS page_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Insert default page content
INSERT INTO page_content (section_key, content) VALUES
  ('stats', '[
    {"label": "Projects Completed", "value": 50, "suffix": "+"},
    {"label": "Sq Ft Delivered", "value": 500000, "suffix": "+", "format": true},
    {"label": "Happy Clients", "value": 1200, "suffix": "+"},
    {"label": "Years Experience", "value": 15, "suffix": "+"}
  ]'::jsonb),
  ('partners', '["McDonald''s", "KFC", "Burger King", "Pizza Hut", "Domino''s", "Starbucks", "Subway", "Costa Coffee"]'::jsonb),
  ('testimonials', '[
    {"name": "Rajesh Sharma", "role": "Investor", "feedback": "Harsha Group delivered exceptional ROI on my commercial investment.", "rating": 5},
    {"name": "Priya Mehta", "role": "Business Owner", "feedback": "The retail space we leased has been transformative for our business.", "rating": 5},
    {"name": "Amit Gupta", "role": "Corporate Client", "feedback": "Outstanding office spaces with world-class amenities.", "rating": 5},
    {"name": "Sneha Kapoor", "role": "Franchise Owner", "feedback": "From site selection to handover, the entire process was seamless.", "rating": 4}
  ]'::jsonb),
  ('about', '{
    "heading": "A Legacy of Excellence",
    "paragraph1": "Harsha Group has been at the forefront of commercial real estate in Indirapuram, Ghaziabad for over 15 years.",
    "paragraph2": "Our flagship project, Harsha City Mall, stands as a testament to our commitment to quality, design, and value creation.",
    "paragraph3": "We partner with leading brands and businesses to create spaces that inspire growth, foster innovation."
  }'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- 5. ADMIN USERS (simple email-based auth)
-- We use Supabase Auth, so no separate table needed.
-- Just configure an admin email in Supabase Auth.

-- 5.5. INQUIRIES & FRACTIONAL INQUIRIES
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text,
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fractional_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  investment_budget text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. STORAGE BUCKETS
-- Run these in Supabase SQL Editor or create via Dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true);

-- 7. ROW LEVEL SECURITY (RLS)
-- Public read access for all CMS tables
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read hero" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);

-- Public can insert inquiries
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert fractional_inquiries" ON fractional_inquiries FOR INSERT WITH CHECK (true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Admin full access hero" ON hero_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access properties" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access page_content" ON page_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access fractional_inquiries" ON fractional_inquiries FOR ALL USING (auth.role() = 'authenticated');

-- Storage policies (run in SQL editor)
-- CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id IN ('property-images', 'gallery-images', 'hero-images'));
-- CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id IN ('property-images', 'gallery-images', 'hero-images'));
-- CREATE POLICY "Auth update storage" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated' AND bucket_id IN ('property-images', 'gallery-images', 'hero-images'));
-- CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated' AND bucket_id IN ('property-images', 'gallery-images', 'hero-images'));
