import { create } from 'zustand';

export interface SlideData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageSearchTerm?: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AppState {
  // View state
  currentView: 'chat' | 'graph' | 'slideshow';
  setCurrentView: (view: 'chat' | 'graph' | 'slideshow') => void;
  
  // Chat state
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  
  // Slides state
  slides: SlideData[];
  setSlides: (slides: SlideData[]) => void;
  updateSlide: (id: string, updates: Partial<SlideData>) => void;
  
  // Slideshow state
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // View state
  currentView: 'chat',
  setCurrentView: (view) => set({ currentView: view }),
  
  // Chat state
  messages: [],
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  clearMessages: () => set({ messages: [] }),
  
  // Slides state
  slides: [],
  setSlides: (slides) => set({ slides }),
  updateSlide: (id, updates) => set((state) => ({
    slides: state.slides.map((slide) =>
      slide.id === id ? { ...slide, ...updates } : slide
    ),
  })),
  
  // Slideshow state
  currentSlideIndex: 0,
  setCurrentSlideIndex: (index) => set({ currentSlideIndex: index }),
  nextSlide: () => set((state) => {
    const maxIndex = state.slides.length - 1;
    return {
      currentSlideIndex: Math.min(state.currentSlideIndex + 1, maxIndex),
    };
  }),
  previousSlide: () => set((state) => ({
    currentSlideIndex: Math.max(state.currentSlideIndex - 1, 0),
  })),
}));
