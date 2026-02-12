
import React, { useState } from 'react';
import { Reservation, Room } from '../types';
import { CalendarCheck, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ReservationsProps {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  rooms: Room[];
}

const Reservations: React.FC<ReservationsProps> = ({ reservations, setReservations, rooms }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRes, setNewRes] = useState({
    guestName: '',
    date: '',
    roomId: '',
    status: 'Pending' as const,
    notes: ''
  });

  const addReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservations([...reservations, { ...newRes, id: Math.random().toString(36).substr(2, 9) }]);
    setIsModalOpen(false);
    setNewRes({ guestName: '', date: '', roomId: '', status: 'Pending', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reservas</h2>
          <p className="text-slate-500">Gerencie futuras estadias e reservas pendentes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          Nova Reserva
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">Hóspede</th>
                <th className="px-6 py-5">Data da Reserva</th>
                <th className="px-6 py-5">Quarto</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.length > 0 ? reservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-bold text-slate-800">{res.guestName}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{res.notes || 'Sem observações'}</p>
                  </td>
                  <td className="px-6 py-5 text-slate-600 font-medium">
                    {new Date(res.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">
                    Q-{rooms.find(r => r.id === res.roomId)?.number || 'N/A'}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      res.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      res.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {res.status === 'Confirmed' ? 'Confirmado' : res.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                       <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"><CheckCircle size={18} /></button>
                       <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><XCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic font-medium">
                    Nenhuma reserva agendada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8 animate-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tighter uppercase">Agendar Reserva</h3>
            <form onSubmit={addReservation} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Hóspede</label>
                <input required type="text" value={newRes.guestName} onChange={e => setNewRes({...newRes, guestName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Data</label>
                  <input required type="date" value={newRes.date} onChange={e => setNewRes({...newRes, date: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Quarto</label>
                  <select required value={newRes.roomId} onChange={e => setNewRes({...newRes, roomId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium">
                    <option value="">Selecione...</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.number} ({r.type})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Observações</label>
                <textarea rows={3} value={newRes.notes} onChange={e => setNewRes({...newRes, notes: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Fechar</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
