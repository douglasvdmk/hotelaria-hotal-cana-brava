
import React, { useState } from 'react';
import { Guest, Room, RoomStatus, PaymentStatus, PaymentMethod } from '../types';
import { UserPlus, Search, Edit2, Trash2, Calendar, CreditCard, DollarSign } from 'lucide-react';

interface GuestsProps {
  guests: Guest[];
  onAddGuest: (guest: Guest) => void;
  onUpdateGuest: (guest: Guest) => void;
  onDeleteGuest: (id: string) => void;
  rooms: Room[];
  prefilledData?: Partial<Guest> | null;
  onClearPrefilled?: () => void;
}

const Guests: React.FC<GuestsProps> = ({ guests, onAddGuest, onUpdateGuest, onDeleteGuest, rooms, prefilledData, onClearPrefilled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [duplicateGuest, setDuplicateGuest] = useState<Guest | null>(null);
  
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
    dailyRate: 0,
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
      dailyRate: 0,
      notes: ''
    });
    setEditingId(null);
    setSuggestions([]);
    setDuplicateGuest(null);
  };

  const selectSuggestedGuest = (guest: Guest) => {
    setFormData(prev => ({
      ...prev,
      name: guest.name,
      document: guest.document,
      phone: guest.phone,
      email: guest.email,
      notes: guest.notes || prev.notes,
      // We don't necessarily update check-in/out or room as it's a new stay
    }));
    setSuggestions([]);
    setDuplicateGuest(null);
  };

  const handleDocumentChange = (value: string) => {
    setFormData({ ...formData, document: value });
    
    if (value.length >= 3) {
      const matches = guests.filter(g => 
        g.document.replace(/\D/g, '').startsWith(value.replace(/\D/g, '')) ||
        g.document.includes(value)
      );
      
      // Filter out duplicate names if any (keep most recent)
      const uniqueMatches = Array.from(new Map(matches.map(item => [item.document, item])).values());
      setSuggestions(uniqueMatches.slice(0, 5));

      const exactMatch = guests.find(g => g.document.replace(/\D/g, '') === value.replace(/\D/g, ''));
      if (exactMatch && !editingId) {
        setDuplicateGuest(exactMatch);
      } else {
        setDuplicateGuest(null);
      }
    } else {
      setSuggestions([]);
      setDuplicateGuest(null);
    }
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
        dailyRate: prefilledData.dailyRate || 0,
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
    setValidationError(null);

    // Basic Validations - Removed mandatory requirement
    if (formData.checkOutDate && formData.checkInDate && formData.checkInDate > formData.checkOutDate) {
      setValidationError('A data de check-out não pode ser anterior à data de check-in.');
      return;
    }

    // Check for duplicate CPF only on new records
    if (!editingId && formData.document) {
      const existingGuest = guests.find(g => g.document.replace(/\D/g, '') === formData.document.replace(/\D/g, ''));
      if (existingGuest) {
        setValidationError(`Já existe um hóspede cadastrado com este Documento: ${existingGuest.name}. Por favor, use a busca inteligente ou atualize os dados existentes.`);
        return;
      }
    }
    
    if (editingId) {
      onUpdateGuest({ ...formData, id: editingId } as Guest);
    } else {
      const newGuest: Guest = {
        id: Math.random().toString(36).substring(2, 11),
        ...formData
      } as Guest;
      onAddGuest(newGuest);
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
      dailyRate: guest.dailyRate || 0,
      notes: guest.notes
    });
    setValidationError(null);
    setIsModalOpen(true);
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
                        R$ {(guest.amountPaid || 0).toFixed(2)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-[#955251] rounded-3xl w-full max-w-5xl shadow-2xl animate-in zoom-in duration-200 border border-white/10 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Editar Registro de Hóspede' : 'Novo Registro de Hóspede'}
              </h3>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              {validationError && (
                <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 rounded-2xl text-rose-200 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                  {validationError}
                </div>
              )}

              <form onSubmit={handleSubmit} id="guest-form" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {/* Linha 1 */}
                <div className="lg:col-span-1">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Nome Completo</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">CPF / RG</label>
                  <input 
                    type="text" 
                    value={formData.document} 
                    onChange={e => handleDocumentChange(e.target.value)} 
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" 
                    placeholder="Documento..."
                  />
                  
                  {suggestions.length > 0 && (
                    <div className="absolute z-[60] left-0 right-0 mt-1 bg-[#4A2C2B] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                       <div className="p-2 border-b border-white/5 bg-black/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Sugestões</p>
                       </div>
                       <ul className="max-h-48 overflow-y-auto font-sans">
                          {suggestions.map((g) => (
                            <li key={g.id}>
                               <button
                                 type="button"
                                 onClick={() => selectSuggestedGuest(g)}
                                 className="w-full text-left p-3 hover:bg-white/5 transition-colors border-b border-white/5 flex flex-col gap-0.5"
                               >
                                  <span className="font-bold text-white text-sm">{g.name}</span>
                                  <div className="flex items-center gap-3">
                                     <span className="text-[10px] font-medium text-white/40">{g.document}</span>
                                  </div>
                               </button>
                            </li>
                          ))}
                       </ul>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Telefone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>

                {/* Linha 2 */}
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">E-mail</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Número do Quarto</label>
                  <select 
                    value={formData.roomId} 
                    onChange={e => {
                      const roomId = e.target.value;
                      const room = rooms.find(r => r.id === roomId);
                      setFormData({...formData, roomId, dailyRate: room ? room.price : 0});
                    }} 
                    className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="" className="bg-slate-800">Selecione...</option>
                    {rooms.filter(r => r.status === RoomStatus.AVAILABLE || r.id === formData.roomId).map(r => (
                      <option key={r.id} value={r.id} className="bg-slate-800">
                        {r.number} ({r.type}) - {r.price > 0 ? `R$ ${r.price.toFixed(2)}` : 'S/ Preço'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Status Pagamento</label>
                  <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value as PaymentStatus})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-bold">
                    {Object.values(PaymentStatus).map(status => <option key={status} value={status} className="bg-slate-800">{status}</option>)}
                  </select>
                </div>

                {/* Linha 3 - Estadia completa (4 colunas ideais, usando grid aninhado ou flex) */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-black/10 p-5 rounded-2xl border border-white/5">
                  <div className="md:col-span-2 lg:col-span-4 mb-2">
                    <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[3px]">Período da Estadia</h4>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[2px] mb-2">Check-in Data</label>
                    <input type="date" value={formData.checkInDate} onChange={e => setFormData({...formData, checkInDate: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[2px] mb-2">Check-in Hora</label>
                    <input type="time" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[2px] mb-2">Check-out Data</label>
                    <input type="date" value={formData.checkOutDate} onChange={e => setFormData({...formData, checkOutDate: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[2px] mb-2">Check-out Hora</label>
                    <input type="time" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  </div>
                </div>

                {/* Linha 4 */}
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Método de Pagamento</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white">
                    {Object.values(PaymentMethod).map(method => <option key={method} value={method} className="bg-slate-800">{method}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Valor da Diária</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold">R$</span>
                    <input type="number" step="0.01" value={formData.dailyRate} onChange={e => setFormData({...formData, dailyRate: parseFloat(e.target.value) || 0})} className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Valor Total Pago</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/40 text-xs font-bold">R$</span>
                    <input type="number" step="0.01" value={formData.amountPaid} onChange={e => setFormData({...formData, amountPaid: parseFloat(e.target.value) || 0})} className="w-full pl-10 pr-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-400 font-bold" />
                  </div>
                </div>

                {/* Linha 5 */}
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Observações Adicionais</label>
                  <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm" placeholder="Ex: Preferências, restrições, etc..." />
                </div>
                
                {duplicateGuest && (
                  <div className="lg:col-span-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in zoom-in slide-in-from-top-2">
                     <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                           <UserPlus size={18} />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-bold text-white leading-tight">Este CPF já possui cadastro ({duplicateGuest.name}).</p>
                           <p className="text-xs text-white/40 mt-1">Deseja carregar os dados salvos para este hóspede?</p>
                           <button 
                             type="button"
                             onClick={() => selectSuggestedGuest(duplicateGuest)}
                             className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all"
                           >
                              Carregar Dados
                           </button>
                        </div>
                     </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }} 
                className="px-6 py-3 font-bold text-white/50 hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="guest-form"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
              >
                {editingId ? 'Salvar Alterações' : 'Salvar Hóspede'}
              </button>
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
