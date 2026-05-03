
import React, { useState } from 'react';
import { Guest, Room, RoomStatus, PaymentStatus, PaymentMethod } from '../types';
import { UserPlus, Search, Edit2, Trash2, Calendar, CreditCard, DollarSign } from 'lucide-react';

interface GuestsProps {
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  onDeleteGuest: (id: string) => void;
  rooms: Room[];
  prefilledData?: Partial<Guest> | null;
  onClearPrefilled?: () => void;
}

const Guests: React.FC<GuestsProps> = ({ guests, setGuests, onDeleteGuest, rooms, prefilledData, onClearPrefilled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    phone: '',
    email: '',
    checkInDate: '',
    checkInTime: '',
    checkOutDate: '',
    checkOutTime: '',
    roomId: '',
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: PaymentMethod.PIX,
    amountPaid: 0,
    notes: ''
  });

  const resetForm = () => {
    setFormData({ 
      name: '', 
      document: '', 
      phone: '', 
      email: '', 
      checkInDate: '', 
      checkInTime: '',
      checkOutDate: '', 
      checkOutTime: '',
      roomId: '',
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.PIX,
      amountPaid: 0,
      notes: ''
    });
    setEditingId(null);
  };

  React.useEffect(() => {
    if (prefilledData) {
      setFormData(prev => ({
        ...prev,
        ...prefilledData,
        name: prefilledData.name || '',
        document: prefilledData.document || '',
        phone: prefilledData.phone || '',
        email: prefilledData.email || '',
        checkInDate: prefilledData.checkInDate || '',
        checkInTime: prefilledData.checkInTime || '',
        roomId: prefilledData.roomId || '',
        paymentStatus: prefilledData.paymentStatus || PaymentStatus.PENDING,
        paymentMethod: prefilledData.paymentMethod || PaymentMethod.PIX,
        amountPaid: prefilledData.amountPaid || 0,
        notes: prefilledData.notes || '',
      }));
      setIsModalOpen(true);
      if (onClearPrefilled) onClearPrefilled();
    }
  }, [prefilledData, onClearPrefilled]);

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.document.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setGuests(guests.map(g => g.id === editingId ? { ...g, ...formData } : g));
    } else {
      const newGuest: Guest = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setGuests([...guests, newGuest]);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setFormData({
      name: guest.name,
      document: guest.document,
      phone: guest.phone,
      email: guest.email,
      checkInDate: guest.checkInDate,
      checkInTime: guest.checkInTime,
      checkOutDate: guest.checkOutDate,
      checkOutTime: guest.checkOutTime,
      roomId: guest.roomId,
      paymentStatus: guest.paymentStatus,
      paymentMethod: guest.paymentMethod,
      amountPaid: guest.amountPaid,
      notes: guest.notes
    });
    setIsModalOpen(true);
  };

  const deleteGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Cadastro de Hóspedes</h2>
          <p className="text-white/60">Gerencie todos os hóspedes ativos e históricos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <UserPlus size={20} />
          Novo Hóspede
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-white placeholder:text-white/20"
        />
      </div>

      {/* Guest Table */}
      <div className="bg-[#955251] rounded-[32px] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-black/20 text-white/50 text-[10px] uppercase tracking-[2px] font-black">
              <tr>
                <th className="px-8 py-6">Nome Completo</th>
                <th className="px-8 py-6">Documento</th>
                <th className="px-8 py-6">Quarto</th>
                <th className="px-8 py-6">Estadia</th>
                <th className="px-8 py-6">Pagamento</th>
                <th className="px-8 py-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredGuests.length > 0 ? filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-white text-lg tracking-tight">{guest.name}</div>
                    <div className="text-xs text-white/30 font-medium">{guest.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-white/70 font-mono font-medium">{guest.document}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex flex-col bg-black/30 border border-white/10 px-4 py-2 rounded-2xl min-w-[100px] items-center">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Qto</span>
                      <span className="text-white font-black">{rooms.find(r => r.id === guest.roomId)?.number || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-white/60 font-bold">
                        <Calendar size={14} className="text-blue-400" />
                        <span>{guest.checkInDate ? new Date(guest.checkInDate).toLocaleDateString() : 'Sem data'} <span className="text-[10px] text-white/30">{guest.checkInTime}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/30 font-bold">
                        <div className="w-3.5" />
                        <span>até {guest.checkOutDate ? new Date(guest.checkOutDate).toLocaleDateString() : 'pendente'} <span className="text-[10px] text-white/20">{guest.checkOutTime}</span></span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${guest.paymentStatus === PaymentStatus.PAID ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {guest.paymentStatus}
                        </span>
                        <span className="text-[10px] font-bold text-white/30">{guest.paymentMethod}</span>
                      </div>
                      <div className="text-sm font-black text-white">
                        R$ {guest.amountPaid.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(guest)}
                        className="p-2 text-white/40 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => setGuestToDelete(guest.id)}
                        className="p-2 text-white/40 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/30 italic">
                    Nenhum hóspede encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#955251] rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200 border border-white/10">
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingId ? 'Editar Registro de Hóspede' : 'Novo Registro de Hóspede'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-white/60 mb-2">Nome Completo</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">CPF / RG</label>
                  <input type="text" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">Telefone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">E-mail</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">Número do Quarto</label>
                  <select value={formData.roomId} onChange={e => setFormData({...formData, roomId: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white">
                    <option value="" className="bg-slate-800">Selecione...</option>
                    {rooms.filter(r => r.status === RoomStatus.AVAILABLE || r.id === formData.roomId).map(r => (
                      <option key={r.id} value={r.id} className="bg-slate-800">Quarto {r.number} ({r.type})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white/60 mb-2">Check-in Data</label>
                    <input type="date" value={formData.checkInDate} onChange={e => setFormData({...formData, checkInDate: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white/60 mb-2">Hora</label>
                    <input type="time" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white/60 mb-2">Check-out Data</label>
                    <input type="date" value={formData.checkOutDate} onChange={e => setFormData({...formData, checkOutDate: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white/60 mb-2">Hora</label>
                    <input type="time" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">Status Pagamento</label>
                  <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value as PaymentStatus})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white">
                    {Object.values(PaymentStatus).map(status => <option key={status} value={status} className="bg-slate-800">{status}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/60 mb-2">Método</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white">
                    {Object.values(PaymentMethod).map(method => <option key={method} value={method} className="bg-slate-800">{method}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-white/60 mb-2">Valor Pago</label>
                  <input type="number" step="0.01" value={formData.amountPaid} onChange={e => setFormData({...formData, amountPaid: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-white/60 mb-2">Observações</label>
                  <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }} 
                    className="px-6 py-3 font-bold text-white/50 hover:bg-white/5 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">
                    {editingId ? 'Salvar Alterações' : 'Salvar Hóspede'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {guestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#955251] rounded-[32px] w-full max-w-sm shadow-2xl p-8 animate-in zoom-in duration-200 border border-white/10 text-center">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} className="text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">Excluir Hóspede?</h3>
            <p className="text-white/60 font-medium mb-8">Esta ação não pode ser desfeita. Todos os dados deste registro serão perdidos.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setGuestToDelete(null)} 
                className="flex-1 px-6 py-4 font-bold text-white/50 hover:bg-white/5 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (guestToDelete) {
                    onDeleteGuest(guestToDelete);
                    setGuestToDelete(null);
                  }
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all cursor-pointer"
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

export default Guests;
