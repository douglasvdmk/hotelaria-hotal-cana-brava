
import React from 'react';
import { Room, RoomStatus } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { RefreshCw, Wrench, Eraser, Check, ShoppingCart } from 'lucide-react';

interface RoomsProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const Rooms: React.FC<RoomsProps> = ({ rooms, setRooms }) => {
  const updateStatus = (id: string, newStatus: RoomStatus) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Controle de Quartos</h2>
        <p className="text-slate-500">Monitore o status de limpeza e disponibilidade em tempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-3xl font-black text-slate-800 tracking-tighter">#{room.number}</span>
                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">{room.type}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${STATUS_COLORS[room.status]}`}>
                {STATUS_LABELS[room.status]}
              </div>
            </div>

            {room.status === RoomStatus.OCCUPIED && (
              <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShoppingCart size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Extras</span>
                </div>
                <span className="text-lg font-black text-emerald-800">R$ {room.extraCharges.toFixed(2)}</span>
              </div>
            )}

            <div className="space-y-3 mt-auto">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mudar Status:</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.AVAILABLE)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${room.status === RoomStatus.AVAILABLE ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}`}
                >
                  <Check size={16} /> Disponível
                </button>
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.OCCUPIED)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${room.status === RoomStatus.OCCUPIED ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-rose-200 hover:text-rose-600'}`}
                >
                  <RefreshCw size={16} /> Ocupado
                </button>
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.CLEANING)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${room.status === RoomStatus.CLEANING ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-amber-200 hover:text-amber-600'}`}
                >
                  <Eraser size={16} /> Limpeza
                </button>
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.MAINTENANCE)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${room.status === RoomStatus.MAINTENANCE ? 'bg-slate-600 text-white border-slate-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300 hover:text-slate-800'}`}
                >
                  <Wrench size={16} /> Manut.
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
