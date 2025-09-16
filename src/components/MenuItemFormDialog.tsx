import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateMenuItem, useUpdateMenuItem } from "@/hooks/useRestaurants";
import { MenuItem } from "@/hooks/useRestaurants";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

const itemSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  price: z.number().min(0.01, "Preço deve ser maior que zero"),
  isAvailable: z.boolean().default(true)
});

type ItemFormData = z.infer<typeof itemSchema>;

interface MenuItemFormDialogProps {
  children: React.ReactNode;
  restaurantId: string;
  item?: MenuItem;
  onSuccess?: () => void;
}

export const MenuItemFormDialog = ({ 
  children, 
  restaurantId, 
  item,
  onSuccess 
}: MenuItemFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      isAvailable: item?.is_available ?? true
    }
  });

  const isEditing = !!item;
  const mutation = isEditing ? updateMutation : createMutation;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${restaurantId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, imageFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ItemFormData) => {
    try {
      let imageUrl = item?.image_url || null;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      if (isEditing && item) {
        await updateMutation.mutateAsync({
          itemId: item.id,
          restaurantId,
          name: data.name,
          description: data.description,
          price: data.price,
          isAvailable: data.isAvailable,
          imageUrl: imageUrl || undefined
        });
        toast({
          title: "Item atualizado",
          description: "O item foi atualizado com sucesso."
        });
      } else {
        await createMutation.mutateAsync({
          restaurantId,
          name: data.name,
          description: data.description,
          price: data.price,
          isAvailable: data.isAvailable,
          imageUrl: imageUrl || undefined
        });
        toast({
          title: "Item criado",
          description: "O novo item foi criado com sucesso."
        });
      }
      
      setOpen(false);
      reset();
      setImageFile(null);
      setImagePreview(null);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Item" : "Novo Item do Cardápio"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Item</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Spaghetti Carbonara"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva os ingredientes e características do prato"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
            )}
          </div>
          
          <div>
            <Label>Imagem do Item</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-32 h-32 border-dashed flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-xs">Adicionar Imagem</span>
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              {...register("isAvailable")}
              defaultChecked={watch("isAvailable")}
              onCheckedChange={(checked) => setValue("isAvailable", checked)}
            />
            <Label htmlFor="isAvailable">Item disponível</Label>
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
              disabled={mutation.isPending || uploadingImage}
            >
              {mutation.isPending || uploadingImage 
                ? "Salvando..." 
                : (isEditing ? "Atualizar" : "Criar")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};