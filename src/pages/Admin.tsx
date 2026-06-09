import { useState, useEffect } from "react";
import { getSession, signOut, isSupabaseConfigured } from "@/lib/cms";
import AdminLogin from "@/components/admin/AdminLogin";
import PropertiesManager from "@/components/admin/PropertiesManager";
import OurSpacesManager from "@/components/admin/OurSpacesManager";
import GalleryManager from "@/components/admin/GalleryManager";
import HeroManager from "@/components/admin/HeroManager";
import PageContentManager from "@/components/admin/PageContentManager";
import FractionalModelManager from "@/components/admin/FractionalModelManager";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ImageIcon,
  Sparkles,
  FileText,
  LogOut,
  Loader2,
  AlertTriangle,
  Home,
  LayoutGrid,
  PieChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";

type Tab = "properties" | "our_spaces" | "gallery" | "hero" | "content" | "fractional";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "our_spaces", label: "Our Spaces", icon: LayoutGrid },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "hero", label: "Hero Section", icon: Sparkles },
  { key: "content", label: "Page Content", icon: FileText },
  { key: "fractional", label: "Fractional Model", icon: PieChart },
];

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("properties");

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured) {
        setChecking(false);
        return;
      }
      const { data } = await getSession();
      if (data?.session) {
        setAuthenticated(true);
      }
      setChecking(false);
    })();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setAuthenticated(false);
  };

  // Not configured state
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertTriangle size={28} className="text-destructive" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-3">Supabase Not Configured</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Create a <code className="text-primary">.env</code> file in the project root with:
          </p>
          <div className="glass rounded-xl p-4 text-left text-sm font-mono">
            <div className="text-primary">VITE_SUPABASE_URL</div>
            <div className="text-muted-foreground mb-2">=https://your-project.supabase.co</div>
            <div className="text-primary">VITE_SUPABASE_ANON_KEY</div>
            <div className="text-muted-foreground">=your-anon-key</div>
          </div>
          <Link to="/">
            <Button variant="outline" className="mt-6 gap-2 border-primary/30">
              <Home size={16} /> Back to Website
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Checking auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // Not authenticated
  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
              <Building2 size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold leading-tight">
                Harsha <span className="gold-text">CMS</span>
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Content Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 text-xs">
                <Home size={14} /> View Site
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
            >
              <LogOut size={14} /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "gold-gradient text-primary-foreground gold-glow-sm"
                  : "glass text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "properties" && <PropertiesManager />}
        {activeTab === "our_spaces" && <OurSpacesManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "hero" && <HeroManager />}
        {activeTab === "content" && <PageContentManager />}
        {activeTab === "fractional" && <FractionalModelManager />}
      </div>
    </div>
  );
}
