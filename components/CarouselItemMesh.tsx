import React, { ReactNode, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import gsap from 'gsap';

// Extend JSX.IntrinsicElements with R3F types to fix property existence errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      boxGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary Component to catch texture loading errors
class ImageErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface CarouselItemMeshProps {
  url: string;
  title: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  onClick: (data: { x: number; y: number; width: number; height: number }) => void;
}

export const CarouselItemMesh = ({ 
  url, 
  title, 
  position, 
  rotation, 
  width,
  height,
  onClick 
}: CarouselItemMeshProps) => {
  const HOVER_RISE_Z = 1.26;
  const HOVER_SCALE_BOOST = 0.06;
  const HOVER_UP_DURATION = 0.24;
  const HOVER_HOLD_DURATION = 0.12;
  const HOVER_DOWN_DURATION = 0.66;

  // We use a separate ref for the visual part that moves
  const visualRef = useRef<THREE.Group>(null);
  // The parent group stays static for the hitbox
  const groupRef = useRef<THREE.Group>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  
  const { camera, size } = useThree();

  useEffect(() => {
    return () => {
      hoverTimelineRef.current?.kill();
    };
  }, []);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!groupRef.current) return;

    // Calculate Screen Bounds for the transition from the STATIC hitbox position
    // This ensures consistent starting bounds for the animation
    groupRef.current.updateWorldMatrix(true, false);
    
    // Get center position in screen coords
    const center = new THREE.Vector3(0, 0, 0);
    center.applyMatrix4(groupRef.current.matrixWorld);
    center.project(camera);

    // Get a corner position to estimate size
    const corner = new THREE.Vector3(width / 2, height / 2, 0);
    corner.applyMatrix4(groupRef.current.matrixWorld);
    corner.project(camera);

    // Convert to pixels
    const x = (center.x * 0.5 + 0.5) * size.width;
    const y = (-(center.y * 0.5) + 0.5) * size.height;
    
    const cornerX = (corner.x * 0.5 + 0.5) * size.width;
    const cornerY = (-(corner.y * 0.5) + 0.5) * size.height;

    const w = Math.abs(cornerX - x) * 2;
    const h = Math.abs(cornerY - y) * 2;

    onClick({
      x: x - w / 2,
      y: y - h / 2,
      width: w,
      height: h
    });
  };

  const handlePointerEnter = (_e: ThreeEvent<PointerEvent>) => {
    if (!groupRef.current || !visualRef.current) return;
    document.body.style.cursor = 'pointer';

    const targetScale = 1 + HOVER_SCALE_BOOST;
    hoverTimelineRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: {
        overwrite: 'auto'
      }
    });
    timeline.to(visualRef.current.position, {
      z: HOVER_RISE_Z,
      duration: HOVER_UP_DURATION,
      ease: 'power3.out'
    });
    timeline.to(visualRef.current.position, {
      z: HOVER_RISE_Z,
      duration: HOVER_HOLD_DURATION
    });
    timeline.to(visualRef.current.position, {
      z: 0,
      duration: HOVER_DOWN_DURATION,
      ease: 'power2.out'
    });
    timeline.to(
      visualRef.current.scale,
      {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: HOVER_UP_DURATION,
        ease: 'power3.out'
      },
      0
    );
    timeline.to(
      visualRef.current.scale,
      {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: HOVER_HOLD_DURATION
      },
      HOVER_UP_DURATION
    );
    timeline.to(
      visualRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: HOVER_DOWN_DURATION,
        ease: 'power2.out'
      },
      HOVER_UP_DURATION + HOVER_HOLD_DURATION
    );

    hoverTimelineRef.current = timeline;
  };

  const handlePointerLeave = (_e: ThreeEvent<PointerEvent>) => {
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* 
        HITBOX: Invisible mesh that handles events. 
        It stays static so the mouse doesn't "fall off" during animation.
      */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial visible={false} side={THREE.DoubleSide} depthWrite={false} depthTest={false} />
      </mesh>

      {/* 
        VISUALS: The actual image mesh that animates.
      */}
      <group ref={visualRef}>
        {/* Image Texture */}
        <ImageErrorBoundary
          fallback={
            <mesh>
              <planeGeometry args={[width, height]} />
              <meshStandardMaterial color="#334155" side={THREE.DoubleSide} />
            </mesh>
          }
        >
          <Image 
            url={url} 
            transparent={false}
            side={THREE.DoubleSide}
            scale={[width, height]} 
            toneMapped={false}
            depthTest
            depthWrite
            renderOrder={2}
          />
        </ImageErrorBoundary>
      </group>
    </group>
  );
};
