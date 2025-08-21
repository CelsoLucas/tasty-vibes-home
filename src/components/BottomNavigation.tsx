import { Home, Search, Plus, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const tabs = [
  { id: 'home', icon: Home, label: 'Início', path: '/' },
  { id: 'search', icon: Search, label: 'Buscar', path: '/search' },
  { id: 'add', icon: Plus, label: 'Adicionar', path: '/add' },
  { id: 'profile', icon: User, label: 'Perfil', path: '/profile' }
];

export const BottomNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  // Update active tab based on current route
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  const getTabIndex = (tabId: string) => tabs.findIndex(tab => tab.id === tabId);
  const activeIndex = getTabIndex(activeTab);

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-3xl px-8 py-4 shadow-lg shadow-gray-900/10">
        {/* Bubble indicator */}
        <div 
          className="absolute top-2 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-transform duration-300 ease-in-out shadow-lg shadow-orange-500/25"
          style={{
            transform: `translateX(${activeIndex * 64 - 4}px)`,
          }}
        />
        
        {/* Tab buttons */}
        <div className="relative flex items-center justify-center gap-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            
            return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Navigate to the corresponding route
                    if (tab.path) {
                      window.location.href = tab.path;
                    }
                  }}
                  className={`relative flex flex-col items-center group ${
                    isActive ? 'justify-start w-10 h-16' : 'justify-center w-10 h-10'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10">
                    <IconComponent 
                      className={`transition-colors duration-200 ${
                        isActive 
                          ? 'w-6 h-6 text-white' 
                          : 'w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }`}
                    />
                  </div>
                  
                  {/* Label - only show when active */}
                  {isActive && (
                    <span className="mt-1 text-xs font-medium whitespace-nowrap text-orange-600 dark:text-orange-400 animate-fade-in">
                      {tab.label}
                    </span>
                  )}
                </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};