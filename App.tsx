import React, { useState, useRef, useLayoutEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GlobeScene } from './components/GlobeScene';
import { Overlay } from './components/Overlay';
import { CarouselItem, LightboxState } from './types';
import gsap from 'gsap';

// Generate items for the globe
const generateItems = (count: number): CarouselItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    // Use a deterministic pseudo-random seed based on index
    const seed = (i + 1) * 0.123;
    const r = seed - Math.floor(seed);
    
    // Standardized sizes to look like "straight" cards
    // Mix of 1:1, 4:3 and 3:4
    let width = 1.8;
    let height = 1.8;

    if (r < 0.3) {
      // Landscape
      width = 2.4;
      height = 1.6;
    } else if (r < 0.6) {
      // Portrait
      width = 1.6;
      height = 2.4;
    }

    // High res for clear textures
    const wPx = Math.floor(width * 300);
    const hPx = Math.floor(height * 300);
  
    return {
      id: `init-${i}`,
      url: `https://picsum.photos/seed/${i + 700}/${wPx}/${hPx}`,
      title: `Image ${i + 1}`,
      isGenerated: false,
      width,
      height
    };
  });
};

const INITIAL_ITEMS = generateItems(140); // Dense, rich globe

const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#5E3A28] border-t-transparent rounded-full animate-spin"></div>
      <div className="text-[#5E3A28] font-bold text-xs tracking-[0.2em] uppercase">Loading Experience</div>
    </div>
  </Html>
);

const App: React.FC = () => {
  const [items] = useState<CarouselItem[]>(INITIAL_ITEMS);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    activeItem: null,
    initialBounds: null
  });
  
  const lightboxRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (item: CarouselItem, bounds: { x: number; y: number; width: number; height: number }) => {
    setLightbox({
      isOpen: true,
      activeItem: item,
      initialBounds: {
        top: bounds.y,
        left: bounds.x,
        width: bounds.width,
        height: bounds.height
      }
    });
  };

  const closeLightbox = () => {
    if (!lightbox.initialBounds || !lightboxRef.current) {
      setLightbox(prev => ({ ...prev, isOpen: false }));
      return;
    }

    setLightbox(prev => ({ ...prev, isOpen: false }));

    if (textRef.current) {
      gsap.to(textRef.current, { opacity: 0, y: 10, duration: 0.2, ease: "power2.in" });
    }
    if (closeBtnRef.current) {
      gsap.to(closeBtnRef.current, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.in" });
    }

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut"
    });

    gsap.to(lightboxRef.current, {
      top: lightbox.initialBounds.top,
      left: lightbox.initialBounds.left,
      width: lightbox.initialBounds.width,
      height: lightbox.initialBounds.height,
      borderRadius: '2px',
      opacity: 0, 
      duration: 0.6,
      ease: "expo.inOut",
      onComplete: () => {
        setLightbox(prev => ({ ...prev, activeItem: null }));
      }
    });

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "expo.inOut"
      });
    }
  };

  useLayoutEffect(() => {
    if (lightbox.isOpen && lightbox.activeItem && lightbox.initialBounds && lightboxRef.current && backdropRef.current) {
      
      gsap.set(backdropRef.current, { opacity: 0 });
      
      if (textRef.current) gsap.set(textRef.current, { opacity: 0, y: 20 });
      if (closeBtnRef.current) gsap.set(closeBtnRef.current, { opacity: 0, scale: 0.8 });
      
      gsap.set(lightboxRef.current, {
        position: 'fixed',
        top: lightbox.initialBounds.top,
        left: lightbox.initialBounds.left,
        width: lightbox.initialBounds.width,
        height: lightbox.initialBounds.height,
        opacity: 1,
        borderRadius: '2px',
        zIndex: 50,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transformOrigin: "center center",
        overflow: 'hidden'
      });

      if (imgRef.current) {
        gsap.set(imgRef.current, { scale: 1 });
      }

      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });

      const aspect = lightbox.activeItem.width / lightbox.activeItem.height;
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.9;
      
      let targetWidth = maxWidth;
      let targetHeight = targetWidth / aspect;

      if (targetHeight > maxHeight) {
        targetHeight = maxHeight;
        targetWidth = targetHeight * aspect;
      }

      const targetTop = (window.innerHeight - targetHeight) / 2;
      const targetLeft = (window.innerWidth - targetWidth) / 2;

      gsap.to(lightboxRef.current, {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        borderRadius: '4px',
        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
        duration: 0.8,
        ease: "expo.inOut" 
      });

      if (imgRef.current) {
        gsap.fromTo(imgRef.current, 
          { scale: 1.1 }, 
          { 
            scale: 1.0,
            duration: 1.0, 
            ease: "expo.out",
            delay: 0 
          }
        );
      }

      if (textRef.current) {
         gsap.to(textRef.current, { 
           opacity: 1, 
           y: 0, 
           duration: 0.6, 
           delay: 0.4, 
           ease: "power2.out" 
         });
      }
      if (closeBtnRef.current) {
         gsap.to(closeBtnRef.current, { 
           opacity: 1, 
           scale: 1, 
           duration: 0.4, 
           delay: 0.5, 
           ease: "back.out(1.7)" 
         });
      }
    }
  }, [lightbox.isOpen, lightbox.activeItem, lightbox.initialBounds]);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[#F5E6D8]">
      {/* Background color: Warm Beige #F5E6D8 to match design */}
      
      <div className={`absolute inset-0 z-0 transition-all duration-700 ease-out ${lightbox.isOpen ? 'blur-md scale-95 opacity-50 grayscale' : ''}`}>
        <Canvas dpr={[1, 2]} shadows>
          <Suspense fallback={<Loader />}>
            <GlobeScene 
              items={items} 
              onItemClick={handleItemClick}
            />
          </Suspense>
        </Canvas>
      </div>

      <Overlay />

      {(lightbox.isOpen || lightbox.activeItem) && (
        <>
          <div 
            ref={backdropRef}
            onClick={closeLightbox}
            className="fixed inset-0 bg-[#3A2820]/90 z-40 cursor-zoom-out backdrop-blur-sm"
          />

          <div 
            ref={lightboxRef}
            onClick={closeLightbox}
            className="fixed overflow-hidden z-50 cursor-zoom-out bg-[#F5E6D8]"
            style={{ opacity: 0 }} 
          >
            {lightbox.activeItem && (
              <img 
                ref={imgRef}
                src={lightbox.activeItem.url} 
                alt={lightbox.activeItem.title}
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            )}
            
            {lightbox.activeItem && (
              <div 
                ref={closeBtnRef}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-2 transition-all z-50 border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;