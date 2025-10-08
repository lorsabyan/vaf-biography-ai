"use client";

import { useState, useEffect } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppStore, SlideData } from "@/lib/store";
import { terms } from "@/lib/terms";

interface SlideEditorProps {
  slide: SlideData;
  isOpen: boolean;
  onClose: () => void;
}

interface ImageResult {
  url: string;
  title: string;
  source: string;
}

export function SlideEditor({ slide, isOpen, onClose }: SlideEditorProps) {
  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [selectedImage, setSelectedImage] = useState(slide.imageUrl || "");
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const { updateSlide } = useAppStore();

  useEffect(() => {
    if (isOpen && slide.imageSearchTerm) {
      loadImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, slide.imageSearchTerm]);

  const loadImages = async () => {
    if (!slide.imageSearchTerm) return;
    
    setIsLoadingImages(true);
    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm: slide.imageSearchTerm }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error loading images:", error);
      setImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSave = () => {
    updateSlide(slide.id, {
      title,
      content,
      imageUrl: selectedImage,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{terms.editSlide}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{terms.slideTitle}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{terms.slideContent}</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] text-base"
            />
          </div>

          {/* Image Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{terms.selectImage}</label>
            {isLoadingImages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                      selectedImage === image.url
                        ? "border-blue-600 shadow-lg"
                        : "border-transparent hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-32 object-cover"
                    />
                    {selectedImage === image.url && (
                      <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {terms.noImages}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {terms.cancel}
          </Button>
          <Button onClick={handleSave}>{terms.saveChanges}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
