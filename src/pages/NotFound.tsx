import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-2xl font-medium tracking-tight text-foreground">
          404
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Page not found
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
