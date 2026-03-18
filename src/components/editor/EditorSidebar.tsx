import { FurnitureItem, FURNITURE_CATALOG } from '@/types/design';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  RotateCw, Trash2, Sofa, Armchair as ArmchairIcon,
  BedDouble, BookOpen, Tv, Table, Lamp,
} from 'lucide-react';

interface EditorSidebarProps {
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  roomShape: string;
  designName: string;
  selectedItem: FurnitureItem | null;
  onUpdateRoom: (updates: Record<string, unknown>) => void;
  onAddFurniture: (catalog: (typeof FURNITURE_CATALOG)[0]) => void;
  onUpdateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  onDeleteFurniture: (id: string) => void;
  onRotateFurniture: (id: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sofa: Sofa,
  armchair: ArmchairIcon,
  bed: BedDouble,
  bookshelf: BookOpen,
  'tv-stand': Tv,
  'dining-table': Table,
  'coffee-table': Table,
  desk: Table,
  nightstand: Lamp,
};

export default function EditorSidebar({
  roomWidth,
  roomDepth,
  roomHeight,
  wallColor,
  floorColor,
  ceilingColor,
  roomShape,
  designName,
  selectedItem,
  onUpdateRoom,
  onAddFurniture,
  onUpdateFurniture,
  onDeleteFurniture,
  onRotateFurniture,
}: EditorSidebarProps) {
  return (
    <div className="w-72 shrink-0 border-r border-border bg-card flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Layout name
            </Label>
            <Input
              value={designName}
              onChange={(e) => onUpdateRoom({ name: e.target.value })}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">
              Room dimensions
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Width (m)</Label>
                <Input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => onUpdateRoom({ room_width: Number(e.target.value) })}
                  min={2}
                  max={20}
                  step={0.5}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Depth (m)</Label>
                <Input
                  type="number"
                  value={roomDepth}
                  onChange={(e) => onUpdateRoom({ room_depth: Number(e.target.value) })}
                  min={2}
                  max={20}
                  step={0.5}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Height (m)</Label>
                <Input
                  type="number"
                  value={roomHeight}
                  onChange={(e) => onUpdateRoom({ room_height: Number(e.target.value) })}
                  min={2}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Shape</Label>
              <select
                value={roomShape}
                onChange={(e) => onUpdateRoom({ room_shape: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="rectangular">Rectangular</option>
                <option value="square">Square</option>
                <option value="l-shaped">L-shaped</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Walls</Label>
                <input
                  type="color"
                  value={wallColor}
                  onChange={(e) => onUpdateRoom({ wall_color: e.target.value })}
                  className="h-8 w-full cursor-pointer rounded border border-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Floor</Label>
                <input
                  type="color"
                  value={floorColor}
                  onChange={(e) => onUpdateRoom({ floor_color: e.target.value })}
                  className="h-8 w-full cursor-pointer rounded border border-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Ceiling</Label>
                <input
                  type="color"
                  value={ceilingColor}
                  onChange={(e) => onUpdateRoom({ ceiling_color: e.target.value })}
                  className="h-8 w-full cursor-pointer rounded border border-input"
                />
              </div>
            </div>
          </div>

          <Separator />

          {selectedItem && (
            <>
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">
                  Selected: {selectedItem.label}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Width (m)</Label>
                    <Input
                      type="number"
                      value={selectedItem.width}
                      onChange={(e) =>
                        onUpdateFurniture(selectedItem.id, {
                          width: Number(e.target.value),
                        })
                      }
                      min={0.2}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Depth (m)</Label>
                    <Input
                      type="number"
                      value={selectedItem.depth}
                      onChange={(e) =>
                        onUpdateFurniture(selectedItem.id, {
                          depth: Number(e.target.value),
                        })
                      }
                      min={0.2}
                      step={0.1}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Color</Label>
                  <input
                    type="color"
                    value={selectedItem.color}
                    onChange={(e) =>
                      onUpdateFurniture(selectedItem.id, { color: e.target.value })
                    }
                    className="h-8 w-full cursor-pointer rounded border border-input"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => onRotateFurniture(selectedItem.id)}
                  >
                    <RotateCw className="mr-1 h-3 w-3" />
                    Rotate 45°
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteFurniture(selectedItem.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Separator />
            </>
          )}

          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">
              Add furniture
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {FURNITURE_CATALOG.map((item) => {
                const Icon = iconMap[item.type] ?? Sofa;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => onAddFurniture(item)}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 text-xs text-foreground hover:bg-secondary"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
