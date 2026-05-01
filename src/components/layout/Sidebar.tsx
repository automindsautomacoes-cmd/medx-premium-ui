import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Calendar, ClipboardList, MessageSquare, Users, MessageCircle, Video, Plug, Settings, LogOut, Building2, FileSpreadsheet, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Métricas', roles: ['owner'] },
    { path: '/agenda', icon: Calendar, label: 'Agenda', roles: ['owner', 'doctor', 'secretary'] },
    { path: '/follow-up', icon: ClipboardList, label: 'Follow Up', roles: ['owner', 'secretary'] },
    { path: '/assistant', icon: MessageSquare, label: 'Assistente', roles: ['owner', 'doctor', 'secretary'] },
    { icon: Users, label: 'Pacientes', roles: ['owner', 'doctor', 'secretary'], children: [{ path: '/patients', label: 'Pacientes CRM' }, { path: '/pre-patients', label: 'Pré Pacientes' }] },
    { path: '/convenios', icon: Building2, label: 'Convênios', roles: ['doctor'] },
    { path: '/profile', icon: UserCircle, label: 'Meu Perfil', roles: ['owner', 'doctor', 'secretary'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="h-screen w-64 bg-[#050505]/80 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-hidden relative z-50">
      <div className="p-6 flex justify-center flex-shrink-0">
        <img src="/logo-interno.png" alt="MedX" className="w-32 h-32 object-contain" />
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          item.children ? (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="ml-6 space-y-1">
                {item.children.map((child: any) => (
                  <NavLink key={child.path} to={child.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-sidebar-foreground/70 hover:bg-white/5'}`}>
                    <span className="text-xs font-medium">{child.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-sidebar-foreground/80 hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          )
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair</span>
        </Button>
      </div>
    </div>
  );
};
