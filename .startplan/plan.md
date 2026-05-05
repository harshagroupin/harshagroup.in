

# Harsha Group — Premium Commercial Real Estate Website

## Overview
A luxury, dark-themed, animated commercial real estate website for Harsha Group, Indirapuram, Ghaziabad. The site will feature a black + gold + white color palette, glassmorphism UI elements, smooth scroll animations, and a premium corporate feel targeting investors and high-end clients.

## Design System
- **Theme**: Dark luxury — deep black/charcoal backgrounds, gold (#D4AF37) accents, white text
- **Typography**: Inter for body, Playfair Display for headings (luxury serif contrast)
- **UI Style**: Glassmorphism cards (backdrop-blur, semi-transparent borders), subtle gold glows
- **Animations**: Scroll-triggered fade/slide reveals, parallax layers, hover zoom on cards, counter animations, infinite logo scroll

## Pages & Sections

### 1. Home Page (`/`)
- **Hero Section**: Full-screen animated gradient background with floating geometric gold shapes, heading "Premium Commercial Spaces That Drive Business Growth", subheading, two CTA buttons with gold glow hover effects
- **Featured Properties**: Horizontal scroll or grid of property cards with hover zoom + tilt effect
- **Why Choose Us**: 4 icon cards with animated reveal (Experience, Trust, Premium Locations, ROI)
- **Animated Statistics**: Counters (projects completed, sq ft delivered, happy clients, years experience)
- **Channel Partners Slider**: Infinite auto-scrolling logo strip (McDonald's, KFC, Burger King, Pizza Hut, Domino's — using text/styled placeholders)
- **Testimonials**: Carousel with client photos, names, feedback, animated star ratings
- **Contact Form Section**: Integrated form with Google Sheets submission
- **Footer**: Company info, quick links, social links, address

### 2. About Us (`/about`)
- Company overview with parallax image sections
- Mission & Vision cards with glassmorphism
- Experience timeline with scroll animations
- Team/office imagery sections

### 3. Office Space (`/office-space`)
- Filter bar (location, price range, size)
- Property listing cards with image, price, area, "Enquire Now" CTA
- Hover zoom and card animations

### 4. Shops & Outlet Space (`/shops`)
- Mall and retail space showcase
- Brand-focused visuals with leasing options
- Similar card layout with enquiry CTAs

### 5. Gallery (`/gallery`)
- Masonry/grid layout with AI-generated luxury commercial space images
- Lightbox modal with smooth open/close animations

### 6. Contact (`/contact`)
- Full contact form (Name, Phone, Email, Address, Message)
- Google Sheets integration via the provided Apps Script endpoint
- Map/address section for Harsha City Mall location
- Direct call & WhatsApp CTAs

## Global Elements
- **Sticky Navbar**: Dark glassmorphism navbar with gold accent on active link, mobile hamburger menu
- **WhatsApp Floating Button**: Bottom-right, animated pulse, links to `wa.me/918595540725`
- **Scroll Animations**: Using Intersection Observer for fade-in, slide-up, zoom reveals
- **Page Transitions**: Smooth fade transitions between routes
- **AI-Generated Images**: Hyper-realistic commercial space images generated via Lovable AI image generation for hero, properties, gallery, and about sections

## Technical Approach
- React Router for multi-page navigation
- Tailwind CSS for styling with custom gold/luxury color tokens
- Custom scroll animation hooks (Intersection Observer)
- Lazy loading for images
- Form submission to Google Sheets endpoint
- Fully responsive (mobile-first)

