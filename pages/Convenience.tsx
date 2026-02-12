
import React, { useState } from 'react';
import { Product, Room, Purchase, RoomStatus } from '../types';
import { ShoppingCart, Plus, Tag, History, Trash2, CheckCircle2 } from 'lucide-react';

interface ConvenienceProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  rooms: Room[];
  purchases: Purchase[];
  onAddPurchase: (purchase: Omit<Purchase, 'id' | 'timestamp'>) => void;
}

const Convenience: React.FC<ConvenienceProps> = ({ products, setProducts, rooms, purchases, onAddPurchase }) => {
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

    onAddPurchase({
      roomId: selectedRoomId,
      productId: product.id,
      productName: product.name,
      price: product.price
    });

    alert(`Venda realizada! R$ ${product.price.toFixed(2)} adicionados ao quarto.`);
    setSelectedProductId('');
  };

  const occupiedRooms = rooms.filter(r => r.status === RoomStatus.OCCUPIED);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Loja de Conveniência</h2>
          <p className="text-slate-500 font-medium">Venda de produtos e lançamento em conta de hóspedes.</p>
        </div>
        <button 
          onClick={() => setIsAddProductModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={20} /> Cadastrar Produto
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Interface */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-100">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 tracking-tighter">
              <ShoppingCart size={24} /> NOVA VENDA
            </h3>
            <form onSubmit={handlePurchase} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Quarto do Hóspede</label>
                <select 
                  required
                  value={selectedRoomId}
                  onChange={e => setSelectedRoomId(e.target.value)}
                  className="w-full bg-blue-500/30 border border-blue-400 text-white rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-300 transition-all font-bold placeholder:text-blue-200"
                >
                  <option value="" className="text-slate-800">Selecionar quarto ocupado...</option>
                  {occupiedRooms.map(r => (
                    <option key={r.id} value={r.id} className="text-slate-800">Quarto {r.number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Produto</label>
                <select 
                  required
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full bg-blue-500/30 border border-blue-400 text-white rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-300 transition-all font-bold"
                >
                  <option value="" className="text-slate-800">Selecionar produto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-800">{p.name} - R$ {p.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                disabled={!selectedRoomId || !selectedProductId}
                className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                Lançar no Quarto
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History size={20} className="text-slate-400" /> Histórico Recente
            </h3>
            <div className="space-y-3">
              {purchases.slice(-5).reverse().map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{p.productName}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Q-{rooms.find(r => r.id === p.roomId)?.number}</p>
                  </div>
                  <p className="font-black text-emerald-600 text-sm">R$ {p.price.toFixed(2)}</p>
                </div>
              ))}
              {purchases.length === 0 && <p className="text-center py-4 text-slate-400 text-sm italic">Nenhuma venda hoje.</p>}
            </div>
          </div>
        </div>

        {/* Product Catalog */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Tag size={20} className="text-slate-400" /> Catálogo de Produtos
            </h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{products.length} Itens</span>
          </div>
          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:border-blue-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-xl text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <Tag size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-emerald-600 font-black text-sm">R$ {p.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tighter uppercase">Cadastrar Produto</h3>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Nome do Produto</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                  placeholder="Ex: Coca-Cola Lata"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Preço (R$)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-emerald-600"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddProductModalOpen(false)} className="flex-1 px-6 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
                <button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Convenience;
