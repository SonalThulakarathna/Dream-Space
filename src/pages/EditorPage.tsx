import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Design, FurnitureItem, FURNITURE_CATALOG } from '@/types/design';
import Canvas2D from '@/components/editor/Canvas2D';
import Room3DView from '@/components/editor/Room3DView';
import EditorSidebar from '@/components/editor/EditorSidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Box, LayoutGrid } from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {   
    if (!id || !user) return;
    supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error('Design not found');
          navigate('/');
        } else {
          setDesign(data as unknown as Design);
        }
        setLoading(false);
      });
  }, [id, user, navigate]);

  const updateDesign = useCallback((updates: Partial<Design>) => {
    if (!design) return;
    setDesign({ ...design, ...updates } as Design);
  }, [design]);

  const updateFurniture = useCallback((itemId: string, updates: Partial<FurnitureItem>) => {
    if (!design) return;
    const newFurniture = design.furniture.map(f =>
      f.id === itemId ? { ...f, ...updates } : f
    );
    setDesign({ ...design, furniture: newFurniture });
  }, [design]);

  const addFurniture = useCallback((catalog: typeof FURNITURE_CATALOG[0]) => {
    if (!design) return;
    const newItem: FurnitureItem = {
      ...catalog,
      id: crypto.randomUUID(),
      x: Math.random() * (design.room_width - catalog.width),
      y: Math.random() * (design.room_depth - catalog.depth),
      rotation: 0,
    };
    setDesign({ ...design, furniture: [...design.furniture, newItem] });
    setSelectedId(newItem.id);
  }, [design]);

  const deleteFurniture = useCallback((itemId: string) => {
    if (!design) return;
    setDesign({ ...design, furniture: design.furniture.filter(f => f.id !== itemId) });
    if (selectedId === itemId) setSelectedId(null);
  }, [design, selectedId]);

  const rotateFurniture = useCallback((itemId: string) => {
    if (!design) return;
    const item = design.furniture.find(f => f.id === itemId);
    if (item) updateFurniture(itemId, { rotation: (item.rotation + 45) % 360 });
  }, [design, updateFurniture]);

  const saveDesign = async () => {
    if (!design || !id) return;
    setSaving(true);
    const { error } = await supabase
      .from('designs')
      .update({
        name: design.name,
        room_width: design.room_width,
        room_depth: design.room_depth,
        room_height: design.room_height,
        room_shape: design.room_shape,
        wall_color: design.wall_color,
        floor_color: design.floor_color,
        ceiling_color: design.ceiling_color,
        furniture: design.furniture as any,
      })
      .eq('id', id);
    setSaving(false);
    if (error) toast.error('Failed to save');
    else toast.success('Layout saved.');
  };

  if (loading || !design) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-mono text-sm text-muted-foreground uppercase tracking-wider">Loading layout...</div>
      </div>
    );
  }

  const selectedItem = design.furniture.find(f => f.id === selectedId) || null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex h-screen flex-col bg-background relative overflow-hidden"
    >
      {/* Subtle Grain Background */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay z-0"></div>

      {/* Toolbar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-card/60 backdrop-blur-xl px-6 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-20 relative">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full h-9 w-9 text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all duration-300 border border-transparent hover:border-white/10 shadow-sm">
              <ArrowLeft className="h-4 w-4 stroke-[2]" />
            </Button>
          </motion.div>
          <div className="h-5 w-px bg-white/10" />
          <span className="font-display text-[15px] font-medium tracking-tight text-foreground/90">{design.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex rounded-xl bg-secondary/40 p-1 backdrop-blur-md shadow-inner border border-white/5">
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-[12px] font-semibold tracking-wide uppercase transition-all duration-300 ease-out ${
                viewMode === '2d'
                  ? 'bg-background text-foreground shadow-[0_2px_10px_rgb(0,0,0,0.06)] scale-100'
                  : 'text-muted-foreground/70 hover:text-foreground scale-95 hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 stroke-[2]" /> 2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-[12px] font-semibold tracking-wide uppercase transition-all duration-300 ease-out ${
                viewMode === '3d'
                  ? 'bg-background text-foreground shadow-[0_2px_10px_rgb(0,0,0,0.06)] scale-100'
                  : 'text-muted-foreground/70 hover:text-foreground scale-95 hover:bg-white/5'
              }`}
            >
              <Box className="h-3.5 w-3.5 stroke-[2]" /> 3D
            </button>
          </div>
          <div className="h-5 w-px bg-white/10" />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={saveDesign}
              disabled={saving}
              className="shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 h-9 rounded-lg px-4 text-[13px] font-medium"
            >
              <Save className="mr-2 h-3.5 w-3.5 stroke-[2]" />
              {saving ? 'Saving...' : 'Save Layout'}
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Editor */}
      <div className="flex flex-1 overflow-hidden relative">
        <EditorSidebar
          roomWidth={design.room_width}
          roomDepth={design.room_depth}
          roomHeight={design.room_height}
          wallColor={design.wall_color}
          floorColor={design.floor_color}
          ceilingColor={design.ceiling_color}
          roomShape={design.room_shape}
          designName={design.name}
          selectedItem={selectedItem}
          onUpdateRoom={updateDesign}
          onAddFurniture={addFurniture}
          onUpdateFurniture={updateFurniture}
          onDeleteFurniture={deleteFurniture}
          onRotateFurniture={rotateFurniture}
        />
        {viewMode === '2d' ? (
          <Canvas2D
            roomWidth={design.room_width}
            roomDepth={design.room_depth}
            wallColor={design.wall_color}
            floorColor={design.floor_color}
            furniture={design.furniture}
            selectedId={selectedId}
            onSelectFurniture={setSelectedId}
            onUpdateFurniture={updateFurniture}
          />
        ) : (
          <Room3DView
            roomWidth={design.room_width}
            roomDepth={design.room_depth}
            roomHeight={design.room_height}
            wallColor={design.wall_color}
            floorColor={design.floor_color}
            ceilingColor={design.ceiling_color}
            furniture={design.furniture}
            selectedId={selectedId}
            onSelectFurniture={setSelectedId}
          />
        )}
      </div>
    </motion.div>
  );
}
