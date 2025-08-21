import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="px-4 py-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Buscar restaurantes ou pratos..."
          className="pl-10 h-12 bg-muted border-0 focus-visible:ring-primary"
        />
      </div>
    </div>
  );
};