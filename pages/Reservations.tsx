
import React, { useState } from 'react';
import { Reservation, Room, RoomStatus, PaymentStatus, PaymentMethod } from '../types';
import { CalendarCheck, Plus, Clock, CheckCircle, XCircle, CreditCard, DollarSign, Edit2, Trash2 } from 'lucide-react';

interface ReservationsProps {
  reservations: Reservation[];
  onAddReservation: (res: Reservation) => void;
  onUpdateReservation: (res: Reservation) => void;
  onDeleteReservation: (id: string) => void;
  rooms: Room[];
  onConfirm: (res: Reservation) => void;
}

const Reservations: React.FC<ReservationsProps> = ({ reservations, onAddReservation, onUpdateReservation, onDeleteReservation, rooms, onConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [resToDelete, setResToDelete] = useState<string | null>(null);
  const [newRes, setNewRes] = useState({
    guestName: '',
    document: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    roomId: '',
    status: 'Pending' as const,
    notes: '',
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: PaymentMethod.PIX,
    amountPaid: 0
  });

  const resetForm = () => {
    setNewRes({ 
      guestName: '', 
      document: '',
      phone: '',
      email: '',
      date: '', 
      time: '',
      roomId: '', 
      status: 'Pending', 
      notes: '',
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.PIX,
      amountPaid: 0
    });
    setEditingId(null);
  };

  const addReservation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      onUpdateReservation({ ...newRes, id: editingId });
    } else {
      const reservation: Reservation = {
        ...newRes,
        id: Math.random().toString(36).substr(2, 9),
      };
      onAddReservation(reservation);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (res: Reservation) => {
    setEditingId(res.id);
    setNewRes({
      guestName: res.guestName,
      document: res.document,
      phone: res.phone,
      email: res.email,
      date: res.date,
      time: res.time,
      roomId: res.roomId,
      status: res.status,
      notes: res.notes,
      paymentStatus: res.paymentStatus,
      paymentMethod: res.paymentMethod,
      amountPaid: res.amountPaid
    });
    setIsModalOpen(true);
  };

  const deleteReservation = (id: string) => {
    onDeleteReservation(id);
    setResToDelete(null);
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Reservas</h2>
          <p className="text-white/60">Gerencie futuras estadias e reservas pendentes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          Nova Reserva
        </button>
      </div>

      <div className="bg-[#955251] rounded-[32px] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-black/20 text-white/50 text-[10px] uppercase tracking-[2px] font-black">
              <tr>
                <th className="px-8 py-6">Hóspede</th>
                <th className="px-8 py-6">Data</th>
                <th className="px-8 py-6 text-center">Quarto</th>
                <th className="px-8 py-6">Pagamento</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reservations.length > 0 ? reservations.map((res) => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-black text-white text-lg tracking-tight">{res.guestName}</span>
                    {res.notes && (
                      <div className="mt-1 flex items-start gap-2 p-2 bg-black/20 rounded-lg border border-white/5 max-w-[250px]">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider shrink-0 mt-0.5">Obs:</span>
                        <p className="text-[11px] text-white/70 font-medium leading-relaxed leading-tight">{res.notes}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-white/70 font-bold">
                      <Clock size={14} className="text-blue-400" />
                      {res.date ? new Date(res.date).toLocaleDateString('pt-BR') : 'Sem data'} <span className="text-[10px] text-white/30">{res.time}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <div className="inline-flex bg-black/30 border border-white/10 px-4 py-1.5 rounded-xl">
                        <span className="text-white font-black">Q-{rooms.find(r => r.id === res.roomId)?.number || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${res.paymentStatus === PaymentStatus.PAID ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {res.paymentStatus}
                        </span>
                        <span className="text-[10px] font-bold text-white/30">{res.paymentMethod}</span>
                      </div>
                      <div className="text-sm font-black text-white">
                        R$ {res.amountPaid.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                        res.status === 'Confirmed' ? 'bg-emerald-600 text-white border-emerald-400' : 
                        res.status === 'Pending' ? 'bg-amber-500 text-white border-amber-300' : 
                        'bg-rose-600 text-white border-rose-400'
                      }`}>
                        {res.status === 'Confirmed' ? 'Confirmado' : res.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2 justify-center">
                       <button 
                         onClick={() => onConfirm(res)}
                         className="p-3 text-emerald-400 hover:bg-emerald-500/10 rounded-2xl transition-colors"
                         title="Confirmar Check-in"
                       >
                         <CheckCircle size={20} />
                       </button>
                       <button 
                         onClick={() => handleEdit(res)}
                         className="p-3 text-blue-400 hover:bg-blue-500/10 rounded-2xl transition-colors"
                         title="Editar Reserva"
                       >
                         <Edit2 size={20} />
                       </button>
                       <button 
                         onClick={() => setResToDelete(res.id)}
                         className="p-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-colors"
                         title="Excluir Reserva"
                       >
                         <XCircle size={20} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-white/30 italic font-medium">
                    Nenhuma reserva agendada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#955251] rounded-[32px] w-full max-w-2xl shadow-2xl p-8 animate-in slide-in-from-bottom-4 border border-white/10">
            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase">
              {editingId ? 'Editar Reserva' : 'Agendar Reserva'}
            </h3>
            <form onSubmit={addReservation} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Nome do Hóspede</label>
                <input type="text" value={newRes.guestName} onChange={e => setNewRes({...newRes, guestName: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">CPF / RG</label>
                <input type="text" value={newRes.document} onChange={e => setNewRes({...newRes, document: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Telefone</label>
                <input type="text" value={newRes.phone} onChange={e => setNewRes({...newRes, phone: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">E-mail</label>
                <input type="email" value={newRes.email} onChange={e => setNewRes({...newRes, email: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Quarto</label>
                <select value={newRes.roomId} onChange={e => setNewRes({...newRes, roomId: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white">
                  <option value="" className="bg-slate-800">Selecione...</option>
                  {rooms.filter(r => r.status === RoomStatus.AVAILABLE || r.id === newRes.roomId).map(r => <option key={r.id} value={r.id} className="bg-slate-800">{r.number} ({r.type})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Data da Reserva</label>
                  <input type="date" value={newRes.date} onChange={e => setNewRes({...newRes, date: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Hora</label>
                  <input type="time" value={newRes.time} onChange={e => setNewRes({...newRes, time: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Status Pagamento</label>
                <select value={newRes.paymentStatus} onChange={e => setNewRes({...newRes, paymentStatus: e.target.value as PaymentStatus})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white">
                  {Object.values(PaymentStatus).map(status => <option key={status} value={status} className="bg-slate-800">{status}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Método</label>
                <select value={newRes.paymentMethod} onChange={e => setNewRes({...newRes, paymentMethod: e.target.value as PaymentMethod})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white">
                  {Object.values(PaymentMethod).map(method => <option key={method} value={method} className="bg-slate-800">{method}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Valor Pago</label>
                <input type="number" step="0.01" value={newRes.amountPaid} onChange={e => setNewRes({...newRes, amountPaid: parseFloat(e.target.value)})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Observações</label>
                <textarea rows={2} value={newRes.notes} onChange={e => setNewRes({...newRes, notes: e.target.value})} className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-white" />
              </div>
              <div className="md:col-span-2 flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }} 
                  className="flex-1 px-6 py-4 font-bold text-white/50 hover:bg-white/5 rounded-2xl transition-all"
                >
                  Fechar
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  {editingId ? 'Salvar Alterações' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#955251] rounded-[32px] w-full max-w-sm shadow-2xl p-8 animate-in zoom-in duration-200 border border-white/10 text-center">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} className="text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">Excluir Reserva?</h3>
            <p className="text-white/60 font-medium mb-8">Esta ação removerá a reserva permanentemente.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setResToDelete(null)} 
                className="flex-1 px-6 py-4 font-bold text-white/50 hover:bg-white/5 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => deleteReservation(resToDelete)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
