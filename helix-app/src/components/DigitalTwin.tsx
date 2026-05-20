"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, Bounds, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface DigitalTwinProps {
  lightOn: boolean;
  acOn: boolean;
}

// --------------------------------------------------------
// NÉVOA FRIA PROCEDURAL (Cold Smoke Effect)
// --------------------------------------------------------
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function ColdSmoke({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!active || !group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const timeOffset = t + i * 0.3;
      const progress = (timeOffset % 1.5) / 1.5; // Ciclo de 0 a 1 (1.5 segundos)
      
      // Cai da aleta e vai levemente para frente
      child.position.y = -0.1 - progress * 1.5;
      child.position.z = 0.15 + progress * 0.4;
      child.position.x = Math.sin(timeOffset * 2 + i) * 0.2; // Balanço suave (vento)
      
      // Começa pequeno e expande como gás
      child.scale.setScalar(0.5 + progress * 2.0);
      
      // Fade In e Fade Out suave
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = Math.sin(progress * Math.PI) * 0.12; 
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

// --------------------------------------------------------
// LUSTRE PROCEDURAL EXAGERADO (Mega Cascata Espiral)
// --------------------------------------------------------
import { useMemo } from 'react';

function ProceduralChandelier({ lightOn, position }: { lightOn: boolean, position: [number, number, number] }) {
  // Matemática pura para gerar uma espiral gigante de 120 cristais suspensos!
  const crystals = useMemo(() => {
    const arr = [];
    const numCrystals = 120; 
    for (let i = 0; i < numCrystals; i++) {
      const angle = i * 0.45; // Rotação da espiral
      const radius = 0.8 * Math.exp(-i * 0.015); // Raio vai diminuindo (formato de tornado)
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.3 - (i * 0.025); // Desce quase 3.5 metros!
      
      arr.push({ id: i, pos: [x, y, z] as [number, number, number], wireLength: Math.abs(y) });
    }
    return arr;
  }, []);

  return (
    <group position={position}>
      {/* Base Gigante no Teto */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.1]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
      </mesh>

      {/* Renderizando os 120 Cristais e Fios */}
      {crystals.map((c) => (
        <group key={c.id}>
          {/* Fio individual de cada cristal (bem fino) */}
          <mesh position={[c.pos[0], -c.wireLength / 2, c.pos[2]]}>
            <cylinderGeometry args={[0.002, 0.002, c.wireLength]} />
            <meshBasicMaterial color="#333333" />
          </mesh>

          {/* O Cristal / Lâmpada */}
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

      {/* Luz Principal (Quando ligado: Ilumina a casa inteira de Branco Quente) */}
      {lightOn && (
        <pointLight position={[0, -1.5, 0]} intensity={5} distance={30} decay={1.5} color="#fff5e6" castShadow />
      )}
    </group>
  );
}

// --------------------------------------------------------
// GEOMETRIA PROCEDURAL (Engenharia 3D via Código)
// --------------------------------------------------------
function ProceduralAC({ acOn, position, normal }: { acOn: boolean, position: [number, number, number], normal: [number, number, number] }) {
  // A Normal (vetor) nos diz para qual lado a parede está "olhando".
  // Vamos usar isso para rotacionar o Ar Condicionado para que ele cole na parede perfeitamente!
  const target = new THREE.Vector3(position[0] + normal[0], position[1] + normal[1], position[2] + normal[2]);
  
  return (
    <group position={position}>
      {/* O lookAt faz o objeto "olhar" na direção da normal da parede (para fora) */}
      <group onUpdate={(self) => self.lookAt(target)}>
        {/* Deslocamos o AC levemente para frente (+Z) para que as costas fiquem coladas na parede (0,0,0) */}
        <group position={[0, 0, 0.15]}>
          
          {/* Corpo Principal do AC (Plástico Premium Brilhante) */}
          <RoundedBox args={[1.2, 0.35, 0.25]} radius={0.05} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
          </RoundedBox>

          {/* Fenda de Ventilação (Aleta) */}
          <mesh position={[0, -0.1, 0.12]}>
            <boxGeometry args={[1.0, 0.04, 0.05]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>

          {/* Fumaça Gelada saindo da Aleta */}
          <ColdSmoke active={acOn} />

          {/* Display Digital Oculto (Acrílico Preto) */}
          <mesh position={[0.4, -0.05, 0.126]}>
            <boxGeometry args={[0.15, 0.08, 0.01]} />
            <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
          </mesh>

          {/* Luz LED de Status (Acende e Apaga) */}
          <mesh position={[0.44, -0.05, 0.132]}>
            <circleGeometry args={[0.015, 16]} />
            <meshBasicMaterial color={acOn ? "#00C8FF" : "#333333"} />
          </mesh>
          
          {/* Brilho Real (Glow) da Luz no ambiente escuro */}
          {acOn && <pointLight position={[0.44, -0.05, 0.2]} intensity={0.5} distance={1.5} color="#00C8FF" />}

        </group>
      </group>
    </group>
  );
}

// Sub-componente do Modelo que recebe as posições e o evento de clique
function RealTwinModel({ lightOn, acOn, lightPos, acData, onMeshClick, isEditing }: any) {
  const { scene } = useGLTF("/Duplex.glb");
  
  return (
    <group>
      <primitive 
        object={scene} 
        onPointerDown={(e: any) => {
          if (isEditing) {
            e.stopPropagation(); 
            // e.point contém a coordenada (X,Y,Z). 
            // e.face.normal contém a rotação da face clicada (se disponível)
            const normal = e.face?.normal ? [e.face.normal.x, e.face.normal.y, e.face.normal.z] : [0, 0, 1];
            onMeshClick([e.point.x, e.point.y, e.point.z], normal);
          }
        }}
      />

      {/* LUSTRE 3D (Renderizado no teto onde o usuário clicou) */}
      <ProceduralChandelier lightOn={lightOn} position={lightPos} />

      {/* MARCADOR 1: ILUMINAÇÃO (Design Apple AR - Afastado para baixo do lustre) */}
      <Html position={[lightPos[0], lightPos[1] - 1.5, lightPos[2]]} center zIndexRange={[100, 0]}>
        <div className="relative group cursor-pointer">
          <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-md shadow-lg transition-transform hover:scale-110">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${lightOn ? 'bg-[#2b86ff] text-white' : 'bg-white text-[#2b86ff]'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-64 bg-[#3994ff]/80 backdrop-blur-2xl p-4 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white transform origin-left scale-95 group-hover:scale-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${lightOn ? 'bg-white text-[#2b86ff]' : 'bg-white/50 text-[#2b86ff]'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </div>
                <span className="font-semibold text-lg tracking-tight">Lighting lamps</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium opacity-90">Light intensity</div>
              <div className="relative h-6 w-full bg-black/10 rounded-full overflow-hidden flex items-center px-1">
                <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all duration-700 ease-out" style={{ width: lightOn ? '100%' : '20%' }}></div>
                <div className="relative z-10 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-700 ease-out" style={{ transform: lightOn ? 'translateX(190px)' : 'translateX(10px)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Html>

      {/* AR CONDICIONADO 3D (Renderizado onde o usuário clicou) */}
      <ProceduralAC acOn={acOn} position={acData.point} normal={acData.normal} />

      {/* MARCADOR 2: AR CONDICIONADO (Agora fica de forma flutuante ACIMA do modelo 3D, como uma coroa) */}
      <Html position={[acData.point[0], acData.point[1] + 0.5, acData.point[2]]} center zIndexRange={[100, 0]}>
        <div className="relative group cursor-pointer">
          <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-md shadow-lg transition-transform hover:scale-110">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${acOn ? 'bg-[#2b86ff] text-white' : 'bg-white text-[#2b86ff]'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="5.66" y1="5.66" x2="18.34" y2="18.34"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="5.66" y1="18.34" x2="18.34" y2="5.66"/></svg>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-full mr-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none w-56 bg-[#3994ff]/80 backdrop-blur-2xl p-4 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white transform origin-right scale-95 group-hover:scale-100">
            <div className="flex justify-between items-start mb-2 flex-row-reverse">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${acOn ? 'bg-white text-[#2b86ff]' : 'bg-white/50 text-[#2b86ff]'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="5.66" y1="5.66" x2="18.34" y2="18.34"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="5.66" y1="18.34" x2="18.34" y2="5.66"/></svg>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
            </div>
            <div className="mt-2 text-right">
              <div className="font-bold text-4xl tracking-tighter mb-1">{acOn ? "21°" : "OFF"}</div>
              <div className="text-xs font-medium uppercase tracking-widest opacity-80">Air Conditioning</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload("/Duplex.glb");

export default function DigitalTwin({ lightOn, acOn }: DigitalTwinProps) {
  const [lightPos, setLightPos] = useState<[number, number, number]>([0, 0, 0]);
  const [acData, setAcData] = useState<{ point: [number, number, number], normal: [number, number, number] }>({
    point: [0, 0, 0],
    normal: [0, 0, 1]
  });
  const [editingTag, setEditingTag] = useState<'light' | 'ac' | null>(null);

  useEffect(() => {
    const savedLight = localStorage.getItem("helix_light_pos");
    const savedAc = localStorage.getItem("helix_ac_pos");
    
    if (savedLight) setLightPos(JSON.parse(savedLight));
    
    if (savedAc) {
      const parsed = JSON.parse(savedAc);
      if (Array.isArray(parsed)) {
        // Migração de dados antigos para o novo formato com Normal
        setAcData({ point: parsed, normal: [0, 0, 1] });
      } else {
        setAcData(parsed);
      }
    }
  }, []);

  const handleMeshClick = (point: [number, number, number], normal: [number, number, number]) => {
    if (editingTag === 'light') {
      setLightPos(point);
      localStorage.setItem("helix_light_pos", JSON.stringify(point));
    } else if (editingTag === 'ac') {
      const data = { point, normal };
      setAcData(data);
      localStorage.setItem("helix_ac_pos", JSON.stringify(data));
    }
    setEditingTag(null); 
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      
      {/* TOOLBAR DE EDIÇÃO HTML (CMS) */}
      <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <span>⚙️</span> CMS Espacial Hélix
        </h3>
        
        {editingTag ? (
          <div className="bg-[#00C8FF]/10 border border-[#00C8FF]/30 p-3 rounded-xl max-w-xs">
            <p className="text-[#00C8FF] text-xs font-semibold animate-pulse leading-relaxed">
              Mire e clique no exato local da casa onde deseja posicionar o sensor de {editingTag === 'light' ? 'Iluminação' : 'Climatização'}.
            </p>
            <button onClick={() => setEditingTag(null)} className="mt-3 text-white/50 hover:text-white text-xs underline transition-colors">
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setEditingTag('light')}
              className="bg-white/5 hover:bg-white/15 px-3 py-2 rounded-xl text-xs font-medium text-white transition-all border border-white/10"
            >
              Mover Luz
            </button>
            <button 
              onClick={() => setEditingTag('ac')}
              className="bg-white/5 hover:bg-white/15 px-3 py-2 rounded-xl text-xs font-medium text-white transition-all border border-white/10"
            >
              Mover Ar Cond.
            </button>
          </div>
        )}
      </div>

      {/* CANVAS 3D */}
      <div className={`w-full h-full ${editingTag ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}>
        <Canvas shadows camera={{ fov: 45, position: [-10, 5, 15] }}>
          <color attach="background" args={["#08080b"]} />
          <Bounds fit clip observe margin={0.8}>
            <Suspense fallback={
              <Html center>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin mb-4"></div>
                  <div className="text-white text-xs font-semibold tracking-[0.2em] whitespace-nowrap bg-black/40 px-6 py-3 rounded-full backdrop-blur-xl border border-white/5 shadow-2xl uppercase">
                    Renderizando Geometria
                  </div>
                </div>
              </Html>
            }>
              <RealTwinModel 
                lightOn={lightOn} 
                acOn={acOn} 
                lightPos={lightPos}
                acData={acData}
                isEditing={!!editingTag}
                onMeshClick={handleMeshClick}
              />
            </Suspense>
          </Bounds>

          {/* Navegação Sênior */}
          <OrbitControls 
            makeDefault
            enableDamping
            dampingFactor={0.05}
            autoRotate={false}
            enablePan={true}
            panSpeed={1.2}
            zoomSpeed={1.5}
            minDistance={0.5}
            maxDistance={40}
            maxPolarAngle={Math.PI / 2}
          />

          <ambientLight intensity={lightOn ? 1.5 : 0.05} />
          <directionalLight position={[10, 20, 10]} intensity={lightOn ? 1.2 : 0.0} castShadow />
          <Environment preset="apartment" environmentIntensity={lightOn ? 1 : 0.02} />
        </Canvas>
      </div>
    </div>
  );
}
