export interface FurnitureItem {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  rotation: number;
  color: string;
}

export interface Design {
  id: string;
  user_id: string;
  name: string;
  room_width: number;
  room_depth: number;
  room_height: number;
  room_shape: string;
  wall_color: string;
  floor_color: string;
  ceiling_color: string;
  furniture: FurnitureItem[];
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export const FURNITURE_CATALOG: Omit<FurnitureItem, 'id' | 'x' | 'y' | 'rotation'>[] = [
  { type: 'sofa', label: 'Sofa', width: 2, height: 0.9, depth: 0.85, color: '#6B5B4F' },
  { type: 'armchair', label: 'Armchair', width: 0.9, height: 0.85, depth: 0.85, color: '#8B7355' },
  { type: 'coffee-table', label: 'Coffee Table', width: 1.2, height: 0.45, depth: 0.6, color: '#A0522D' },
  { type: 'dining-table', label: 'Dining Table', width: 1.6, height: 0.75, depth: 0.9, color: '#8B6914' },
  { type: 'chair', label: 'Chair', width: 0.5, height: 0.85, depth: 0.5, color: '#654321' },
  { type: 'bed', label: 'Bed', width: 1.6, height: 0.5, depth: 2, color: '#D2B48C' },
  { type: 'wardrobe', label: 'Wardrobe', width: 1.8, height: 2.2, depth: 0.6, color: '#5C4033' },
  { type: 'bookshelf', label: 'Bookshelf', width: 1, height: 1.8, depth: 0.35, color: '#8B4513' },
  { type: 'desk', label: 'Desk', width: 1.4, height: 0.75, depth: 0.7, color: '#A0522D' },
  { type: 'tv-stand', label: 'TV Stand', width: 1.5, height: 0.5, depth: 0.4, color: '#2F2F2F' },
  { type: 'nightstand', label: 'Nightstand', width: 0.5, height: 0.55, depth: 0.4, color: '#8B6914' },
  { type: 'rug', label: 'Rug', width: 2, height: 0.02, depth: 1.5, color: '#B8860B' },
];
