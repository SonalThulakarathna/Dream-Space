import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Design } from '@/types/design';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Plus, LogOut, Pencil, Trash2, Clock, Search,
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDesigns();
  }, [user]);

  const loadDesigns = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) toast.error('Failed to load designs');
    else setDesigns((data as unknown as Design[]) || []);
    setLoading(false);
  };

  const createDesign = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('designs')
      .insert({ user_id: user.id, name: 'Untitled Layout' })
      .select()
      .single();
    if (error) toast.error('Failed to create layout');
    else navigate(`/editor/${data.id}`);
  };

  const deleteDesign = async (id: string) => {
    const { error } = await supabase.from('designs').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else {
      setDesigns(designs.filter(d => d.id !== id));
      toast.success('Layout deleted');
    }
  };

  const filtered = designs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="font-display text-lg font-medium tracking-tight text-foreground">
            Draft Space
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
              My Layouts
            </h2>
            <p className="text-sm text-muted-foreground">
              {designs.length} layout{designs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search layouts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56 h-9"
              />
            </div>
            <Button onClick={createDesign} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Layout
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="font-display text-lg font-medium text-foreground">
              {search ? 'No results found' : 'No layouts yet'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {search ? 'Try a different search.' : 'Create your first room layout.'}
            </p>
            {!search && (
              <Button onClick={createDesign} className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                Create Layout
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((design) => (
              <div
                key={design.id}
                className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border"
              >
                <div className="flex h-40 items-center justify-center bg-secondary/50">
                  <div
                    className="rounded-lg border border-dashed border-muted-foreground/30 p-4 flex items-center justify-center"
                    style={{
                      width: `${Math.min(design.room_width * 20, 120)}px`,
                      height: `${Math.min(design.room_depth * 20, 80)}px`,
                      backgroundColor: 'hsl(var(--secondary))',
                    }}
                  >
                    <span className="text-xs text-muted-foreground">
                      {design.room_width}m × {design.room_depth}m
                    </span>
                  </div>
                </div>
                <div className="border-t border-border p-4">
                  <h3 className="font-display font-medium text-foreground truncate">
                    {design.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(design.updated_at).toLocaleDateString()}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => navigate(`/editor/${design.id}`)}
                    >
                      <Pencil className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete layout?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &quot;{design.name}&quot;. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteDesign(design.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
}
