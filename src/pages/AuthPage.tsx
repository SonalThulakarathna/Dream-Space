import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Square, LogIn, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        toast.success('Account created. Please check your email.');
      } else {
        await signIn(email, password);
        toast.success('Signed in successfully.');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="flex min-h-screen items-center justify-center bg-background/50 p-4 relative overflow-hidden"
  >
    {/* Subtle Background Pattern / Blur */}
    <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>

    <div className="w-full max-w-md relative z-10">
      <div className="mb-10 text-center relative z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-xl backdrop-blur-md border border-white/10"
        >
          <Square className="h-6 w-6 stroke-[1.5]" />
        </motion.div>
        <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">Draft Space</h1>
        <p className="mt-2 text-sm text-muted-foreground/80 font-light tracking-wide">Plan and structure interior layouts</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/20 bg-card/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl relative z-10"
      >
          <div className="mb-6 flex gap-2 rounded-xl bg-secondary/50 p-1.5 backdrop-blur-sm shadow-inner border border-white/10">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 rounded-lg py-2.5 text-[13px] font-medium transition-all duration-300 ease-out ${
                !isSignUp ? 'bg-background text-foreground shadow-[0_2px_10px_rgb(0,0,0,0.06)] scale-100' : 'text-muted-foreground hover:text-foreground scale-95 opacity-70 hover:opacity-100 hover:bg-secondary/40'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 rounded-lg py-2.5 text-[13px] font-medium transition-all duration-300 ease-out ${
                isSignUp ? 'bg-background text-foreground shadow-[0_2px_10px_rgb(0,0,0,0.06)] scale-100' : 'text-muted-foreground hover:text-foreground scale-95 opacity-70 hover:opacity-100 hover:bg-secondary/40'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="name" className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  required={isSignUp}
                  className="bg-background/40 backdrop-blur-sm border-border/50 h-11 focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-xl transition-all duration-300"
                />
              </motion.div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="bg-background/40 backdrop-blur-sm border-border/50 h-11 focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-xl transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-background/40 backdrop-blur-sm border-border/50 h-11 focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-xl transition-all duration-300"
              />
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 text-[13px] font-medium"
              >
                {loading ? 'Processing...' : isSignUp ? (
                  <><UserPlus className="mr-2 h-4 w-4 stroke-[1.5]" /> Create Account</>
                ) : (
                  <><LogIn className="mr-2 h-4 w-4 stroke-[1.5]" /> Sign In</>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
