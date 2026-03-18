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
  Plus, LogOut, Pencil, Trash2, Square, Clock, Search,
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
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Subtle Grain & Blur Background */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[100px] opacity-30 mix-blend-multiply pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/80 rounded-full blur-[120px] opacity-40 mix-blend-multiply pointer-events-none z-0"></div>

      {/* Header */}
      <header className="border-b border-white/10 bg-background/60 backdrop-blur-xl sticky top-0 z-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }} 
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-foreground text-background shadow-lg border border-white/20"
            >
              <Square className="h-5 w-5 stroke-[1.5]" />
            </motion.div>
            <h1 className="font-display text-[22px] font-medium tracking-tight text-foreground">Draft Space</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-medium text-muted-foreground/80 tracking-wide">{user?.email}</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full h-9 w-9 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all">
                <LogOut className="h-4 w-4 stroke-[1.5]" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <h2 className="font-display text-[28px] font-medium tracking-tight text-foreground">My Layouts</h2>
            <p className="text-muted-foreground/70 text-[13px] font-medium tracking-wide uppercase">{designs.length} layout{designs.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
              <Input
                placeholder="Search layouts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64 shadow-[0_2px_8px_rgb(0,0,0,0.04)] h-11 rounded-xl bg-background/50 backdrop-blur-sm border-white/20 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all duration-300"
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={createDesign} className="shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] h-11 rounded-xl px-5 text-[13px] font-medium transition-all duration-300">
                <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New Layout
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {loading ? (
          <motion.div 
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3].map(i => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div className="h-[280px] animate-pulse rounded-2xl bg-secondary/40 border border-white/5 backdrop-blur-md" />
              </motion.div>
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-secondary/50 backdrop-blur-lg border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Square className="h-10 w-10 text-muted-foreground/60 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-[22px] font-medium tracking-tight text-foreground">
              {search ? 'No results found' : 'No layouts created yet'}
            </h3>
            <p className="mt-3 text-[15px] font-light tracking-wide text-muted-foreground/80 max-w-sm">
              {search ? 'Try adjusting your search query to find what you are looking for.' : 'Start by drafting your first room layout and planning your interior space.'}
            </p>
            {!search && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-10">
                <Button onClick={createDesign} className="h-12 rounded-xl px-6 bg-foreground text-background hover:bg-foreground/90 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4 stroke-[2]" /> Create Layout
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((design, i) => (
              <motion.div
                key={design.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-card/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-foreground/15 hover:bg-card"
              >
                <div
                  className="flex h-48 items-center justify-center bg-secondary/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-secondary/20 pointer-events-none mix-blend-overlay"></div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-xl border-[1.5px] border-dashed border-muted-foreground/30 p-5 flex items-center justify-center backdrop-blur-sm shadow-sm"
                    style={{
                      width: `${Math.min(design.room_width * 20, 140)}px`,
                      height: `${Math.min(design.room_depth * 20, 100)}px`,
                      backgroundColor: 'hsl(var(--secondary) / 0.5)',
                    }}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70">
                      {design.room_width}m × {design.room_depth}m
                    </span>
                  </motion.div>
                </div>
                <div className="p-6 border-t border-white/10 bg-gradient-to-b from-transparent to-background/40">
                  <h3 className="font-display text-[17px] font-medium tracking-tight text-foreground truncate group-hover:text-primary transition-colors duration-300">{design.name}</h3>
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] uppercase font-bold tracking-widest text-muted-foreground/60">
                    <Clock className="h-3 w-3 stroke-[2]" />
                    {new Date(design.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="mt-6 flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full h-10 rounded-lg shadow-sm border border-white/10 bg-background hover:bg-secondary/80 text-[13px] font-medium transition-all duration-300"
                        onClick={() => navigate(`/editor/${design.id}`)}
                      >
                        <Pencil className="mr-2 h-3.5 w-3.5 stroke-[1.5]" /> Edit
                      </Button>
                    </motion.div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-lg border border-transparent text-muted-foreground hover:text-destructive hover:border-destructive/20 hover:bg-destructive/10 transition-all duration-300">
                            <Trash2 className="h-4 w-4 stroke-[1.5]" />
                          </Button>
                        </motion.div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl border-white/20 shadow-2xl backdrop-blur-xl bg-card/95">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display text-xl">Delete Layout?</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm font-light leading-relaxed">
                            This will permanently delete "{design.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel className="rounded-xl h-11 border-white/10 bg-secondary/50 hover:bg-secondary">Cancel</AlertDialogCancel>
                          <AlertDialogAction className="rounded-xl h-11 bg-destructive text-destructive-foreground shadow-[0_4px_14px_0_rgba(255,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,0,0,0.3)] hover:bg-destructive/90 transition-all duration-300" onClick={() => deleteDesign(design.id)}>
                            Delete Layout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
