import { Home, Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
          <Home className="w-5 h-5 text-primary" />
        </Button>
        
        <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
          <Search className="w-5 h-5 text-muted-foreground" />
        </Button>
      
        <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2 relative">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
        </Button>
        
        <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
          <User className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
    </nav>
  );
};