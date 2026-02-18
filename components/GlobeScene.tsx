import React, { useRef, useMemo } from 'react';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CarouselItemMesh } from './CarouselItemMesh';
import { CarouselItem } from '../types';

// Extend JSX.IntrinsicElements with R3F types to fix property existence errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      spotLight: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
    }
  }
}

interface GlobeSceneProps {
  items: CarouselItem[];
  onItemClick: (item: CarouselItem, bounds: { x: number; y: number; width: number; height: number }) => void;
}

export const GlobeScene = ({ items, onItemClick }: GlobeSceneProps) => {
  const containerRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Radius of the image placement
  const radius = 13.5;

  // Calculate positions on a uniform Fibonacci Sphere
  const itemPositions = useMemo(() => {
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    return items.map((item, i) => {
      const y = 1 - (i / (items.length - 1)) * 2; // y goes from 1 to -1
      const r = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * r * radius;
      const yPos = y * radius;
      const z = Math.sin(theta) * r * radius;

      const position = new THREE.Vector3(x, yPos, z);
      
      const dummy = new THREE.Object3D();
      dummy.position.copy(position);
      dummy.lookAt(position.clone().multiplyScalar(2)); // Face outward

      return {
        ...item,
        pos: position,
        rot: dummy.rotation.clone()
      };
    });
  }, [items]);

  // Rig for subtle mouse parallax
  useFrame((state) => {
    if (cameraRef.current) {
        // Subtle parallax based on mouse position
        const mx = state.mouse.x * 2;
        const my = state.mouse.y * 2;
        
        // Smoothly lerp camera position slight offset
        cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, mx, 0.05);
        cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, my, 0.05);
        cameraRef.current.lookAt(0, 0, 0);
    }
    
    // Constant slow rotation of the globe
    if (containerRef.current) {
        containerRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={[0, 0, 44]} 
        fov={38} 
      />

      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={true}
        rotateSpeed={0.4}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3} // Restrict vertical angle
        maxPolarAngle={Math.PI / 1.5}
      />
      
      {/* Lighting: Warm Cinematic Setup */}
      <ambientLight intensity={0.8} color="#FFF5E0" />
      <directionalLight 
        position={[10, 20, 15]} 
        intensity={1.2} 
        color="#FFF" 
        castShadow 
      />
      <spotLight 
        position={[-20, 0, 20]} 
        intensity={0.8} 
        color="#E6C7A8" 
        angle={0.5} 
        penumbra={1} 
      />
      
      <Environment preset="apartment" environmentIntensity={0.6} />

      {/* Background Environment Lines */}
      <group>
        {/* Large Outer Sphere Lines */}
        <mesh rotation={[Math.PI / 8, Math.PI / 6, 0]}>
          <sphereGeometry args={[50, 24, 24]} />
          <meshBasicMaterial 
            color="#3A2820" 
            wireframe 
            transparent 
            opacity={0.03} 
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Middle Sphere Lines */}
        <mesh rotation={[-Math.PI / 8, 0, 0]}>
           <sphereGeometry args={[35, 32, 32]} />
           <meshBasicMaterial 
             color="#5E3A28" 
             wireframe 
             transparent 
             opacity={0.02} 
           />
        </mesh>
      </group>

      {/* The Globe Container */}
      <group ref={containerRef}>
        {/* Inner Structure Sphere (The "core" of the globe) */}
        <mesh>
          <sphereGeometry args={[radius - 0.5, 32, 32]} />
          <meshStandardMaterial color="#F5E6D8" transparent opacity={0.0} /> {/* Invisible core for occlusion if needed */}
        </mesh>

        {itemPositions.map((item) => (
          <CarouselItemMesh
            key={item.id}
            url={item.url}
            title={item.title}
            width={item.width}
            height={item.height}
            position={[item.pos.x, item.pos.y, item.pos.z]}
            rotation={[item.rot.x, item.rot.y, item.rot.z]}
            onClick={(bounds) => onItemClick(item, bounds)}
          />
        ))}
      </group>

      {/* Post Processing for "Cinematic" Feel */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={0.85} 
            mipmapBlur 
            intensity={0.3} 
            radius={0.4}
        />
        <Noise opacity={0.04} />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
};