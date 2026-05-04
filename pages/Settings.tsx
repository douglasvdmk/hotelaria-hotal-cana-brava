
import React, { useState } from 'react';
import { Room, RoomType, RoomStatus, Product } from '../types';
import { Settings as SettingsIcon, Plus, Trash2, Edit2, Layout, BedDouble, Palette, ShoppingBag, Store } from 'lucide-react';

interface SettingsProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  hotelConfig: { name: string; primaryColor: string };
  setHotelConfig: React.Dispatch<React.SetStateAction<{ name: string; primaryColor: string }>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Settings: React.FC<SettingsProps> = ({ rooms, setRooms, hotelConfig, setHotelConfig, products, setProducts }) => {
  const [activeTab, setActiveTab] = useState<'hotel' | 'rooms' | 'products'>('hotel');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState({ number: '', type: RoomType.SIMPLE, price: 0 });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.number) return;

    if (editingRoomId) {
      setRooms(rooms.map(r => r.id === editingRoomId ? { ...r, number: newRoom.number, type: newRoom.type, price: newRoom.price } : r));
    } else {
      const room: Room = {
        id: Math.random().toString(36).substring(2, 11),
        number: newRoom.number,
        type: newRoom.type,
        status: RoomStatus.AVAILABLE,
        extraCharges: 0,
        price: newRoom.price
      };
      setRooms([...rooms, room]);
    }
    
    setNewRoom({ number: '', type: RoomType.SIMPLE, price: 0 });
    setIsAddRoomOpen(false);
    setEditingRoomId(null);
  };

  const handleEditRoom = (room: Room) => {
    setNewRoom({ number: room.number, type: room.type, price: room.price });
    setEditingRoomId(room.id);
    setIsAddRoomOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <header>
        <h2 className="text-2xl font-bold text-white">Painel de Controle Total</h2>
        <p className="text-white/60 font-medium">Personalize cada aspecto do Cana Brava Hotel.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#955251] p-4 rounded-[32px] border border-white/5 shadow-sm space-y-2">
            <button 
              onClick={() => setActiveTab('hotel')}
              className={`w-full text-left px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'hotel' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:bg-white/5'}`}
              style={activeTab === 'hotel' ? { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
            >
              <Palette size={18} /> Identidade Visual
            </button>
            <button 
              onClick={() => setActiveTab('rooms')}
              className={`w-full text-left px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'rooms' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:bg-white/5'}`}
              style={activeTab === 'rooms' ? { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
            >
              <Layout size={18} /> Gestão de Quartos
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'products' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:bg-white/5'}`}
              style={activeTab === 'products' ? { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
            >
              <Store size={18} /> Catálogo da Loja
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-[#955251] rounded-[40px] border border-white/5 shadow-sm overflow-hidden border border-white/5">
            {activeTab === 'hotel' && (
              <div className="p-10 space-y-8">
                <h3 className="text-xl font-bold text-white">Informações do Hotel</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-3">Nome Exibido</label>
                    <input 
                      type="text" 
                      value={hotelConfig.name}
                      onChange={(e) => setHotelConfig({...hotelConfig, name: e.target.value.toUpperCase()})}
                      className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl font-bold focus:ring-4 outline-none transition-all text-white"
                      style={{ '--tw-ring-color': `${hotelConfig.primaryColor}20` } as any}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-3">Cor de Destaque</label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="color" 
                        value={hotelConfig.primaryColor}
                        onChange={(e) => setHotelConfig({...hotelConfig, primaryColor: e.target.value})}
                        className="w-20 h-20 rounded-2xl border-none cursor-pointer p-0"
                      />
                      <p className="font-mono font-bold text-white/60">{hotelConfig.primaryColor}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div>
                <div className="p-8 border-b border-white/5 flex justify-between items-center text-white">
                  <h3 className="text-xl font-bold">Quartos Cadastrados ({rooms.length})</h3>
                  <button 
                    onClick={() => setIsAddRoomOpen(true)}
                    className="text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
                    style={{ backgroundColor: hotelConfig.primaryColor }}
                  >
                    <Plus size={18} /> Novo Quarto
                  </button>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rooms.map(room => (
                    <div key={room.id} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center font-black text-white border border-white/5">
                          {room.number}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xs font-black text-white/40 uppercase tracking-wider">{room.type}</p>
                          <p className="text-[10px] font-bold text-emerald-400 mt-0.5">
                            {room.price > 0 ? `R$ ${(room.price || 0).toFixed(2)}` : 'Preço não definido'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditRoom(room)} className="p-2 text-white/30 hover:text-blue-400"><Edit2 size={18} /></button>
                        <button onClick={() => setRooms(rooms.filter(r => r.id !== room.id))} className="p-2 text-white/30 hover:text-rose-400"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="p-8 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">Gestão de Inventário</h3>
                </div>
                <div className="p-8 space-y-4">
                  {products.map(p => (
                    <div key={p.id} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-emerald-400 font-black text-sm">R$ {(p.price || 0).toFixed(2)}</p>
                          <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Estoque: {p.stock}</span>
                        </div>
                      </div>
                      <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="p-2 text-white/30 hover:text-rose-400"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-center py-10 text-white/30 italic">Nenhum produto cadastrado.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#955251] rounded-[40px] w-full max-w-md shadow-2xl p-10 border border-white/10">
            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase">
              {editingRoomId ? 'Editar Unidade' : 'Adicionar Unidade'}
            </h3>
            <form onSubmit={handleAddRoom} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Número</label>
                <input required type="text" value={newRoom.number} onChange={e => setNewRoom({...newRoom, number: e.target.value})} className="w-full px-5 py-4 bg-black/20 border border-white/5 rounded-2xl outline-none font-bold text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Tipo</label>
                  <select required value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value as RoomType})} className="w-full px-5 py-4 bg-black/20 border border-white/5 rounded-2xl outline-none font-bold text-white">
                    {Object.values(RoomType).map(type => <option key={type} value={type} className="bg-slate-800">{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Preço Diária</label>
                  <input required type="number" step="0.01" min="0" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: parseFloat(e.target.value) || 0})} className="w-full px-5 py-4 bg-black/20 border border-white/5 rounded-2xl outline-none font-bold text-white" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddRoomOpen(false);
                    setEditingRoomId(null);
                    setNewRoom({ number: '', type: RoomType.SIMPLE, price: 0 });
                  }} 
                  className="flex-1 px-6 py-4 font-bold text-white/50"
                >
                  Voltar
                </button>
                <button type="submit" className="flex-1 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: hotelConfig.primaryColor }}>
                  {editingRoomId ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
