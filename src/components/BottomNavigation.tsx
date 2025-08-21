import { Home, Search, Plus, User } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'add', icon: Plus, label: 'Add' },
  { id: 'profile', icon: User, label: 'Profile' }
];

export const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('home');

  const getTabIndex = (tabId: string) => tabs.findIndex(tab => tab.id === tabId);
  const activeIndex = getTabIndex(activeTab);

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-3xl px-6 py-3 shadow-lg shadow-gray-900/10">
        {/* Bubble indicator */}
        <div 
          className="absolute top-2 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl transition-transform duration-500 ease-out-back shadow-lg shadow-orange-500/25"
          style={{
            transform: `translateX(${activeIndex * 60}px)`,
          }}
        />
        
        {/* Tab buttons */}
        <div className="relative flex items-center gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ease-out-back group"
              >
                {/* Icon */}
                <IconComponent 
                  className={`transition-all duration-300 ease-out-back ${
                    isActive 
                      ? 'w-6 h-6 text-white scale-110' 
                      : 'w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:scale-105'
                  }`}
                />
                
                {/* Label */}
                <span 
                  className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive 
                      ? 'opacity-100 translate-y-0 text-orange-600 dark:text-orange-400' 
                      : 'opacity-0 translate-y-1 text-transparent pointer-events-none'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};