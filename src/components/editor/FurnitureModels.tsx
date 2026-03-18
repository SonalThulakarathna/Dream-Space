import * as THREE from 'three';

interface ModelProps {
  color: string;
  width: number;
  height: number;
  depth: number;
}

function mat(color: string, roughness = 0.6) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.1} />;
}

function darker(hex: string, amount = 30) {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, -amount / 255);
  return '#' + c.getHexString();
}

function lighter(hex: string, amount = 30) {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, amount / 255);
  return '#' + c.getHexString();
}

export function SofaModel({ color, width, height, depth }: ModelProps) {
  const seatH = height * 0.4;
  const backH = height * 0.6;
  const armW = width * 0.1;
  const legH = height * 0.12;
  const legR = 0.03;
  return (
    <group>
      {/* Legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx * (width / 2 - 0.06), legH / 2, lz * (depth / 2 - 0.06)]} castShadow>
          <cylinderGeometry args={[legR, legR, legH, 8]} />
          {mat(darker(color, 50))}
        </mesh>
      ))}
      {/* Seat base */}
      <mesh position={[0, legH + seatH / 2, 0]} castShadow>
        <boxGeometry args={[width, seatH, depth]} />
        {mat(color)}
      </mesh>
      {/* Back cushion */}
      <mesh position={[0, legH + seatH + backH / 2, -depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[width - armW * 2, backH, 0.15]} />
        {mat(lighter(color, 15))}
      </mesh>
      {/* Left arm */}
      <mesh position={[-width / 2 + armW / 2, legH + seatH + backH * 0.3, 0]} castShadow>
        <boxGeometry args={[armW, backH * 0.6, depth]} />
        {mat(color)}
      </mesh>
      {/* Right arm */}
      <mesh position={[width / 2 - armW / 2, legH + seatH + backH * 0.3, 0]} castShadow>
        <boxGeometry args={[armW, backH * 0.6, depth]} />
        {mat(color)}
      </mesh>
      {/* Seat cushions (2) */}
      {[-1, 1].map((side, i) => (
        <mesh key={`c${i}`} position={[side * (width / 4 - armW / 2), legH + seatH + 0.04, 0.03]} castShadow>
          <boxGeometry args={[width / 2 - armW - 0.04, 0.08, depth - 0.2]} />
          {mat(lighter(color, 10))}
        </mesh>
      ))}
    </group>
  );
}

export function ArmchairModel({ color, width, height, depth }: ModelProps) {
  const seatH = height * 0.38;
  const backH = height * 0.62;
  const armW = width * 0.15;
  const legH = height * 0.12;
  return (
    <group>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx * (width / 2 - 0.06), legH / 2, lz * (depth / 2 - 0.06)]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, legH, 8]} />
          {mat(darker(color, 50))}
        </mesh>
      ))}
      <mesh position={[0, legH + seatH / 2, 0]} castShadow>
        <boxGeometry args={[width, seatH, depth]} />
        {mat(color)}
      </mesh>
      <mesh position={[0, legH + seatH + backH / 2, -depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[width - armW * 2, backH, 0.12]} />
        {mat(lighter(color, 15))}
      </mesh>
      <mesh position={[-width / 2 + armW / 2, legH + seatH + backH * 0.25, 0]} castShadow>
        <boxGeometry args={[armW, backH * 0.5, depth]} />
        {mat(color)}
      </mesh>
      <mesh position={[width / 2 - armW / 2, legH + seatH + backH * 0.25, 0]} castShadow>
        <boxGeometry args={[armW, backH * 0.5, depth]} />
        {mat(color)}
      </mesh>
      {/* Cushion */}
      <mesh position={[0, legH + seatH + 0.04, 0.03]} castShadow>
        <boxGeometry args={[width - armW * 2 - 0.04, 0.08, depth - 0.15]} />
        {mat(lighter(color, 10))}
      </mesh>
    </group>
  );
}

export function ChairModel({ color, width, height, depth }: ModelProps) {
  const seatH = 0.04;
  const seatY = height * 0.5;
  const legR = 0.025;
  return (
    <group>
      {/* 4 legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx * (width / 2 - 0.04), seatY / 2, lz * (depth / 2 - 0.04)]} castShadow>
          <boxGeometry args={[legR * 2, seatY, legR * 2]} />
          {mat(color)}
        </mesh>
      ))}
      {/* Seat */}
      <mesh position={[0, seatY + seatH / 2, 0]} castShadow>
        <boxGeometry args={[width, seatH, depth]} />
        {mat(color)}
      </mesh>
      {/* Backrest */}
      <mesh position={[0, (seatY + height) / 2, -depth / 2 + 0.02]} castShadow>
        <boxGeometry args={[width - 0.06, height - seatY - seatH, 0.03]} />
        {mat(lighter(color, 20))}
      </mesh>
    </group>
  );
}

export function CoffeeTableModel({ color, width, height, depth }: ModelProps) {
  const topH = 0.04;
  const legH = height - topH;
  const legR = 0.03;
  return (
    <group>
      <mesh position={[0, height - topH / 2, 0]} castShadow>
        <boxGeometry args={[width, topH, depth]} />
        {mat(color)}
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx * (width / 2 - 0.06), legH / 2, lz * (depth / 2 - 0.06)]} castShadow>
          <cylinderGeometry args={[legR, legR, legH, 8]} />
          {mat(darker(color, 30))}
        </mesh>
      ))}
    </group>
  );
}

export function DiningTableModel({ color, width, height, depth }: ModelProps) {
  const topH = 0.05;
  const legH = height - topH;
  const legW = 0.06;
  return (
    <group>
      <mesh position={[0, height - topH / 2, 0]} castShadow>
        <boxGeometry args={[width, topH, depth]} />
        {mat(color)}
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx * (width / 2 - 0.08), legH / 2, lz * (depth / 2 - 0.08)]} castShadow>
          <boxGeometry args={[legW, legH, legW]} />
          {mat(darker(color, 25))}
        </mesh>
      ))}
    </group>
  );
}

export function BedModel({ color, width, height, depth }: ModelProps) {
  const frameH = height * 0.35;
  const mattressH = height * 0.35;
  const headH = height * 0.8;
  const legH = height * 0.12;
  return (
    <group>
      {/* Legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx * (width / 2 - 0.06), legH / 2, lz * (depth / 2 - 0.06)]} castShadow>
          <boxGeometry args={[0.08, legH, 0.08]} />
          {mat(darker(color, 40))}
        </mesh>
      ))}
      {/* Frame */}
      <mesh position={[0, legH + frameH / 2, 0]} castShadow>
        <boxGeometry args={[width, frameH, depth]} />
        {mat(darker(color, 20))}
      </mesh>
      {/* Mattress */}
      <mesh position={[0, legH + frameH + mattressH / 2, 0.03]} castShadow>
        <boxGeometry args={[width - 0.06, mattressH, depth - 0.06]} />
        {mat(lighter(color, 30))}
      </mesh>
      {/* Headboard */}
      <mesh position={[0, legH + headH / 2, -depth / 2 + 0.04]} castShadow>
        <boxGeometry args={[width, headH, 0.06]} />
        {mat(color)}
      </mesh>
      {/* Pillows */}
      {[-1, 1].map((side, i) => (
        <mesh key={`p${i}`} position={[side * width * 0.22, legH + frameH + mattressH + 0.06, -depth / 2 + 0.3]} castShadow>
          <boxGeometry args={[width * 0.3, 0.1, 0.3]} />
          <meshStandardMaterial color="#F5F5F0" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function WardrobeModel({ color, width, height, depth }: ModelProps) {
  const doorGap = 0.02;
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        {mat(color)}
      </mesh>
      {/* Left door */}
      <mesh position={[-width / 4, height / 2, depth / 2 + 0.005]} castShadow>
        <boxGeometry args={[width / 2 - doorGap, height - 0.04, 0.02]} />
        {mat(lighter(color, 10))}
      </mesh>
      {/* Right door */}
      <mesh position={[width / 4, height / 2, depth / 2 + 0.005]} castShadow>
        <boxGeometry args={[width / 2 - doorGap, height - 0.04, 0.02]} />
        {mat(lighter(color, 10))}
      </mesh>
      {/* Handles */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.06, height / 2, depth / 2 + 0.02]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export function BookshelfModel({ color, width, height, depth }: ModelProps) {
  const shelfCount = 4;
  const panelThick = 0.03;
  return (
    <group>
      {/* Left side */}
      <mesh position={[-width / 2 + panelThick / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[panelThick, height, depth]} />
        {mat(color)}
      </mesh>
      {/* Right side */}
      <mesh position={[width / 2 - panelThick / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[panelThick, height, depth]} />
        {mat(color)}
      </mesh>
      {/* Back panel */}
      <mesh position={[0, height / 2, -depth / 2 + 0.01]} castShadow>
        <boxGeometry args={[width, height, 0.02]} />
        {mat(darker(color, 15))}
      </mesh>
      {/* Shelves */}
      {Array.from({ length: shelfCount + 1 }).map((_, i) => (
        <mesh key={i} position={[0, (i * height) / shelfCount, 0]} castShadow>
          <boxGeometry args={[width, panelThick, depth]} />
          {mat(color)}
        </mesh>
      ))}
    </group>
  );
}

export function DeskModel({ color, width, height, depth }: ModelProps) {
  const topH = 0.04;
  const legH = height - topH;
  const legW = 0.05;
  return (
    <group>
      {/* Desktop */}
      <mesh position={[0, height - topH / 2, 0]} castShadow>
        <boxGeometry args={[width, topH, depth]} />
        {mat(color)}
      </mesh>
      {/* Left panel leg */}
      <mesh position={[-width / 2 + legW / 2 + 0.02, legH / 2, 0]} castShadow>
        <boxGeometry args={[legW, legH, depth - 0.06]} />
        {mat(darker(color, 15))}
      </mesh>
      {/* Right panel leg */}
      <mesh position={[width / 2 - legW / 2 - 0.02, legH / 2, 0]} castShadow>
        <boxGeometry args={[legW, legH, depth - 0.06]} />
        {mat(darker(color, 15))}
      </mesh>
      {/* Drawer front */}
      <mesh position={[width / 4, height * 0.7, depth / 2 - 0.01]} castShadow>
        <boxGeometry args={[width * 0.35, height * 0.15, 0.02]} />
        {mat(lighter(color, 10))}
      </mesh>
      {/* Drawer handle */}
      <mesh position={[width / 4, height * 0.7, depth / 2 + 0.005]} castShadow>
        <boxGeometry args={[0.08, 0.015, 0.015]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function TVStandModel({ color, width, height, depth }: ModelProps) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        {mat(color)}
      </mesh>
      {/* Open shelf area */}
      <mesh position={[0, height * 0.35, depth / 2 + 0.005]} castShadow>
        <boxGeometry args={[width - 0.08, height * 0.35, 0.01]} />
        {mat(darker(color, 30))}
      </mesh>
      {/* Top surface accent */}
      <mesh position={[0, height + 0.005, 0]} castShadow>
        <boxGeometry args={[width, 0.01, depth]} />
        {mat(lighter(color, 15))}
      </mesh>
    </group>
  );
}

export function NightstandModel({ color, width, height, depth }: ModelProps) {
  const legH = height * 0.2;
  const bodyH = height - legH;
  return (
    <group>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx * (width / 2 - 0.04), legH / 2, lz * (depth / 2 - 0.04)]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, legH, 8]} />
          {mat(darker(color, 30))}
        </mesh>
      ))}
      <mesh position={[0, legH + bodyH / 2, 0]} castShadow>
        <boxGeometry args={[width, bodyH, depth]} />
        {mat(color)}
      </mesh>
      {/* Drawer */}
      <mesh position={[0, legH + bodyH * 0.6, depth / 2 + 0.005]} castShadow>
        <boxGeometry args={[width - 0.04, bodyH * 0.35, 0.015]} />
        {mat(lighter(color, 10))}
      </mesh>
      {/* Handle */}
      <mesh position={[0, legH + bodyH * 0.6, depth / 2 + 0.015]} castShadow>
        <boxGeometry args={[0.06, 0.012, 0.012]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function RugModel({ color, width, depth }: ModelProps) {
  return (
    <mesh position={[0, 0.01, 0]} receiveShadow>
      <boxGeometry args={[width, 0.02, depth]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

export function getFurnitureModel(type: string, props: ModelProps) {
  switch (type) {
    case 'sofa': return <SofaModel {...props} />;
    case 'armchair': return <ArmchairModel {...props} />;
    case 'chair': return <ChairModel {...props} />;
    case 'coffee-table': return <CoffeeTableModel {...props} />;
    case 'dining-table': return <DiningTableModel {...props} />;
    case 'bed': return <BedModel {...props} />;
    case 'wardrobe': return <WardrobeModel {...props} />;
    case 'bookshelf': return <BookshelfModel {...props} />;
    case 'desk': return <DeskModel {...props} />;
    case 'tv-stand': return <TVStandModel {...props} />;
    case 'nightstand': return <NightstandModel {...props} />;
    case 'rug': return <RugModel {...props} />;
    default:
      return (
        <mesh castShadow>
          <boxGeometry args={[props.width, props.height, props.depth]} />
          {mat(props.color)}
        </mesh>
      );
  }
}
