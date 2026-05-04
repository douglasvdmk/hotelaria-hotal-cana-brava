
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

export enum PaymentStatus {
  PAID = 'Pago',
  PENDING = 'Pendente',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CASH = 'Dinheiro',
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
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
  price: number;
}

export interface Guest {
  id: string;
  name: string;
  document: string; // CPF/RG
  phone: string;
  email: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  roomId: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes: string;
  dailyRate: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  document: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  roomId: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  notes: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  dailyRate: number;
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
  stock: number;
}

export interface Purchase {
  id: string;
  roomId: string;
  productId: string;
  productName: string;
  price: number;
  timestamp: number;
}
