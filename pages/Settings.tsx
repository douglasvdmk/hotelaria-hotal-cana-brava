
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
  const [newRoom, setNewRoom] = useState({ number: '', type: RoomType.SIMPLE });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.number) return;
    const room: Room = {
      id: Math.random().toString(36).substr(2, 9),
      number: newRoom.number,
      type: newRoom.type,
      status: RoomStatus.AVAILABLE,
      extraCharges: 0
    };
    setRooms([...rooms, room]);
    setNewRoom({ number: '', type: RoomType.SIMPLE });
    setIsAddRoomOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Painel de Controle Total</h2>
        <p className="text-slate-500 font-medium">Personalize cada aspecto do Cana Brava Hotel.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
            <button 
              onClick={() => setActiveTab('hotel')}
              className={`w-full text-left px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'hotel' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
              style={activeTab === 'hotel' ? { color: hotelConfig.primaryColor, backgroundColor: `${hotelConfig.primaryColor}10` } : {}}
            >
              <Palette size={18} /> Identidade Visual
            </button>
            <button 
              onClick={() => setActiveTab('rooms')}
              className={`w-full text-left px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'rooms' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
              style={activeTab === 'rooms' ? { color: hotelConfig.primaryColor, backgroundColor: `${hotelConfig.primaryColor}10` } : {}}
            >
              <Layout size={18} /> Gestão de Quartos
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-5 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${activeTab === 'products' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
              style={activeTab === 'products' ? { color: hotelConfig.primaryColor, backgroundColor: `${hotelConfig.primaryColor}10` } : {}}
            >
              <Store size={18} /> Catálogo da Loja
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            {activeTab === 'hotel' && (
              <div className="p-10 space-y-8">
                <h3 className="text-xl font-bold text-slate-800">Informações do Hotel</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3">Nome Exibido</label>
                    <input 
                      type="text" 
                      value={hotelConfig.name}
                      onChange={(e) => setHotelConfig({...hotelConfig, name: e.target.value.toUpperCase()})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 outline-none transition-all"
                      style={{ '--tw-ring-color': `${hotelConfig.primaryColor}20` } as any}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-3">Cor de Destaque</label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="color" 
                        value={hotelConfig.primaryColor}
                        onChange={(e) => setHotelConfig({...hotelConfig, primaryColor: e.target.value})}
                        className="w-20 h-20 rounded-2xl border-none cursor-pointer p-0"
                      />
                      <p className="font-mono font-bold text-slate-500">{hotelConfig.primaryColor}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">Quartos Cadastrados ({rooms.length})</h3>
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
                    <div key={room.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-slate-700 border border-slate-100">
                          {room.number}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{room.type}</p>
                        </div>
                      </div>
                      <button onClick={() => setRooms(rooms.filter(r => r.id !== room.id))} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="p-8 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800">Gestão de Inventário</h3>
                </div>
                <div className="p-8 space-y-4">
                  {products.map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-emerald-600 font-black text-sm">R$ {p.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-center py-10 text-slate-400 italic">Nenhum produto cadastrado.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tighter uppercase">Adicionar Unidade</h3>
            <form onSubmit={handleAddRoom} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Número</label>
                <input required type="text" value={newRoom.number} onChange={e => setNewRoom({...newRoom, number: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Tipo</label>
                <select required value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value as RoomType})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                  {Object.values(RoomType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddRoomOpen(false)} className="flex-1 px-6 py-4 font-bold text-slate-500">Voltar</button>
                <button type="submit" className="flex-1 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: hotelConfig.primaryColor }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
