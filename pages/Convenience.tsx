
import React, { useState } from 'react';
import { Product, Room, Purchase, RoomStatus } from '../types';
import { ShoppingCart, Plus, Tag, History, Trash2 } from 'lucide-react';

interface ConvenienceProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  rooms: Room[];
  purchases: Purchase[];
  onAddPurchase: (purchase: Omit<Purchase, 'id' | 'timestamp'>) => void;
  primaryColor: string;
}

const Convenience: React.FC<ConvenienceProps> = ({ products, setProducts, rooms, purchases, onAddPurchase, primaryColor }) => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      price: parseFloat(newProduct.price)
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '' });
    setIsAddProductModalOpen(false);
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!selectedRoomId || !product) return;
    onAddPurchase({ roomId: selectedRoomId, productId: product.id, productName: product.name, price: product.price });
    alert(`R$ ${product.price.toFixed(2)} lançados no quarto com sucesso.`);
    setSelectedProductId('');
  };

  const occupiedRooms = rooms.filter(r => r.status === RoomStatus.OCCUPIED);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Conveniência</h2>
          <p className="text-slate-500 font-medium">Lançamentos rápidos para a conta do quarto.</p>
        </div>
        <button 
          onClick={() => setIsAddProductModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={20} /> Cadastrar Item
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-[32px] text-white shadow-xl" style={{ backgroundColor: primaryColor }}>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 tracking-tighter">
              <ShoppingCart size={24} /> LANÇAR EXTRA
            </h3>
            <form onSubmit={handlePurchase} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black opacity-70 uppercase tracking-widest mb-2">Quarto Ocupado</label>
                <select required value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)} className="w-full bg-black/10 border border-white/20 text-white rounded-2xl p-4 outline-none font-bold">
                  <option value="" className="text-slate-800">Selecionar...</option>
                  {occupiedRooms.map(r => <option key={r.id} value={r.id} className="text-slate-800">Quarto {r.number}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black opacity-70 uppercase tracking-widest mb-2">Produto</label>
                <select required value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full bg-black/10 border border-white/20 text-white rounded-2xl p-4 outline-none font-bold">
                  <option value="" className="text-slate-800">Selecionar...</option>
                  {products.map(p => <option key={p.id} value={p.id} className="text-slate-800">{p.name} - R$ {p.price.toFixed(2)}</option>)}
                </select>
              </div>
              <button type="submit" disabled={!selectedRoomId || !selectedProductId} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-slate-100 disabled:opacity-50 transition-all">
                Lançar Agora
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Catálogo Disponível</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {products.map(p => (
                <div key={p.id} className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-emerald-600 font-black text-sm">R$ {p.price.toFixed(2)}</p>
                  </div>
                  <Tag size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10">
            <h3 className="text-2xl font-black text-slate-800 mb-8 uppercase">Novo Produto</h3>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Nome do item" />
              <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Preço R$" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsAddProductModalOpen(false)} className="flex-1 font-bold text-slate-500">Voltar</button>
                <button type="submit" className="flex-1 text-white py-4 rounded-2xl font-black uppercase tracking-widest" style={{ backgroundColor: primaryColor }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Convenience;
