-- ============================================
-- Update Dummy Data
-- Run this in your Supabase SQL Editor
-- This populates the Admin Panel with editable dummy properties!
-- ============================================

-- Note: This deletes existing properties to replace them with complete dummy data.
DELETE FROM properties;

-- Insert Homepage properties
INSERT INTO properties (title, location, price, area, type, category, is_featured, sort_order, display_location, image_url) VALUES
('Premium Office Suite A', 'Harsha City Mall, Indirapuram', '₹45,000/mo', '1,200 sq ft', 'Office', 'office', true, 1, 'homepage', 'DUMMY_OFFICE_1'),
('Luxury Retail Outlet', 'Ground Floor, Harsha Mall', '₹80,000/mo', '800 sq ft', 'Shop', 'shop', true, 2, 'homepage', 'DUMMY_SHOP_1'),
('Corporate Office Tower', 'Shakti Khand 2, Ghaziabad', '₹1.2 Cr', '3,500 sq ft', 'Office', 'office', true, 3, 'homepage', 'DUMMY_BUILDING'),
('Co-Working Space', 'Harsha Business Center', '₹25,000/mo', '500 sq ft', 'Office', 'office', true, 4, 'homepage', 'DUMMY_OFFICE_2');

-- Insert Our Spaces properties
INSERT INTO properties (title, location, price, area, type, category, is_featured, sort_order, display_location, image_url) VALUES
('Executive Office Suite', 'Harsha City Mall, Floor 5', '₹55,000/mo', '1,500 sq ft', 'Premium', 'office', false, 1, 'our_spaces', 'DUMMY_OFFICE_1'),
('Co-Working Hub', 'Harsha Business Center', '₹15,000/mo', '300 sq ft', 'Flexible', 'office', false, 2, 'our_spaces', 'DUMMY_OFFICE_2'),
('Conference-Ready Office', 'Tower A, Shakti Khand 2', '₹75,000/mo', '2,200 sq ft', 'Corporate', 'office', false, 3, 'our_spaces', 'DUMMY_GALLERY_1'),
('Full Floor Office', 'Harsha City Mall, Floor 8', '₹2.5 Cr', '5,000 sq ft', 'Sale', 'office', false, 4, 'our_spaces', 'DUMMY_BUILDING'),
('Luxury Brand Outlet', 'Ground Floor, Harsha City Mall', '₹1.2 Cr', '1,000 sq ft', 'Sale', 'shop', false, 5, 'our_spaces', 'DUMMY_SHOP_1'),
('Food Court Space', 'Level 2, Harsha City Mall', '₹50,000/mo', '600 sq ft', 'Lease', 'shop', false, 6, 'our_spaces', 'DUMMY_SHOP_2'),
('Anchor Store Space', 'Harsha City Mall', '₹3.5 Cr', '4,000 sq ft', 'Sale', 'shop', false, 7, 'our_spaces', 'DUMMY_HERO'),
('Fashion Retail Outlet', 'Level 1, Harsha Mall', '₹65,000/mo', '750 sq ft', 'Lease', 'shop', false, 8, 'our_spaces', 'DUMMY_GALLERY_2');
