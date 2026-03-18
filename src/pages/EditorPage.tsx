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

  const addFurniture = useCallback((catalog: (typeof FURNITURE_CATALOG)[0]) => {
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
        furniture: design.furniture as object,
      })
      .eq('id', id);
    setSaving(false);
    if (error) toast.error('Failed to save');
    else toast.success('Layout saved');
  };

  if (loading || !design) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading layout...</p>
      </div>
    );
  }

  const selectedItem = design.furniture.find(f => f.id === selectedId) || null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-screen flex-col bg-background"
    >
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-display text-sm font-medium text-foreground">
            {design.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-secondary p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                viewMode === '2d'
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="mr-1.5 inline h-3.5 w-3.5" />
              2D
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                viewMode === '3d'
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Box className="mr-1.5 inline h-3.5 w-3.5" />
              3D
            </button>
          </div>
          <Button onClick={saveDesign} disabled={saving} size="sm">
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
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
