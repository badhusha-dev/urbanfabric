import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import TshirtModel from './TshirtModel';
import TshirtMaterial from './TshirtMaterial';

// --- Scene Setup Component ---
const Scene = ({ 
  frontElements = [], 
  backElements = [], 
  color = '#ffffff', 
  autoRotate = false, 
  controlsEnabled = true, 
  viewAngle = 'front', 
  isMobile = false 
}) => {
  const orbitRef = useRef();

  // Handle Preset Camera Snap-Points
  useEffect(() => {
    const ctrl = orbitRef.current;
    if (!ctrl) return;
    if (viewAngle === 'front' || viewAngle === 'reset') {
      ctrl.setAzimuthalAngle(0);
      ctrl.setPolarAngle(Math.PI / 2.2);
    } else if (viewAngle === 'back') {
      ctrl.setAzimuthalAngle(Math.PI);
      ctrl.setPolarAngle(Math.PI / 2.2);
    }
  }, [viewAngle]);

  return (
    <>
      {/* Dynamic Lighting Infrastructure */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 4, -5]} intensity={0.5} />
      <Environment preset="studio" />

      {/* Model with Injected Design Material */}
      <Suspense fallback={
        <mesh scale={[0.8, 1.2, 0.1]}>
          <boxGeometry />
          <meshStandardMaterial color="#1a1a1a" wireframe opacity={0.2} transparent />
        </mesh>
      }>
        <TshirtModel color={color}>
          <TshirtMaterial 
            color={color} 
            frontElements={frontElements} 
            backElements={backElements} 
            isMobile={isMobile}
          />
        </TshirtModel>
      </Suspense>

      {/* Contact Shadows for Ground-Tethered feel */}
      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.4}
        scale={6}
        blur={2}
        far={3}
        resolution={isMobile ? 128 : 256}
        color="#000000"
      />

      {/* 360° Interaction Control */}
      {controlsEnabled && (
        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          enableDamping
          dampingFactor={0.06}
          makeDefault
        />
      )}
    </>
  );
};

// --- Modular Canvas Entrypoint ---
const TshirtCanvas = (props) => {
  return (
    <div className="w-full h-full relative group">
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          preserveDrawingBuffer: true,
        }}
        className="w-full h-full"
      >
        <Scene {...props} />
      </Canvas>

      {/* Visual Instruction Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none
        flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-xl
        border border-white/10 opacity-60 animate-in fade-in slide-in-from-bottom duration-1000">
        <span className="text-[9px] font-mono font-black text-white/70 uppercase tracking-widest italic">
          {props.isMobile ? 'Touch-to-Rotate · Pinch-to-Zoom' : 'Click-to-Rotate · Scroll-to-Zoom'}
        </span>
      </div>
    </div>
  );
};

export default TshirtCanvas;
