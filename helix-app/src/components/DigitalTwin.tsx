"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, Bounds, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface DigitalTwinProps {
  lightOn: boolean;
  acOn: boolean;
}

type Vec3 = [number, number, number];
type AcPlacement = { point: Vec3; normal: Vec3 };

function ColdSmoke({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!active || !group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const phase = ((t + i * 0.3) % 1.5) / 1.5;
      child.position.y = -0.1 - phase * 1.5;
      child.position.z = 0.15 + phase * 0.4;
      child.position.x = Math.sin(t * 2 + i) * 0.2;
      child.scale.setScalar(0.5 + phase * 2);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(phase * Math.PI) * 0.12;
    });
  });

  if (!active) return null;

  return (
    <group ref={group}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color="#aaddff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function Chandelier({ lightOn, position }: { lightOn: boolean; position: Vec3 }) {
  const crystals = useMemo(() => {
    const items = [];
    for (let i = 0; i < 120; i++) {
      const angle = i * 0.45;
      const radius = 0.8 * Math.exp(-i * 0.015);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.3 - i * 0.025;
      items.push({ id: i, pos: [x, y, z] as Vec3, wireLength: Math.abs(y) });
    }
    return items;
  }, []);

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.1]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
      </mesh>
      {crystals.map((c) => (
        <group key={c.id}>
          <mesh position={[c.pos[0], -c.wireLength / 2, c.pos[2]]}>
            <cylinderGeometry args={[0.002, 0.002, c.wireLength]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          <mesh position={c.pos}>
            <sphereGeometry args={[c.id % 5 === 0 ? 0.05 : 0.03, 16, 16]} />
            <meshStandardMaterial
              color={lightOn ? "#ffffff" : "#111111"}
              emissive={lightOn ? "#ffffff" : "#000000"}
              emissiveIntensity={lightOn ? 4 : 0}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      {lightOn && (
        <pointLight position={[0, -1.5, 0]} intensity={5} distance={30} decay={1.5} color="#fff5e6" castShadow />
      )}
    </group>
  );
}

function AirConditioner({ acOn, position, normal }: { acOn: boolean; position: Vec3; normal: Vec3 }) {
  const target = new THREE.Vector3(
    position[0] + normal[0],
    position[1] + normal[1],
    position[2] + normal[2]
  );

  return (
    <group position={position}>
      <group onUpdate={(self) => self.lookAt(target)}>
        <group position={[0, 0, 0.15]}>
          <RoundedBox args={[1.2, 0.35, 0.25]} radius={0.05} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
          </RoundedBox>
          <mesh position={[0, -0.1, 0.12]}>
            <boxGeometry args={[1.0, 0.04, 0.05]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          <ColdSmoke active={acOn} />
          <mesh position={[0.4, -0.05, 0.126]}>
            <boxGeometry args={[0.15, 0.08, 0.01]} />
            <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0.44, -0.05, 0.132]}>
            <circleGeometry args={[0.015, 16]} />
            <meshBasicMaterial color={acOn ? "#00C8FF" : "#333333"} />
          </mesh>
          {acOn && <pointLight position={[0.44, -0.05, 0.2]} intensity={0.5} distance={1.5} color="#00C8FF" />}
        </group>
      </group>
    </group>
  );
}

const lightIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const acIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="5.66" y1="5.66" x2="18.34" y2="18.34" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="5.66" y1="18.34" x2="18.34" y2="5.66" />
  </svg>
);

function TwinScene({
  lightOn,
  acOn,
  lightPos,
  acData,
  onMeshClick,
  isEditing,
}: {
  lightOn: boolean;
  acOn: boolean;
  lightPos: Vec3;
  acData: AcPlacement;
  onMeshClick: (point: Vec3, normal: Vec3) => void;
  isEditing: boolean;
}) {
  const { scene } = useGLTF("/Duplex.glb");

  return (
    <group>
      <primitive
        object={scene}
        onPointerDown={(e: any) => {
          if (!isEditing) return;
          e.stopPropagation();
          const n = e.face?.normal;
          const normal: Vec3 = n ? [n.x, n.y, n.z] : [0, 0, 1];
          onMeshClick([e.point.x, e.point.y, e.point.z], normal);
        }}
      />
      <Chandelier lightOn={lightOn} position={lightPos} />
      <Html position={[lightPos[0], lightPos[1] - 1.5, lightPos[2]]} center zIndexRange={[100, 0]}>
        <div className="relative group cursor-pointer">
          <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-md shadow-lg transition-transform hover:scale-110">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${lightOn ? "bg-[#2b86ff] text-white" : "bg-white text-[#2b86ff]"}`}>
              {lightIcon}
            </div>
          </div>
          <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-64 bg-[#3994ff]/80 backdrop-blur-2xl p-4 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white transform origin-left scale-95 group-hover:scale-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lightOn ? "bg-white text-[#2b86ff]" : "bg-white/50 text-[#2b86ff]"}`}>
                {lightIcon}
              </div>
              <span className="font-semibold text-lg">Iluminação</span>
            </div>
            <div className="text-sm font-medium opacity-90 mb-2">Intensidade</div>
            <div className="relative h-6 w-full bg-black/10 rounded-full overflow-hidden flex items-center px-1">
              <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-700" style={{ width: lightOn ? "100%" : "20%" }} />
              <div className="relative z-10 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-700" style={{ transform: lightOn ? "translateX(190px)" : "translateX(10px)" }} />
            </div>
          </div>
        </div>
      </Html>
      <AirConditioner acOn={acOn} position={acData.point} normal={acData.normal} />
      <Html position={[acData.point[0], acData.point[1] + 0.5, acData.point[2]]} center zIndexRange={[100, 0]}>
        <div className="relative group cursor-pointer">
          <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-md shadow-lg transition-transform hover:scale-110">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${acOn ? "bg-[#2b86ff] text-white" : "bg-white text-[#2b86ff]"}`}>
              {acIcon}
            </div>
          </div>
          <div className="absolute top-1/2 right-full mr-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-56 bg-[#3994ff]/80 backdrop-blur-2xl p-4 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white transform origin-right scale-95 group-hover:scale-100">
            <div className="text-right">
              <div className="font-bold text-4xl tracking-tighter mb-1">{acOn ? "21°" : "OFF"}</div>
              <div className="text-xs font-medium uppercase tracking-widest opacity-80">Ar-condicionado</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload("/Duplex.glb");

export default function DigitalTwin({ lightOn, acOn }: DigitalTwinProps) {
  const [lightPos, setLightPos] = useState<Vec3>([0, 0, 0]);
  const [acData, setAcData] = useState<AcPlacement>({ point: [0, 0, 0], normal: [0, 0, 1] });
  const [editing, setEditing] = useState<"light" | "ac" | null>(null);

  useEffect(() => {
    const savedLight = localStorage.getItem("helix_light_pos");
    const savedAc = localStorage.getItem("helix_ac_pos");
    if (savedLight) setLightPos(JSON.parse(savedLight));
    if (savedAc) {
      const parsed = JSON.parse(savedAc);
      if (Array.isArray(parsed)) {
        setAcData({ point: parsed, normal: [0, 0, 1] });
      } else {
        setAcData(parsed);
      }
    }
  }, []);

  const handleMeshClick = (point: Vec3, normal: Vec3) => {
    if (editing === "light") {
      setLightPos(point);
      localStorage.setItem("helix_light_pos", JSON.stringify(point));
    } else if (editing === "ac") {
      const data = { point, normal };
      setAcData(data);
      localStorage.setItem("helix_ac_pos", JSON.stringify(data));
    }
    setEditing(null);
  };

  const editingLabel = editing === "light" ? "iluminação" : "climatização";

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
        <h3 className="text-white font-semibold text-sm mb-3">Posicionamento de sensores</h3>
        {editing ? (
          <div className="bg-[#00C8FF]/10 border border-[#00C8FF]/30 p-3 rounded-xl max-w-xs">
            <p className="text-[#00C8FF] text-xs leading-relaxed">
              Clique no ambiente para posicionar o sensor de {editingLabel}.
            </p>
            <button onClick={() => setEditing(null)} className="mt-3 text-white/50 hover:text-white text-xs underline">
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing("light")} className="bg-white/5 hover:bg-white/15 px-3 py-2 rounded-xl text-xs font-medium text-white border border-white/10">
              Mover luz
            </button>
            <button onClick={() => setEditing("ac")} className="bg-white/5 hover:bg-white/15 px-3 py-2 rounded-xl text-xs font-medium text-white border border-white/10">
              Mover ar-cond.
            </button>
          </div>
        )}
      </div>
      <div className={`w-full h-full ${editing ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}>
        <Canvas shadows camera={{ fov: 45, position: [-10, 5, 15] }}>
          <color attach="background" args={["#08080b"]} />
          <Bounds fit clip observe margin={0.8}>
            <Suspense
              fallback={
                <Html center>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin mb-4" />
                    <div className="text-white text-xs font-semibold tracking-widest bg-black/40 px-6 py-3 rounded-full backdrop-blur-xl border border-white/5 uppercase">
                      Carregando modelo
                    </div>
                  </div>
                </Html>
              }
            >
              <TwinScene
                lightOn={lightOn}
                acOn={acOn}
                lightPos={lightPos}
                acData={acData}
                isEditing={!!editing}
                onMeshClick={handleMeshClick}
              />
            </Suspense>
          </Bounds>
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            enablePan
            panSpeed={1.2}
            zoomSpeed={1.5}
            minDistance={0.5}
            maxDistance={40}
            maxPolarAngle={Math.PI / 2}
          />
          <ambientLight intensity={lightOn ? 1.5 : 0.05} />
          <directionalLight position={[10, 20, 10]} intensity={lightOn ? 1.2 : 0} castShadow />
          <Environment preset="apartment" environmentIntensity={lightOn ? 1 : 0.02} />
        </Canvas>
      </div>
    </div>
  );
}
