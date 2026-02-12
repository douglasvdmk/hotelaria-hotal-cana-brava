
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE'
}

export enum RoomType {
  SIMPLE = 'Simples',
  DOUBLE = 'Duplo',
  SUITE = 'Suíte'
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  currentGuestId?: string;
  extraCharges: number; // Sum of convenience store items
}

export interface Guest {
  id: string;
  name: string;
  document: string; // CPF/RG
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  date: string;
  roomId: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  notes: string;
}

export interface ReceptionNote {
  id: string;
  text: string;
  category: 'Request' | 'Warning' | 'Info';
  time: string;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface Purchase {
  id: string;
  roomId: string;
  productId: string;
  productName: string;
  price: number;
  timestamp: number;
}
