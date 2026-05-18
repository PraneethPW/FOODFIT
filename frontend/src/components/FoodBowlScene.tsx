import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

const Bowl = () => {
  const ref = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -0.35, 0]} scale={[2.2, 0.6, 2.2]}>
        <sphereGeometry args={[1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.25} />
      </mesh>
      {([
        [-0.9, 0.2, 0.1, "#35f0a4"],
        [-0.35, 0.45, 0.35, "#ff6f61"],
        [0.35, 0.35, -0.2, "#ffc857"],
        [0.85, 0.25, 0.25, "#0ea5e9"],
        [0.05, 0.65, 0.05, "#ffffff"]
      ] as [number, number, number, string][]).map(([x, y, z, color], index) => (
        <Float key={index} speed={2 + index * 0.25} floatIntensity={0.35}>
          <Sphere args={[0.22, 24, 24]} position={[x, y, z]}>
            <meshStandardMaterial color={color} roughness={0.35} />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

export const FoodBowlScene = () => (
  <Canvas camera={{ position: [0, 2.4, 5], fov: 45 }} className="min-h-[360px]">
    <ambientLight intensity={0.8} />
    <pointLight position={[2, 4, 4]} intensity={35} color="#35f0a4" />
    <pointLight position={[-4, 2, 1]} intensity={20} color="#ff6f61" />
    <Bowl />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
  </Canvas>
);
