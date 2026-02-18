import React, { ReactNode, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import { Image } from '@react-three/drei';

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
  // We use a separate ref for the visual part that moves
  const visualRef = useRef<THREE.Group>(null);
  // The parent group stays static for the hitbox
  const groupRef = useRef<THREE.Group>(null);
  
  const { camera, size } = useThree();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (visualRef.current) {
      // Hover Effect: 
      // Lift the VISUAL mesh only. The Hitbox (parent group) stays put.
      const targetZ = hovered ? 1.2 : 0; // Move forward in local Z space
      const targetScale = hovered ? 1.05 : 1.0;
      
      // Smoothly interpolate Z position
      visualRef.current.position.z = THREE.MathUtils.lerp(visualRef.current.position.z, targetZ, delta * 8);
      
      // Smoothly interpolate scale
      const currentScale = visualRef.current.scale.x; 
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 8);
      visualRef.current.scale.setScalar(nextScale);
    }
  });

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

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation(); 
    if (!groupRef.current) return;
    setHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    setHover(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
    >
      {/* 
        HITBOX: Invisible mesh that handles events. 
        It stays static so the mouse doesn't "fall off" during animation.
      */}
      <mesh 
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial visible={false} side={THREE.DoubleSide} />
      </mesh>

      {/* 
        VISUALS: The actual image mesh + backing box that animates.
      */}
      <group ref={visualRef}>
        
        {/* Physical Backing for Depth */}
        <mesh position={[0, 0, -0.05]}>
           <boxGeometry args={[width, height, 0.1]} />
           <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
        </mesh>

        {/* Image Texture */}
        <ImageErrorBoundary
          fallback={
            <mesh>
              <planeGeometry args={[width, height]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          }
        >
          <Image 
            url={url} 
            transparent 
            side={THREE.FrontSide}
            scale={[width, height]} 
            toneMapped={false}
          />
        </ImageErrorBoundary>
      </group>
    </group>
  );
};