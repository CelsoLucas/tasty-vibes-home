import { Home, Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl px-6 py-3 shadow-xl backdrop-blur-lg">
        <div className="flex items-center justify-around max-w-xs mx-auto">
          <Button variant="ghost" size="icon" className="relative p-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
          </Button>
          
          <Button variant="ghost" size="icon" className="p-3">
            <Search className="w-5 h-5 text-gray-400" />
          </Button>
        
          <Button variant="ghost" size="icon" className="p-3">
            <Plus className="w-5 h-5 text-gray-400" />
          </Button>
          
          <Button variant="ghost" size="icon" className="p-3">
            <User className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
      </div>
    </nav>
  );
};