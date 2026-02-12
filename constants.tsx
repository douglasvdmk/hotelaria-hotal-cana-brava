
import React from 'react';
import { RoomStatus } from './types';
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  CalendarCheck, 
  StickyNote,
  ShoppingCart,
  Settings
} from 'lucide-react';

export const STATUS_COLORS = {
  [RoomStatus.AVAILABLE]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [RoomStatus.OCCUPIED]: 'bg-rose-100 text-rose-700 border-rose-200',
  [RoomStatus.CLEANING]: 'bg-amber-100 text-amber-700 border-amber-200',
  [RoomStatus.MAINTENANCE]: 'bg-slate-200 text-slate-700 border-slate-300'
};

export const STATUS_DOTS = {
  [RoomStatus.AVAILABLE]: 'bg-emerald-500',
  [RoomStatus.OCCUPIED]: 'bg-rose-500',
  [RoomStatus.CLEANING]: 'bg-amber-500',
  [RoomStatus.MAINTENANCE]: 'bg-slate-500'
};

export const STATUS_LABELS = {
  [RoomStatus.AVAILABLE]: 'Livre',
  [RoomStatus.OCCUPIED]: 'Ocupado',
  [RoomStatus.CLEANING]: 'Limpeza',
  [RoomStatus.MAINTENANCE]: 'Manutenção'
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'guests', label: 'Hóspedes', icon: <Users size={20} /> },
  { id: 'rooms', label: 'Quartos', icon: <BedDouble size={20} /> },
  { id: 'reservations', label: 'Reservas', icon: <CalendarCheck size={20} /> },
  { id: 'notes', label: 'Anotações', icon: <StickyNote size={20} /> },
  { id: 'convenience', label: 'Conveniência', icon: <ShoppingCart size={20} /> },
];

export const BOTTOM_NAV_ITEMS = [
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
];
