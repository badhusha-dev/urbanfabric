import { useGLTF } from '@react-three/drei';

const TshirtModel = ({
  color = '#ffffff',
  scale = [2.2, 2.2, 2.2],
  position = [0, -1, 0],
  children
}) => {
  const { nodes, scene } = useGLTF('/shirt_baked.glb');

  // High-precision Mesh identification
  const mesh =
    nodes.T_Shirt_male ||
    nodes.Object_1 ||
    nodes.Object_2 ||
    nodes.mesh_0 ||
    Object.values(nodes).find(n => n.isMesh);

  if (!mesh?.geometry) {
    // Fallback wireframe if geometry fails to load
    return (
      <mesh scale={scale} position={position}>
        <boxGeometry args={[0.5, 0.8, 0.2]} />
        <meshStandardMaterial color="hotpink" wireframe />
      </mesh>
    );
  }

  return (
    <mesh
      geometry={mesh.geometry}
      scale={scale}
      position={position}
      castShadow
      receiveShadow
      dispose={null}
    >
      {/* Target for Material child component */}
      {children || <meshStandardMaterial color={color} />}
    </mesh>
  );
};

// Component preloading for Snappy UI transitions
useGLTF.preload('/shirt_baked.glb');

export default TshirtModel;
