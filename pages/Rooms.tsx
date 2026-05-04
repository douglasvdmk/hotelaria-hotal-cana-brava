
import React, { useState } from 'react';
import { Room, RoomStatus, Guest, Purchase, RoomType } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { RefreshCw, Wrench, Eraser, Check, ShoppingCart, Calendar, User, Phone, Mail, FileText, Receipt, CheckCircle, X } from 'lucide-react';

interface RoomsProps {
  rooms: Room[];
  setRooms: (rooms: Room[]) => Promise<void>;
  guests: Guest[];
  purchases: Purchase[];
  onCheckOut: (roomId: string) => void;
  onMarkCleaned: (roomId: string) => void;
}

const Rooms: React.FC<RoomsProps> = ({ rooms, setRooms, guests, purchases, onCheckOut, onMarkCleaned }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const updateStatus = (id: string, newStatus: RoomStatus) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const currentGuest = selectedRoom?.currentGuestId ? guests.find(g => g.id === selectedRoom.currentGuestId) : null;
  const roomPurchases = selectedRoom ? purchases.filter(p => p.roomId === selectedRoom.id) : [];

  const calculateDays = (checkIn: string) => {
    if (!checkIn) return 1;
    const start = new Date(checkIn + 'T00:00:00');
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? 1 : diffDays;
  };

  const days = currentGuest ? calculateDays(currentGuest.checkInDate) : 0;
  const roomTotal = selectedRoom ? (selectedRoom.price || 0) * days : 0;
  const grandTotal = roomTotal + (selectedRoom?.extraCharges || 0);

  return (
    <div className="space-y-6 text-white pb-20">
      <header>
        <h2 className="text-2xl font-bold text-white">Controle de Quartos</h2>
        <p className="text-white/60">Monitore o status de limpeza e disponibilidade em tempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            onClick={() => setSelectedRoomId(room.id)}
            className="bg-[#955251] rounded-[40px] border border-white/10 shadow-xl p-8 hover:shadow-2xl transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-4xl font-black text-white tracking-tighter block leading-none">#{room.number}</span>
                <p className="text-[10px] font-black text-white/40 mt-3 uppercase tracking-[2px]">{room.type}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-md shrink-0 ${
                room.status === RoomStatus.AVAILABLE ? 'bg-emerald-600 text-white border-emerald-400' : 
                room.status === RoomStatus.OCCUPIED ? 'bg-rose-600 text-white border-rose-400' :
                room.status === RoomStatus.CLEANING ? 'bg-amber-500 text-white border-amber-300' :
                room.status === RoomStatus.RESERVED ? 'bg-blue-600 text-white border-blue-400' :
                'bg-slate-600 text-white border-slate-400'
              }`}>
                {STATUS_LABELS[room.status]}
              </div>
            </div>

            <div className="flex-1 min-h-[64px] flex flex-col justify-center mb-8">
              {room.status === RoomStatus.OCCUPIED ? (
                <div className="p-5 bg-black/20 rounded-[24px] border border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <ShoppingCart size={18} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Extras</span>
                    </div>
                    {room.price === 0 || room.price === undefined ? (
                      <span className="text-[9px] font-bold text-rose-400 uppercase mt-1 tracking-wider">Valor não definido</span>
                    ) : (
                      <span className="text-[9px] font-bold text-white/40 uppercase mt-1 tracking-wider">Diária: R$ {(room.price || 0).toFixed(2)}</span>
                    )}
                  </div>
                  <span className="text-2xl font-black text-emerald-400 whitespace-nowrap">R$ {room.extraCharges.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[24px] p-5 h-full opacity-30">
                  <p className="text-[9px] font-black text-white uppercase tracking-[2px]">Sem consumos</p>
                </div>
              )}
            </div>

            <div className="mt-auto" onClick={e => e.stopPropagation()}>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[3px] mb-4 text-center">Status do Quarto</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.AVAILABLE)}
                  className={`flex items-center justify-center gap-2 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    room.status === RoomStatus.AVAILABLE 
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' 
                      : 'bg-black/20 text-white/40 border-transparent hover:border-emerald-500/50 hover:text-white'
                  }`}
                >
                  <Check size={14} className="shrink-0" /> <span className="truncate">Livre</span>
                </button>
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.OCCUPIED)}
                  className={`flex items-center justify-center gap-2 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    room.status === RoomStatus.OCCUPIED 
                      ? 'bg-rose-600 text-white border-rose-400 shadow-lg' 
                      : 'bg-black/20 text-white/40 border-transparent hover:border-rose-500/50 hover:text-white'
                  }`}
                >
                  <RefreshCw size={14} className="shrink-0" /> <span className="truncate">Ocupado</span>
                </button>
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.RESERVED)}
                  className={`flex items-center justify-center gap-2 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    room.status === RoomStatus.RESERVED 
                      ? 'bg-blue-600 text-white border-blue-400 shadow-lg' 
                      : 'bg-black/20 text-white/40 border-transparent hover:border-blue-500/50 hover:text-white'
                  }`}
                >
                  <Calendar size={14} className="shrink-0" /> <span className="truncate">Reserv.</span>
                </button>
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.CLEANING)}
                  className={`flex items-center justify-center gap-2 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    room.status === RoomStatus.CLEANING 
                      ? 'bg-amber-500 text-white border-amber-300 shadow-lg' 
                      : 'bg-black/20 text-white/40 border-transparent hover:border-amber-500/50 hover:text-white'
                  }`}
                >
                  <Eraser size={14} className="shrink-0" /> <span className="truncate">Limpeza</span>
                </button>
                {room.status === RoomStatus.CLEANING && (
                  <button 
                    onClick={() => onMarkCleaned(room.id)}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                  >
                    Marcar como Limpo
                  </button>
                )}
                <button 
                  onClick={() => updateStatus(room.id, RoomStatus.MAINTENANCE)}
                  className={`flex items-center justify-center gap-2 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    room.status === RoomStatus.MAINTENANCE 
                      ? 'bg-slate-600 text-white border-slate-400 shadow-lg' 
                      : 'bg-black/20 text-white/40 border-transparent hover:border-slate-500/50 hover:text-white'
                  }`}
                >
                  <Wrench size={14} className="shrink-0" /> <span className="truncate">Manut.</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#955251] rounded-[48px] w-full max-w-2xl shadow-2xl p-0 overflow-hidden border border-white/10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-8 bg-black/20 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/10 rounded-3xl">
                  <span className="text-4xl font-black text-white tracking-tighter">#{selectedRoom.number}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{selectedRoom.type}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedRoom.status === RoomStatus.AVAILABLE ? 'bg-emerald-500' :
                      selectedRoom.status === RoomStatus.OCCUPIED ? 'bg-rose-500' :
                      'bg-slate-400'
                    }`} />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{STATUS_LABELS[selectedRoom.status]}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRoomId(null)}
                className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {selectedRoom.status === RoomStatus.OCCUPIED && currentGuest ? (
                <div className="space-y-8">
                  {/* Guest Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-black/20 rounded-3xl border border-white/5 flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Hóspede</p>
                        <p className="font-bold text-white leading-tight">{currentGuest.name}</p>
                        <div className="flex flex-col gap-0.5 mt-1.5 opacity-50">
                          <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                            <FileText size={10} className="text-blue-400" />
                            {currentGuest.document}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Phone size={10} className="text-emerald-400" />
                            {currentGuest.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 bg-black/20 rounded-3xl border border-white/5 flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Check-in</p>
                        <p className="font-bold text-white leading-tight">{currentGuest.checkInDate ? new Date(currentGuest.checkInDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'} às {currentGuest.checkInTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Billing Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                      <Receipt size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Extrato de Estadia</span>
                    </div>

                    <div className="bg-black/20 rounded-[32px] overflow-hidden border border-white/5">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-[9px] font-black text-white/30 uppercase tracking-[2px]">
                          <tr>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4 text-right">Preço</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                          <tr className="border-b border-white/5">
                            <td className="px-6 py-4 text-white">
                              Diárias ({days} {days === 1 ? 'dia' : 'dias'})
                              {selectedRoom.price === 0 || selectedRoom.price === undefined ? (
                                <span className="block text-[10px] text-rose-400 font-bold uppercase tracking-wider mt-1">Aviso: Valor da diária não foi configurado</span>
                              ) : (
                                <span className="block text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">Valor Unitário: R$ {(selectedRoom.price || 0).toFixed(2)}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right text-white">
                              R$ {roomTotal.toFixed(2)}
                            </td>
                          </tr>
                          {roomPurchases.map((purchase) => (
                            <tr key={purchase.id} className="border-b border-white/5">
                              <td className="px-6 py-4 text-white/60">
                                {purchase.productName}
                              </td>
                              <td className="px-6 py-4 text-right text-white/60">
                                R$ {purchase.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <div className="p-6 bg-white/5 flex justify-between items-center border-t-2 border-white/10">
                        <span className="text-lg font-black text-white uppercase tracking-tighter">Total Geral</span>
                        <span className="text-3xl font-black text-white">R$ {grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 flex gap-4">
                    <button 
                      onClick={() => {
                        onCheckOut(selectedRoom.id);
                        setSelectedRoomId(null);
                      }}
                      className="flex-1 bg-white text-black hover:bg-white/90 px-8 py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                      <CheckCircle size={20} /> Checkout Completo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <FileText size={64} strokeWidth={1} className="mb-6" />
                  <p className="text-xl font-bold">Nenhum hóspede ativo</p>
                  <p className="text-sm">Quarto está livre para novas reservas ou ocupação.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;