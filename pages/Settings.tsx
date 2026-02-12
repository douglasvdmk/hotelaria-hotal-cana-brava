
import React, { useState } from 'react';
import { Room, RoomType, RoomStatus } from '../types';
import { Settings as SettingsIcon, Plus, Trash2, Edit2, Layout, BedDouble } from 'lucide-react';

interface SettingsProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const Settings: React.FC<SettingsProps> = ({ rooms, setRooms }) => {
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

  const removeRoom = (id: string) => {
    if (confirm('Tem certeza que deseja remover este quarto permanentemente?')) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h2>
          <p className="text-slate-500 font-medium">Personalize a estrutura do hotel e parâmetros globais.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Menu de Ajustes</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-5 py-3 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center gap-3">
                <Layout size={18} /> Gestão de Quartos
              </button>
              <button className="w-full text-left px-5 py-3 rounded-2xl text-slate-400 hover:bg-slate-50 font-bold flex items-center gap-3 grayscale">
                <BedDouble size={18} /> Tipos de Acomodação
              </button>
              <button className="w-full text-left px-5 py-3 rounded-2xl text-slate-400 hover:bg-slate-50 font-bold flex items-center gap-3 grayscale">
                <SettingsIcon size={18} /> Perfil do Hotel
              </button>
            </div>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100">
             <h4 className="font-bold text-amber-800 text-sm mb-2 uppercase">Modo Editor Ativo</h4>
             <p className="text-amber-700 text-xs leading-relaxed">As alterações feitas aqui afetam diretamente a disponibilidade e o layout do dashboard de recepção.</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Configurar Quartos</h3>
                <p className="text-sm text-slate-500 font-medium">Adicione ou remova unidades do seu inventário.</p>
              </div>
              <button 
                onClick={() => setIsAddRoomOpen(true)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus size={18} /> Novo Quarto
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
              {rooms.map(room => (
                <div key={room.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-slate-700 border border-slate-100 shadow-sm">
                      {room.number}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{room.type}</p>
                      <p className="text-[10px] font-bold text-slate-300">STATUS INICIAL: LIVRE</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => removeRoom(room.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tighter uppercase">Adicionar Unidade</h3>
            <form onSubmit={handleAddRoom} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Número do Quarto</label>
                <input 
                  required
                  type="text" 
                  value={newRoom.number}
                  onChange={e => setNewRoom({...newRoom, number: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                  placeholder="Ex: 405"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Tipo de Quarto</label>
                <select 
                  required
                  value={newRoom.type}
                  onChange={e => setNewRoom({...newRoom, type: e.target.value as RoomType})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                >
                  {Object.values(RoomType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddRoomOpen(false)} className="flex-1 px-6 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all">Salvar Unidade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
