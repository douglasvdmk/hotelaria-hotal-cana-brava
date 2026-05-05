
import React from 'react';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '../constants';
import { LogOut, Hotel, X } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
  hotelName: string;
  primaryColor: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isConnected: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout, hotelName, primaryColor, isOpen, setIsOpen, isConnected }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#955251] border-r border-white/5 flex flex-col h-full shadow-2xl lg:shadow-none text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg text-white" style={{ backgroundColor: primaryColor }}>
              <Hotel size={24} />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight leading-tight uppercase line-clamp-1">{hotelName}</h1>
              <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">Recepção</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentPage === item.id 
                ? 'bg-white/10' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
            style={currentPage === item.id ? { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
          >
            <span className={`${currentPage === item.id ? '' : 'text-white/40 group-hover:text-white/70'}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-1">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentPage === item.id 
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`${currentPage === item.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="mx-4 my-2 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]'}`} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
              {isConnected ? 'Supabase Conectado' : 'Sem Conexão'}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-300 hover:bg-rose-500/20 transition-colors font-medium"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
