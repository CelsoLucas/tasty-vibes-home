import { Search } from "lucide-react";
import { AnimatedInput } from "@/components/ui/animated-input";

export const SearchBar = () => {
  return (
    <div className="px-4 py-3">
      <AnimatedInput
        label="Buscar restaurantes ou pratos..."
        leftIcon={<Search className="w-4 h-4" />}
        className="bg-muted/50"
        size="sm"
      />
    </div>
  );
};