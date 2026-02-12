
import React, { useState } from 'react';
import { ReceptionNote } from '../types';
import { StickyNote, AlertTriangle, Bell, Info, Plus, Trash2 } from 'lucide-react';

interface NotesProps {
  notes: ReceptionNote[];
  setNotes: React.Dispatch<React.SetStateAction<ReceptionNote[]>>;
}

const Notes: React.FC<NotesProps> = ({ notes, setNotes }) => {
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState<'Request' | 'Warning' | 'Info'>('Info');

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const note: ReceptionNote = {
      id: Date.now().toString(),
      text: newNote,
      category,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-center gap-4">
        <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
          <StickyNote size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Anotações da Recepção</h2>
          <p className="text-slate-500 font-medium">Lembretes, pedidos e avisos para a equipe.</p>
        </div>
      </header>

      {/* Quick Add Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={addNote} className="space-y-4">
          <textarea 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="O que aconteceu? Pedido de hóspede, aviso de manutenção..."
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 min-h-[120px] transition-all"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto">
              {(['Info', 'Warning', 'Request'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-none ${category === cat ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {cat === 'Info' ? 'Informação' : cat === 'Warning' ? 'Aviso' : 'Pedido'}
                </button>
              ))}
            </div>
            <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
              <Plus size={20} /> Adicionar Nota
            </button>
          </div>
        </form>
      </div>

      {/* Note List */}
      <div className="space-y-4">
        {notes.length > 0 ? notes.map((note) => (
          <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:border-slate-200 transition-colors group">
            <div className={`p-3 rounded-2xl shrink-0 ${
              note.category === 'Warning' ? 'bg-rose-50 text-rose-500' :
              note.category === 'Request' ? 'bg-blue-50 text-blue-500' :
              'bg-slate-50 text-slate-500'
            }`}>
              {note.category === 'Warning' ? <AlertTriangle size={24} /> :
               note.category === 'Request' ? <Bell size={24} /> :
               <Info size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[2px]">{note.time}</span>
                <button 
                  onClick={() => removeNote(note.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed mt-2 text-lg">{note.text}</p>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
               <StickyNote size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nada anotado por enquanto</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
