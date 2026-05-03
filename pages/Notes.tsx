
import React, { useState } from 'react';
import { ReceptionNote } from '../types';
import { StickyNote, AlertTriangle, Bell, Info, Plus, Trash2, Edit2, X } from 'lucide-react';

interface NotesProps {
  notes: ReceptionNote[];
  setNotes: React.Dispatch<React.SetStateAction<ReceptionNote[]>>;
}

const Notes: React.FC<NotesProps> = ({ notes, setNotes }) => {
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState<'Request' | 'Warning' | 'Info'>('Info');
  const [editingId, setEditingId] = useState<string | null>(null);

  const saveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    if (editingId) {
      setNotes(notes.map(n => n.id === editingId ? { 
        ...n, 
        text: newNote, 
        category,
        updatedAt: Date.now()
      } : n));
      setEditingId(null);
    } else {
      const note: ReceptionNote = {
        id: Date.now().toString(),
        text: newNote,
        category,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };
      setNotes([note, ...notes]);
    }
    
    setNewNote('');
    setCategory('Info');
  };

  const handleEdit = (note: ReceptionNote) => {
    setEditingId(note.id);
    setNewNote(note.text);
    setCategory(note.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewNote('');
    setCategory('Info');
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500 text-white">
      <header className="flex items-center gap-4">
        <div className="bg-amber-500/10 text-amber-400 p-3 rounded-2xl border border-amber-500/20">
          <StickyNote size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Anotações da Recepção</h2>
          <p className="text-white/60 font-medium">Lembretes, pedidos e avisos para a equipe.</p>
        </div>
      </header>

      {/* Quick Add Form / Edit Form */}
      <div className={`p-6 rounded-3xl border shadow-sm transition-all duration-300 ${editingId ? 'bg-blue-600/20 border-blue-500/30' : 'bg-[#955251] border-white/5'}`}>
        <form onSubmit={saveNote} className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
              {editingId ? 'Editando Nota' : 'Nova Anotação'}
            </span>
            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="text-white/40 hover:text-white flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
              >
                <X size={12} /> Cancelar Edição
              </button>
            )}
          </div>
          <textarea 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="O que aconteceu? Pedido de hóspede, aviso de manutenção..."
            className="w-full p-5 bg-black/20 border border-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[120px] transition-all text-white placeholder:text-white/20"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex bg-black/20 p-1.5 rounded-xl border border-white/5 w-full sm:w-auto">
              {(['Info', 'Warning', 'Request'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-none flex items-center justify-center gap-2 ${category === cat ? 'bg-white text-slate-800 shadow-sm' : 'text-white/40 hover:text-white/60'}`}
                >
                  {cat === 'Info' && <Info size={14} />}
                  {cat === 'Warning' && <AlertTriangle size={14} />}
                  {cat === 'Request' && <Bell size={14} />}
                  {cat === 'Info' ? 'Informação' : cat === 'Warning' ? 'Aviso' : 'Pedido'}
                </button>
              ))}
            </div>
            <button className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${editingId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg`}>
              {editingId ? <><Plus size={20} className="rotate-45" /> Salvar Alterações</> : <><Plus size={20} /> Adicionar Nota</>}
            </button>
          </div>
        </form>
      </div>

      {/* Note List */}
      <div className="space-y-4">
        {notes.length > 0 ? notes.map((note) => (
          <div key={note.id} className={`bg-[#955251] p-6 rounded-3xl border border-white/5 shadow-sm flex items-start gap-5 hover:border-white/10 transition-colors group relative overflow-hidden`}>
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${
              note.category === 'Warning' ? 'bg-rose-500' :
              note.category === 'Request' ? 'bg-blue-500' :
              'bg-white/20'
            }`} />
            
            <div className={`p-4 rounded-2xl shrink-0 shadow-lg ${
              note.category === 'Warning' ? 'bg-rose-500 text-white' :
              note.category === 'Request' ? 'bg-blue-500 text-white' :
              'bg-white/10 text-white/60'
            }`}>
              {note.category === 'Warning' ? <AlertTriangle size={32} /> :
               note.category === 'Request' ? <Bell size={32} /> :
               <Info size={32} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className={`text-[12px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm ${
                    note.category === 'Warning' ? 'bg-rose-500 text-white' :
                    note.category === 'Request' ? 'bg-blue-500 text-white' :
                    'bg-white/20 text-white/90'
                  }`}>
                    {note.category === 'Info' ? 'Informação' : note.category === 'Warning' ? 'Aviso' : 'Pedido'}
                  </span>
                  <span className="text-xs font-bold text-white/40 tracking-[2px]">{note.time}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleEdit(note)}
                    className="p-2 text-white/30 hover:text-blue-400 hover:bg-white/5 rounded-lg transition-colors"
                    title="Editar Nota"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => removeNote(note.id)}
                    className="p-2 text-white/30 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                    title="Excluir Nota"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-white/80 font-medium leading-relaxed mt-2 text-lg">{note.text}</p>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
            <div className="bg-[#955251] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20 shadow-sm border border-white/5">
               <StickyNote size={32} />
            </div>
            <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Nada anotado por enquanto</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
