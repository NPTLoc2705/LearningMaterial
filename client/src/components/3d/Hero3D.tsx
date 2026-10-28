import { useState, useEffect, useRef, Suspense, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export interface Hero3DProps {
  modelUrl?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

/**
 * Hook to detect prefers-reduced-motion accessibility setting
 */
export function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Renders a GLTF model with proper center alignment and shadow support
 */
function GltfModel({ url, reducedMotion }: { url: string; reducedMotion: boolean }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} scale={1.8} />
    </group>
  );
}

/**
 * Procedural sleek tech gadget ("Cool Apps & Gadgets" unit theme):
 * High-end minimalist glass-and-titanium slate device with soft bevels, glowing status ring, and metallic camera module.
 */
function ProceduralGadgetProduct({ reducedMotion }: { reducedMotion: boolean }) {
  const productRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!reducedMotion && productRef.current) {
      productRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={productRef} position={[0, 0, 0]} rotation={[0.15, -0.25, 0.05]}>
      {/* Device Body Chassis (Titanium Slate) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 3.4, 0.16]} />
        <meshPhysicalMaterial
          color="#1E1E1C"
          roughness={0.25}
          metalness={0.85}
          clearcoat={0.3}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Screen Bezel Inset */}
      <mesh position={[0, 0, 0.086]}>
        <boxGeometry args={[2.08, 3.28, 0.01]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.1} metalness={0.5} />
      </mesh>

      {/* Glossy Front Glass Display */}
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[1.96, 3.14]} />
        <meshPhysicalMaterial
          color="#16181B"
          roughness={0.08}
          metalness={0.1}
          transmission={0.4}
          ior={1.5}
          reflectivity={0.9}
        />
      </mesh>

      {/* Glowing Holographic Brand/App Badge on Screen */}
      <group position={[0, 0.2, 0.105]}>
        <mesh>
          <ringGeometry args={[0.35, 0.4, 48]} />
          <meshBasicMaterial color="#346538" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <circleGeometry args={[0.26, 32]} />
          <meshBasicMaterial color="#1F6C9F" />
        </mesh>
        {/* Unit 7/8 abstract glyph bar */}
        <mesh position={[0, -0.6, 0]}>
          <planeGeometry args={[1.2, 0.08]} />
          <meshBasicMaterial color="#E8E7E4" />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <planeGeometry args={[0.8, 0.06]} />
          <meshBasicMaterial color="#9E9D97" />
        </mesh>
      </group>

      {/* Back Camera Island */}
      <group position={[0.55, 1.1, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.85, 0.08]} />
          <meshStandardMaterial color="#141413" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Camera Lens 1 */}
        <mesh position={[-0.22, 0.22, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 32]} />
          <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.95} />
        </mesh>
        {/* Camera Lens 2 */}
        <mesh position={[0.22, -0.22, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 32]} />
          <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.95} />
        </mesh>
        {/* Camera Lens 3 */}
        <mesh position={[-0.22, -0.22, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 32]} />
          <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.95} />
        </mesh>
      </group>

      {/* Subtle Floating Orbit Accents */}
      <group position={[0, 0, 0]} rotation={[0.4, 0.2, 0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.008, 16, 100]} />
          <meshBasicMaterial color="#346538" opacity={0.35} transparent />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 3D Scene setup with soft lighting and contact shadows
 */
function SceneContent({
  modelUrl,
  reducedMotion,
}: {
  modelUrl?: string;
  reducedMotion: boolean;
}) {
  return (
    <>
      {/* Soft Ambient Lighting */}
      <ambientLight intensity={0.65} />

      {/* Key Directional Light (Soft warm daylight) */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Cool Rim Light for metallic edges */}
      <directionalLight position={[-4, 3, -3]} intensity={0.45} color="#DCEBFF" />

      {/* Subtle Warm Bounce Light */}
      <pointLight position={[0, -2, 2.5]} intensity={0.3} color="#F5E6BF" />

      {/* Floating Wrapper with Reduced Motion condition */}
      <Float
        speed={reducedMotion ? 0 : 1.8}
        rotationIntensity={reducedMotion ? 0 : 0.25}
        floatIntensity={reducedMotion ? 0 : 0.4}
        floatingRange={[-0.1, 0.1]}
      >
        {modelUrl ? (
          <GltfModel url={modelUrl} reducedMotion={reducedMotion} />
        ) : (
          <ProceduralGadgetProduct reducedMotion={reducedMotion} />
        )}
      </Float>

      {/* Soft Ground Contact Shadows */}
      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.4}
        scale={7}
        blur={2.4}
        far={4.5}
        color="#141413"
      />
    </>
  );
}

/**
 * Fallback Skeleton when 3D scene or GLTF is loading
 */
function Hero3DLoading() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="w-12 h-12 rounded-2xl bg-white/60 border border-[#E8E7E4] shadow-subtle flex items-center justify-center animate-spin">
        <div className="w-5 h-5 rounded-full border-2 border-[#141413] border-t-transparent" />
      </div>
      <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] mt-3">
        Đang khởi tạo không gian 3D...
      </span>
    </div>
  );
}

/**
 * Premium 3D Hero Section
 */
export const Hero3D = memo(function Hero3D({
  modelUrl,
  title = 'Khám Phá Công Nghệ & Tiện Ích Tương Lai',
  subtitle = 'Mô hình thiết bị thông minh 3D đại diện cho chủ điểm Unit 7: Cool Apps and Gadgets. Tương tác đa chiều với ánh sáng mềm và phản xạ chuẩn mực.',
  badge = 'Unit 7 · 3D WebGL Showcase',
  className = '',
}: Hero3DProps) {
  const systemPrefersReduced = usePrefersReducedMotion();
  const [manualMotionToggle, setManualMotionToggle] = useState<boolean | null>(null);

  // Allow user to manually toggle motion on/off, falling back to system preference
  const isReducedMotion =
    manualMotionToggle !== null ? manualMotionToggle : systemPrefersReduced;

  return (
    <div
      className={`relative w-full rounded-2xl border border-[#E8E7E4] overflow-hidden shadow-subtle bg-gradient-to-br from-[#FBFBFA] via-[#F4F3EF] to-[#EAE8E3] ${className}`}
    >
      {/* Decorative Atmospheric Radial Glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 65% 45%, rgba(255, 255, 255, 0.75) 0%, rgba(244, 243, 239, 0.3) 50%, transparent 80%)',
        }}
      />

      {/* Grid pattern overlay for editorial tech blueprint vibe */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#141413 1px, transparent 1px), linear-gradient(90deg, #141413 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] lg:min-h-[520px]">
        {/* Left Column: Editorial Headline & Context */}
        <div className="p-6 sm:p-10 lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#346538] bg-[#EDF3EC] px-2.5 py-1 rounded-md border border-[#DCE8DA]">
              {badge}
            </span>
            {isReducedMotion && (
              <span className="font-mono text-[10px] text-[#9E9D97] bg-white px-2 py-0.5 rounded border border-[#E8E7E4]">
                Chế độ tĩnh (Reduced Motion)
              </span>
            )}
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#141413] leading-[1.15]">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-[#6B6A66] leading-relaxed max-w-lg">
            {subtitle}
          </p>

          {/* Interaction Guide & Motion Toggle Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="text-[#9E9D97] flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#E8E7E4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#346538] animate-pulse" />
              <span>{isReducedMotion ? 'Mô hình góc tĩnh' : 'Xoay chậm tự động (3D Ambient)'}</span>
            </div>

            <button
              type="button"
              onClick={() => setManualMotionToggle(!isReducedMotion)}
              className="text-[#141413] hover:text-[#346538] hover:underline bg-white px-3 py-1.5 rounded-lg border border-[#E8E7E4] shadow-xs transition-colors touch-manipulation"
              title="Chuyển đổi hiệu ứng chuyển động xoay"
            >
              {isReducedMotion ? 'Bật xoay 3D' : 'Tạm dừng chuyển động'}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive 3D Canvas */}
        <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[520px] lg:col-span-6">
          <Suspense fallback={<Hero3DLoading />}>
            <Canvas
              camera={{ position: [0, 0, 5.2], fov: 42 }}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                powerPreference: 'high-performance',
                alpha: true,
              }}
              className="touch-none"
            >
              <SceneContent modelUrl={modelUrl} reducedMotion={isReducedMotion} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </div>
  );
});
