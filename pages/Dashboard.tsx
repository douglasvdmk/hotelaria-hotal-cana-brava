
import React, { useState } from 'react';
import { Room, Guest, RoomStatus } from '../types';
import { STATUS_COLORS, STATUS_DOTS, STATUS_LABELS } from '../constants';
import { Users, Bed, CheckSquare, XSquare, Activity, ArrowUpDown, LayoutGrid } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  rooms: Room[];
  guests: Guest[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ rooms, guests, onNavigate }) => {
  const [sortOrder, setSortOrder] = useState<'number' | 'available' | 'occupied' | 'reserved'>('number');

  const getSortedRooms = () => {
    const sorted = [...rooms];
    if (sortOrder === 'number') {
      return sorted.sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
    }
    if (sortOrder === 'available') {
      return sorted.sort((a, b) => {
        if (a.status === RoomStatus.AVAILABLE && b.status !== RoomStatus.AVAILABLE) return -1;
        if (a.status !== RoomStatus.AVAILABLE && b.status === RoomStatus.AVAILABLE) return 1;
        return a.number.localeCompare(b.number, undefined, { numeric: true });
      });
    }
    if (sortOrder === 'occupied') {
      return sorted.sort((a, b) => {
        if (a.status === RoomStatus.OCCUPIED && b.status !== RoomStatus.OCCUPIED) return -1;
        if (a.status !== RoomStatus.OCCUPIED && b.status === RoomStatus.OCCUPIED) return 1;
        return a.number.localeCompare(b.number, undefined, { numeric: true });
      });
    }
    if (sortOrder === 'reserved') {
      return sorted.sort((a, b) => {
        if (a.status === RoomStatus.RESERVED && b.status !== RoomStatus.RESERVED) return -1;
        if (a.status !== RoomStatus.RESERVED && b.status === RoomStatus.RESERVED) return 1;
        return a.number.localeCompare(b.number, undefined, { numeric: true });
      });
    }
    return sorted;
  };

  const stats = [
    { label: 'Disponíveis', value: rooms.filter(r => r.status === RoomStatus.AVAILABLE).length, icon: <Bed />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ocupados', value: rooms.filter(r => r.status === RoomStatus.OCCUPIED).length, icon: <Users />, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Limpeza', value: rooms.filter(r => r.status === RoomStatus.CLEANING).length, icon: <Activity />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Check-ins Hoje', value: guests.filter(g => g.checkInDate === new Date().toISOString().split('T')[0]).length, icon: <CheckSquare />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Reservados', value: rooms.filter(r => r.status === RoomStatus.RESERVED).length, icon: <LayoutGrid />, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const chartData = [
    { name: 'Livres', value: rooms.filter(r => r.status === RoomStatus.AVAILABLE).length, color: '#10b981' },
    { name: 'Ocupados', value: rooms.filter(r => r.status === RoomStatus.OCCUPIED).length, color: '#f43f5e' },
    { name: 'Reserv.', value: rooms.filter(r => r.status === RoomStatus.RESERVED).length, color: '#2563eb' },
    { name: 'Limpeza', value: rooms.filter(r => r.status === RoomStatus.CLEANING).length, color: '#f59e0b' },
    { name: 'Manut.', value: rooms.filter(r => r.status === RoomStatus.MAINTENANCE).length, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <header>
        <h2 className="text-2xl font-bold text-white">Bem-vindo, Administrador</h2>
        <p className="text-white/60">Aqui está o resumo do hotel para hoje.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#955251] p-6 rounded-[32px] border border-white/10 shadow-xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.05] hover:bg-[#a66362]">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl mb-1 shadow-inner`}>
              {React.cloneElement(stat.icon as React.ReactElement, { size: 28 })}
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[2px] mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-white leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Occupancy Chart */}
        <div className="lg:col-span-1 bg-[#955251] p-6 rounded-2xl border border-white/5 shadow-sm">
          <h3 className="text-lg font-bold text-white mb-6">Status da Ocupação</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#955251', color: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Status List */}
        <div className="lg:col-span-2 bg-[#955251] p-6 rounded-2xl border border-white/5 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Visualização Rápida dos Quartos</h3>
              <div className="flex items-center gap-2 mt-1">
                <button 
                  onClick={() => setSortOrder('number')}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider transition-colors ${sortOrder === 'number' ? 'bg-white text-[#955251]' : 'bg-black/20 text-white/40 hover:text-white/60'}`}
                >
                  Número
                </button>
                <button 
                  onClick={() => setSortOrder('available')}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider transition-colors ${sortOrder === 'available' ? 'bg-emerald-500 text-white' : 'bg-black/20 text-white/40 hover:text-white/60'}`}
                >
                  Livres
                </button>
                <button 
                  onClick={() => setSortOrder('occupied')}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider transition-colors ${sortOrder === 'occupied' ? 'bg-rose-500 text-white' : 'bg-black/20 text-white/40 hover:text-white/60'}`}
                >
                  Ocupados
                </button>
                <button 
                  onClick={() => setSortOrder('reserved')}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider transition-colors ${sortOrder === 'reserved' ? 'bg-blue-500 text-white' : 'bg-black/20 text-white/40 hover:text-white/60'}`}
                >
                  Reservados
                </button>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('rooms')}
              className="text-blue-300 font-bold text-xs uppercase tracking-widest hover:text-blue-200 transition-colors flex items-center gap-2 group"
            >
              Ver todos <ArrowUpDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {getSortedRooms().map((room) => (
              <div 
                key={room.id}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md ${
                   room.status === RoomStatus.AVAILABLE ? 'bg-emerald-600 border-emerald-400 text-white' : 
                   room.status === RoomStatus.OCCUPIED ? 'bg-rose-600 border-rose-400 text-white' :
                   room.status === RoomStatus.CLEANING ? 'bg-amber-500 border-amber-300 text-white' :
                   room.status === RoomStatus.RESERVED ? 'bg-blue-600 border-blue-400 text-white' :
                   'bg-slate-600 border-slate-400 text-white'
                }`}
              >
                <span className="text-xl font-black">{room.number}</span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none drop-shadow-sm">{STATUS_LABELS[room.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
