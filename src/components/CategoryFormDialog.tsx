import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateMenuCategory, useUpdateMenuCategory } from "@/hooks/useRestaurants";
import { MenuCategory } from "@/hooks/useRestaurants";

const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  displayOrder: z.number().min(0, "Ordem deve ser um número positivo").optional()
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  children: React.ReactNode;
  restaurantId: string;
  category?: MenuCategory;
  onSuccess?: () => void;
}

export const CategoryFormDialog = ({ 
  children, 
  restaurantId, 
  category, 
  onSuccess 
}: CategoryFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createMutation = useCreateMenuCategory();
  const updateMutation = useUpdateMenuCategory();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      displayOrder: category?.display_order || 0
    }
  });

  const isEditing = !!category;
  const mutation = isEditing ? updateMutation : createMutation;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await updateMutation.mutateAsync({
          categoryId: category.id,
          restaurantId,
          name: data.name,
          displayOrder: data.displayOrder
        });
        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso."
        });
      } else {
        await createMutation.mutateAsync({
          restaurantId,
          name: data.name,
          displayOrder: data.displayOrder
        });
        toast({
          title: "Categoria criada",
          description: "A nova categoria foi criada com sucesso."
        });
      }
      
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Massas, Pizzas, Bebidas"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="displayOrder">Ordem de Exibição</Label>
            <Input
              id="displayOrder"
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.displayOrder && (
              <p className="text-sm text-destructive mt-1">{errors.displayOrder.message}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Salvando..." : (isEditing ? "Atualizar" : "Criar")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};