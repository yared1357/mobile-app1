import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const PROMPTS = [
  "Cinematic shot of a minimalist desk with a mechanical watch and a notebook, representing time management, soft morning light.",
  "Abstract digital art of a glowing hourglass with floating geometric shapes, representing productivity and flow.",
  "A serene mountain landscape at dawn with a single path leading to the summit, representing long-term goals and vision.",
  "Modern architectural office space with large windows and plants, clean and inspiring atmosphere for work.",
  "A futuristic city skyline at night with neon lights, representing innovation and big dreams.",
  "Close-up of a cup of coffee next to a tablet showing a clean calendar, representing a fresh start to the day.",
  "A library with floor-to-ceiling bookshelves and a ladder, representing knowledge and continuous learning."
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000"
];

export const ProductivitySlider = () => {
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Auto-scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const fetchImages = async () => {
      const savedImages = localStorage.getItem('chronos_productivity_images');
      if (savedImages) {
        setImages(JSON.parse(savedImages));
        setLoading(false);
        return;
      }

      // If no API key, we just stay with fallbacks
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'undefined') {
        setLoading(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const generatedImages: string[] = [];

        // Generate in parallel to be faster
        const promises = PROMPTS.map(async (prompt) => {
          try {
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts: [{ text: prompt }] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
              }
            }
          } catch (e) {
            console.error("Single image generation failed", e);
          }
          return null;
        });

        const results = await Promise.all(promises);
        const validImages = results.filter((img): img is string => img !== null);

        if (validImages.length > 0) {
          setImages(validImages);
          localStorage.setItem('chronos_productivity_images', JSON.stringify(validImages));
        }
      } catch (err) {
        console.error("Error generating images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="relative w-full h-[120px] rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-sm group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="p-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="p-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loading && images === FALLBACK_IMAGES && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/30 backdrop-blur-[2px] z-30">
          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
        </div>
      )}
      
      <div className="absolute bottom-3 right-4 flex gap-1 z-10">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`h-0.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-3 bg-white' : 'w-1 bg-white/40'}`} 
          />
        ))}
      </div>
    </div>
  );
};
