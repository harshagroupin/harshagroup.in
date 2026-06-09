import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918448440725"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg animate-pulse-gold transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle size={22} className="fill-white" />
      <span className="hidden group-hover:inline text-sm font-medium whitespace-nowrap">Chat with us</span>
    </a>
  );
}
