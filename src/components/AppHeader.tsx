import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo.png";

export const AppHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <img src={logoImage} alt="Restaurant App" className="w-10 h-10" />
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Tasty
        </h1>
      </div>
      
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5 text-foreground" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card"></div>
      </Button>
    </header>
  );
};