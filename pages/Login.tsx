
import React, { useState } from 'react';
import { Hotel, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  hotelName: string;
  primaryColor: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, hotelName, primaryColor }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
    } else {
      setError('Credenciais incorretas. Tente "admin" / "admin".');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-white animate-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 rounded-3xl text-white shadow-xl mb-6" style={{ backgroundColor: primaryColor, shadowColor: `${primaryColor}40` }}>
            <Hotel size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2 text-center leading-tight">{hotelName}</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Painel de Recepção</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 transition-all font-semibold"
                style={{ '--tw-ring-color': `${primaryColor}20` } as any}
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 transition-all font-semibold"
                style={{ '--tw-ring-color': `${primaryColor}20` } as any}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-rose-500 text-xs font-bold text-center animate-bounce">{error}</p>}

          <button 
            type="submit"
            className="w-full text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl transition-all active:scale-95 mt-4"
            style={{ backgroundColor: primaryColor }}
          >
            Acessar Sistema
          </button>
        </form>

        <p className="mt-10 text-center text-slate-400 text-xs font-medium">
          Dica: Usuário e senha padrão são <span className="font-bold text-slate-600">admin</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
