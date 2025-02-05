import { useLocation } from "wouter";
import { Home, Search, List, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Compare", href: "/compare" },
  { icon: List, label: "List", href: "/list" },
  { icon: MapPin, label: "Stores", href: "/stores" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        {items.map(({ icon: Icon, label, href }) => (
          <button
            key={href}
            onClick={() => setLocation(href)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              "text-muted-foreground hover:text-primary transition-colors",
              location === href && "text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
