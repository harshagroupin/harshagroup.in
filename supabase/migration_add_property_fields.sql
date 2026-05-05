-- ============================================
-- Migration: Add video_url, description, features to properties
-- Run this in your Supabase SQL Editor if your
-- database already has the properties table.
-- ============================================

ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';
