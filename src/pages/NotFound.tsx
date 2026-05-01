import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Página não encontrada</h2>
          <p className="text-muted-foreground">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-8">
          <a href="/dashboard">Voltar ao Painel</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
