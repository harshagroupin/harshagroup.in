import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { formatImageUrl } from '@/lib/utils';

// ──────────────────────────── Types ────────────────────────────
export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  type: string;
  category: 'office' | 'shop';
  image_url: string | null;
  video_url: string | null;
  description: string | null;
  features: string[] | null;
  is_featured: boolean;
  sort_order: number;
  display_location: 'homepage' | 'our_spaces' | 'none';
}

export interface GalleryImage {
  id: string;
  image_url: string;
  video_url: string | null;
  media_type: 'image' | 'video';
  alt_text: string;
  sort_order: number;
}

export interface HeroContent {
  id: string;
  heading: string;
  subheading: string;
  image_url: string | null;
  video_url: string | null;
  media_type: 'image' | 'video';
  cta_primary_text: string;
  cta_secondary_text: string;
}

export interface PageSection {
  id: string;
  section_key: string;
  content: any;
}

// ──────────────────────────── Auth ────────────────────────────
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

// ──────────────────────────── Properties ────────────────────────────
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('sort_order', { ascending: true });
  return { data: data as Property[] | null, error };
}

export async function fetchFeaturedProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  return { data: data as Property[] | null, error };
}

export async function upsertProperty(property: Partial<Property>) {
  if (property.id) {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...property, updated_at: new Date().toISOString() })
      .eq('id', property.id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select()
    .single();
  return { data, error };
}

export async function deleteProperty(id: string) {
  return supabase.from('properties').delete().eq('id', id);
}

// ──────────────────────────── Gallery ────────────────────────────
export async function fetchGalleryImages() {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('sort_order', { ascending: true });
  return { data: data as GalleryImage[] | null, error };
}

export async function addGalleryImage(image: Partial<GalleryImage>) {
  return supabase.from('gallery_images').insert(image).select().single();
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>) {
  return supabase.from('gallery_images').update(updates).eq('id', id).select().single();
}

export async function deleteGalleryImage(id: string) {
  return supabase.from('gallery_images').delete().eq('id', id);
}

// ──────────────────────────── Hero ────────────────────────────
export async function fetchHeroContent() {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .limit(1)
    .single();
  return { data: data as HeroContent | null, error };
}

export async function updateHeroContent(id: string, updates: Partial<HeroContent>) {
  return supabase
    .from('hero_content')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
}

// ──────────────────────────── Page Content ────────────────────────────
export async function fetchPageContent(sectionKey: string) {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('section_key', sectionKey)
    .single();
  return { data: data as PageSection | null, error };
}

export async function updatePageContent(sectionKey: string, content: any) {
  return supabase
    .from('page_content')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('section_key', sectionKey)
    .select()
    .single();
}

// ──────────────────────────── Image Upload ────────────────────────────
export async function uploadImage(bucket: string, file: File, path?: string) {
  const filePath = path || `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });
  if (error) return { url: null, error };
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { url: urlData.publicUrl, error: null };
}

export async function deleteStorageFile(bucket: string, path: string) {
  return supabase.storage.from(bucket).remove([path]);
}

// ──────────────────────────── Inquiries ────────────────────────────
export async function submitInquiry(inquiry: { name: string; phone: string; email: string; address?: string; message?: string }) {
  return supabase.from('inquiries').insert([inquiry]);
}

// ──────────────────────────── Dummy Image Resolver ────────────────────────────
import officeImg1 from "@/assets/office-space-1.jpg";
import officeImg2 from "@/assets/office-space-2.jpg";
import shopImg1 from "@/assets/shop-space-1.jpg";
import shopImg2 from "@/assets/shop-space-2.jpg";
import buildingImg from "@/assets/building-exterior.jpg";
import galleryImg1 from "@/assets/gallery-1.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";
import heroImg from "@/assets/hero-mall.jpg";

export function resolveImageUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url === 'DUMMY_OFFICE_1') return officeImg1;
  if (url === 'DUMMY_OFFICE_2') return officeImg2;
  if (url === 'DUMMY_SHOP_1') return shopImg1;
  if (url === 'DUMMY_SHOP_2') return shopImg2;
  if (url === 'DUMMY_BUILDING') return buildingImg;
  if (url === 'DUMMY_GALLERY_1') return galleryImg1;
  if (url === 'DUMMY_GALLERY_2') return galleryImg2;
  if (url === 'DUMMY_HERO') return heroImg;
  return formatImageUrl(url);
}

export { isSupabaseConfigured };
