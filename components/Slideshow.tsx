"use client";

import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "./MapView";
import { useAppStore } from "@/lib/store";
import { terms } from "@/lib/terms";

export function Slideshow() {
  const { slides, currentSlideIndex, nextSlide, previousSlide, setCurrentView } =
    useAppStore();

  const currentSlide = slides[currentSlideIndex];

  if (!currentSlide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">
          {terms.errorGenerating}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">
            {terms.slideshowTitle}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {terms.slideOf
                .replace("{current}", String(currentSlideIndex + 1))
                .replace("{total}", String(slides.length))}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentView("graph")}
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              {terms.backToEdit}
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-12">
            {/* Title */}
            <h2 className="text-4xl font-bold text-slate-900 mb-8 border-b-4 border-blue-600 pb-4">
              {currentSlide.title}
            </h2>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Text Content */}
              <div className="space-y-4">
                <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {currentSlide.content}
                </p>
              </div>

              {/* Image or Map */}
              <div className="space-y-4">
                {currentSlide.imageUrl && (
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={currentSlide.imageUrl}
                      alt={currentSlide.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {currentSlide.location && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {currentSlide.location.name}
                    </h3>
                    <MapView
                      lat={currentSlide.location.lat}
                      lng={currentSlide.location.lng}
                      locationName={currentSlide.location.name}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t shadow-lg p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            onClick={previousSlide}
            disabled={currentSlideIndex === 0}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            {terms.previous}
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlideIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            size="lg"
            className="gap-2"
          >
            {terms.next}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
