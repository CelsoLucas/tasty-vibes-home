import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Search, QrCode, Star, Camera, X } from "lucide-react";

const experienceTags = [
  { id: "atendimento", label: "Atendimento", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { id: "comida", label: "Comida", color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { id: "ambiente", label: "Ambiente", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { id: "custo-beneficio", label: "Custo-benefício", color: "bg-orange-100 text-orange-800 hover:bg-orange-200" }
];

const AddReviewPage = () => {
  const [restaurant, setRestaurant] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPhotos = [...photos, ...files].slice(0, 5); // Limit to 5 photos
      setPhotos(newPhotos);
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPhotoPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Clean up the removed URL
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de envio da avaliação
    console.log({
      restaurant,
      rating,
      comment,
      selectedTags,
      photos: photos.length
    });
  };

  const handleQRScan = () => {
    // TODO: Implementar scanner de QR Code
    console.log("QR Code scanner opened");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <AppHeader />
      
      {/* Campo de busca do restaurante */}
      <div className="p-4 bg-background border-b border-border">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar restaurante..."
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              className="pl-10 pr-4 h-12 bg-card border-border"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleQRScan}
            className="h-12 w-12 border-border"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conteúdo da avaliação */}
      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avaliação com estrelas */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Sua avaliação</h3>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {rating === 1 && "Muito ruim"}
                  {rating === 2 && "Ruim"}
                  {rating === 3 && "Regular"}
                  {rating === 4 && "Bom"}
                  {rating === 5 && "Excelente"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Comentário */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Comentário</h3>
              <Textarea
                placeholder="Compartilhe sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Adicionar fotos */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Fotos</h3>
              
              {/* Preview das fotos */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Botão adicionar fotos */}
              {photos.length < 5 && (
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Adicionar fotos ({photos.length}/5)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Tags de experiência */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Experiência</h3>
              <div className="flex flex-wrap gap-2">
                {experienceTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag.id) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botão publicar */}
          <Button 
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
            disabled={!restaurant || rating === 0}
          >
            Publicar Avaliação
          </Button>
        </form>
      </div>

      {/* Menu inferior */}
      <BottomNavigation />
    </div>
  );
};

export default AddReviewPage;