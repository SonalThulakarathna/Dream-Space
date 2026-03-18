import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { FurnitureItem } from '@/types/design';
import { getFurnitureModel } from './FurnitureModels';
import * as THREE from 'three';

interface Room3DViewProps {
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  furniture: FurnitureItem[];
  selectedId: string | null;
  onSelectFurniture: (id: string | null) => void;
}

function Room({ roomWidth, roomDepth, roomHeight, wallColor, floorColor, ceilingColor }: {
  roomWidth: number; roomDepth: number; roomHeight: number;
  wallColor: string; floorColor: string; ceilingColor: string;
}) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[roomWidth / 2, 0, roomDepth / 2]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[roomWidth / 2, roomHeight, roomDepth / 2]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, roomHeight / 2, roomDepth / 2]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[roomWidth, roomHeight / 2, roomDepth / 2]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>
    </group>
  );
}

function FurniturePiece({ item, isSelected, onClick }: {
  item: FurnitureItem; isSelected: boolean; onClick: () => void;
}) {
  return (
    <group
      position={[item.x + item.width / 2, 0, item.y + item.depth / 2]}
      rotation={[0, (item.rotation * Math.PI) / 180, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {getFurnitureModel(item.type, {
        color: item.color,
        width: item.width,
        height: item.height,
        depth: item.depth,
      })}
      {isSelected && (
        <mesh position={[0, item.height / 2, 0]}>
          <boxGeometry args={[item.width + 0.04, item.height + 0.04, item.depth + 0.04]} />
          <meshBasicMaterial color="hsl(32, 80%, 50%)" wireframe transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

export default function Room3DView({
  roomWidth, roomDepth, roomHeight, wallColor, floorColor, ceilingColor,
  furniture, selectedId, onSelectFurniture,
}: Room3DViewProps) {
  return (
    <div className="flex-1 bg-background">
      <Canvas shadows gl={{ antialias: true }} onClick={() => onSelectFurniture(null)}>
        <PerspectiveCamera
          makeDefault
          position={[roomWidth * 1.5, roomHeight * 1.8, roomDepth * 1.5]}
          fov={50}
        />
        <OrbitControls
          target={[roomWidth / 2, roomHeight / 3, roomDepth / 2]}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={2}
          maxDistance={20}
        />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[roomWidth, roomHeight * 2, roomDepth]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[roomWidth / 2, roomHeight - 0.3, roomDepth / 2]} intensity={0.5} />

        <Room
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          roomHeight={roomHeight}
          wallColor={wallColor}
          floorColor={floorColor}
          ceilingColor={ceilingColor}
        />

        {furniture.map((item) => (
          <FurniturePiece
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => onSelectFurniture(item.id)}
          />
        ))}

        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
}
