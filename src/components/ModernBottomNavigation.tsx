import { Home, Search, Plus, User, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { InteractiveMenu, InteractiveMenuItem } from "@/components/ui/modern-mobile-menu";

const navigationItems: InteractiveMenuItem[] = [
  { label: 'Início', icon: Home, path: '/' },
  { label: 'Buscar', icon: Search, path: '/search' },
  { label: 'Matching', icon: Heart, path: '/matching' },
  { label: 'Adicionar', icon: Plus, path: '/add-review' },
  { label: 'Perfil', icon: User, path: '/profile' }
];

export const ModernBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active index based on current route
  useEffect(() => {
    const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  const handleItemClick = (item: InteractiveMenuItem, index: number) => {
    setActiveIndex(index);
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <InteractiveMenu 
      items={navigationItems}
      accentColor="hsl(var(--primary))"
      onItemClick={handleItemClick}
    />
  );
};