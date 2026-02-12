
import React from 'react';
import { Room, Guest, RoomStatus } from '../types';
import { STATUS_COLORS, STATUS_DOTS, STATUS_LABELS } from '../constants';
import { Users, Bed, CheckSquare, XSquare, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  rooms: Room[];
  guests: Guest[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ rooms, guests }) => {
  const stats = [
    { label: 'Disponíveis', value: rooms.filter(r => r.status === RoomStatus.AVAILABLE).length, icon: <Bed />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ocupados', value: rooms.filter(r => r.status === RoomStatus.OCCUPIED).length, icon: <Users />, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Limpeza', value: rooms.filter(r => r.status === RoomStatus.CLEANING).length, icon: <Activity />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Check-ins Hoje', value: guests.filter(g => g.checkInDate === new Date().toISOString().split('T')[0]).length, icon: <CheckSquare />, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const chartData = [
    { name: 'Livres', value: rooms.filter(r => r.status === RoomStatus.AVAILABLE).length, color: '#10b981' },
    { name: 'Ocupados', value: rooms.filter(r => r.status === RoomStatus.OCCUPIED).length, color: '#f43f5e' },
    { name: 'Limpeza', value: rooms.filter(r => r.status === RoomStatus.CLEANING).length, color: '#f59e0b' },
    { name: 'Manut.', value: rooms.filter(r => r.status === RoomStatus.MAINTENANCE).length, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Bem-vindo, Administrador</h2>
        <p className="text-slate-500">Aqui está o resumo do hotel para hoje.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              {React.cloneElement(stat.icon as React.ReactElement, { size: 24 })}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Occupancy Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Status da Ocupação</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Visualização Rápida dos Quartos</h3>
            <button className="text-blue-600 font-semibold text-sm hover:underline">Ver todos</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <div 
                key={room.id}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 ${STATUS_COLORS[room.status]} shadow-sm`}
              >
                <span className="text-lg font-bold">{room.number}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{STATUS_LABELS[room.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
