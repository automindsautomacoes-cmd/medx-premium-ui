import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import Aurora from '@/components/backgrounds/Aurora';
import Galaxy from '@/components/backgrounds/Galaxy';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const DashboardLayout = ({ children, requiredRoles }: DashboardLayoutProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role || '')) {
    return <Navigate to="/agenda" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-background relative overflow-hidden">
      {/* Premium Background Layering */}
      <div className="absolute inset-0 z-0">
        <Galaxy opacity={0.1} maxStars={120} />
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <Aurora colorStops={["#00FFFF", "#5227FF", "#00FFFF"]} speed={0.5} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      </div>
      
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-gutter-stable">
        {children}
      </main>
    </div>
  );
};
