import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Decal } from '@react-three/drei';
import { easing } from 'maath';

// --- Internal Hook for Texture Generation ---
export const useDesignTexture = (elements = [], size = 1024, isMobile = false) => {
  const [texture, setTexture] = useState(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const textureRef = useRef(null);
  const finalSize = isMobile ? 512 : size;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = finalSize;
    canvas.height = finalSize;
    const ctx = canvas.getContext('2d');

    const draw = async () => {
      ctx.clearRect(0, 0, finalSize, finalSize);
      const sorted = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      for (const el of sorted) {
        if (!el.visible) continue;
        ctx.save();
        const scaleX = finalSize / 260;
        const scaleY = finalSize / 240;
        const cx = el.x * scaleX + (el.width * scaleX) / 2;
        const cy = el.y * scaleY + (el.height * scaleY) / 2;
        ctx.translate(cx, cy);
        ctx.rotate((el.rotate || 0) * (Math.PI / 180));
        ctx.globalAlpha = el.opacity || 1;

        if (el.type === 'text') {
          const fontSize = (el.fontSize || 22) * (finalSize / 300);
          ctx.font = `${el.fontWeight || '900'} ${fontSize}px ${el.fontFamily || 'Inter'}`;
          ctx.fillStyle = el.color || '#ffffff';
          ctx.textAlign = el.textAlign || 'center';
          ctx.textBaseline = 'middle';

          if (el.glow || el.shadow) {
            ctx.shadowColor = el.glow ? (el.color || '#ffffff') : 'rgba(0,0,0,0.4)';
            ctx.shadowBlur = el.glow ? 15 : 6;
            ctx.shadowOffsetX = el.shadow ? 2 : 0;
            ctx.shadowOffsetY = el.shadow ? 2 : 0;
          }

          if (el.outline) {
            ctx.strokeStyle = el.outlineColor || '#000000';
            ctx.lineWidth = fontSize * 0.08;
            ctx.strokeText(el.content, 0, 0);
          }
          ctx.fillText(el.content, 0, 0);
        } else if (el.type === 'image') {
          try {
            const img = await new Promise((resolve, reject) => {
              const i = new Image();
              i.crossOrigin = 'anonymous';
              i.onload = () => resolve(i);
              i.onerror = reject;
              i.src = el.content;
            });
            ctx.drawImage(img, -(el.width * scaleX) / 2, -(el.height * scaleY) / 2, el.width * scaleX, el.height * scaleY);
          } catch (_) { }
        }
        ctx.restore();
      }

      if (textureRef.current) textureRef.current.dispose();
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = isMobile ? 4 : 8;
      tex.needsUpdate = true;
      textureRef.current = tex;
      setTexture(tex);
    };

    draw();

    return () => {
      if (textureRef.current) textureRef.current.dispose();
    };
  }, [elements, finalSize, isMobile]);

  return texture;
};

// --- Material Component ---
const TshirtMaterial = ({ color = '#ffffff', frontElements = [], backElements = [], isMobile = false }) => {
  const matRef = useRef();
  const colorRef = useRef(new THREE.Color(color));

  const frontTexture = useDesignTexture(frontElements, 1024, isMobile);
  const backTexture = useDesignTexture(backElements, 1024, isMobile);

  useFrame((state, delta) => {
    if (!matRef.current) return;
    easing.dampC(colorRef.current, color, 0.25, delta);
    matRef.current.color.set(colorRef.current);
  });

  return (
    <>
      <meshStandardMaterial
        ref={matRef}
        color={color}
        roughness={0.6}
        metalness={0.1}
        envMapIntensity={1.2}
      />

      {/* Front Decal */}
      {frontTexture && frontElements.length > 0 && (
        <Decal
          position={[0, 0.04, 0.15]}
          rotation={[0, 0, 0]}
          scale={0.15}
          map={frontTexture}
          polygonOffset
          polygonOffsetFactor={-10}
        />
      )}

      {/* Back Decal */}
      {backTexture && backElements.length > 0 && (
        <Decal
          position={[0, 0.04, -0.15]}
          rotation={[0, Math.PI, 0]}
          scale={0.15}
          map={backTexture}
          polygonOffset
          polygonOffsetFactor={-10}
        />
      )}
    </>
  );
};

export default TshirtMaterial;
