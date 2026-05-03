
import React, { useState, useEffect } from 'react';
import { Room, Guest, Reservation, ReceptionNote, RoomStatus, RoomType, Product, Purchase, PaymentStatus, PaymentMethod } from './types';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Rooms from './pages/Rooms';
import Reservations from './pages/Reservations';
import Notes from './pages/Notes';
import Convenience from './pages/Convenience';
import Settings from './pages/Settings';

const INITIAL_ROOMS: Room[] = [
  { id: '1', number: '101', type: RoomType.SIMPLE, status: RoomStatus.AVAILABLE, extraCharges: 0 },
  { id: '2', number: '102', type: RoomType.SIMPLE, status: RoomStatus.OCCUPIED, currentGuestId: 'g1', extraCharges: 0 },
  { id: '3', number: '201', type: RoomType.DOUBLE, status: RoomStatus.CLEANING, extraCharges: 0 },
  { id: '4', number: '202', type: RoomType.DOUBLE, status: RoomStatus.AVAILABLE, extraCharges: 0 },
  { id: '5', number: '301', type: RoomType.SUITE, status: RoomStatus.MAINTENANCE, extraCharges: 0 },
  { id: '6', number: '302', type: RoomType.SUITE, status: RoomStatus.AVAILABLE, extraCharges: 0 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Água Mineral 500ml', price: 5.00 },
  { id: 'p2', name: 'Cerveja Lata', price: 12.00 },
  { id: 'p3', name: 'Chocolate 100g', price: 8.50 },
  { id: 'p4', name: 'Salgadinho Pote', price: 10.00 },
];

const INITIAL_GUESTS: Guest[] = [
  { 
    id: 'g1', 
    name: 'João Silva', 
    document: '123.456.789-00', 
    phone: '(11) 98888-7777', 
    email: 'joao@email.com', 
    checkInDate: '2023-10-20', 
    checkInTime: '14:00',
    checkOutDate: '2023-10-25', 
    checkOutTime: '12:00',
    roomId: '2',
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: PaymentMethod.PIX,
    amountPaid: 0,
    notes: ''
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // App Config
  const [hotelConfig, setHotelConfig] = useState({
    name: 'CANA BRAVA HOTEL',
    primaryColor: '#2563eb', // Blue-600
  });

  // App State
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notes, setNotes] = useState<ReceptionNote[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [prefilledGuest, setPrefilledGuest] = useState<Partial<Guest> | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('hotel_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('hotel_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hotel_auth');
  };

  const addPurchase = (purchase: Omit<Purchase, 'id' | 'timestamp'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setPurchases(prev => [...prev, newPurchase]);
    setRooms(prevRooms => prevRooms.map(room => 
      room.id === purchase.roomId 
        ? { ...room, extraCharges: room.extraCharges + purchase.price }
        : room
    ));
  };

  const handleAddReservation = (res: Reservation) => {
    setReservations(prev => [...prev, res]);
    if (res.roomId) {
      setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: RoomStatus.RESERVED } : r));
    }
  };

  const handleUpdateReservation = (updatedRes: Reservation) => {
    const oldRes = reservations.find(r => r.id === updatedRes.id);
    setReservations(prev => prev.map(r => r.id === updatedRes.id ? updatedRes : r));
    
    if (oldRes && oldRes.roomId !== updatedRes.roomId) {
      setRooms(prev => prev.map(r => {
        if (r.id === oldRes.roomId) return { ...r, status: RoomStatus.AVAILABLE };
        if (r.id === updatedRes.roomId) return { ...r, status: RoomStatus.RESERVED };
        return r;
      }));
    } else if (updatedRes.roomId) {
      setRooms(prev => prev.map(r => r.id === updatedRes.roomId ? { ...r, status: RoomStatus.RESERVED } : r));
    }
  };

  const handleDeleteReservation = (id: string) => {
    const res = reservations.find(r => r.id === id);
    setReservations(prev => prev.filter(r => r.id !== id));
    if (res && res.roomId) {
      setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: RoomStatus.AVAILABLE } : r));
    }
  };

  const handleDeleteGuest = (id: string) => {
    const guest = guests.find(g => g.id === id);
    setGuests(prev => prev.filter(g => g.id !== id));
    if (guest && guest.roomId) {
      setRooms(prev => prev.map(r => r.id === guest.roomId ? { ...r, status: RoomStatus.AVAILABLE } : r));
    }
  };

  const handleCheckOut = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.currentGuestId) return;

    // Update guest with current time as checkout
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setGuests(prev => prev.map(g => g.id === room.currentGuestId ? {
      ...g,
      checkOutDate: dateStr,
      checkOutTime: timeStr
    } : g));

    // Update room status to CLEANING and clear guest/charges
    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: RoomStatus.CLEANING,
      currentGuestId: undefined,
      extraCharges: 0
    } : r));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} hotelName={hotelConfig.name} primaryColor={hotelConfig.primaryColor} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard rooms={rooms} guests={guests} setRooms={setRooms} setGuests={setGuests} onNavigate={setCurrentPage} />;
      case 'guests':
        return (
          <Guests 
            guests={guests} 
            setGuests={setGuests} 
            onDeleteGuest={handleDeleteGuest}
            rooms={rooms} 
            prefilledData={prefilledGuest} 
            onClearPrefilled={() => setPrefilledGuest(null)} 
          />
        );
      case 'rooms':
        return (
          <Rooms 
            rooms={rooms} 
            setRooms={setRooms} 
            guests={guests} 
            purchases={purchases}
            onCheckOut={handleCheckOut}
          />
        );
      case 'reservations':
        return (
          <Reservations 
            reservations={reservations} 
            onAddReservation={handleAddReservation}
            onUpdateReservation={handleUpdateReservation}
            onDeleteReservation={handleDeleteReservation}
            rooms={rooms} 
            onConfirm={handleConfirmReservation}
          />
        );
      case 'notes':
        return <Notes notes={notes} setNotes={setNotes} />;
      case 'convenience':
        return (
          <Convenience 
            products={products} 
            setProducts={setProducts} 
            rooms={rooms} 
            onAddPurchase={addPurchase}
            purchases={purchases}
            primaryColor={hotelConfig.primaryColor}
          />
        );
      case 'settings':
        return (
          <Settings 
            rooms={rooms} 
            setRooms={setRooms} 
            hotelConfig={hotelConfig}
            setHotelConfig={setHotelConfig}
            products={products}
            setProducts={setProducts}
          />
        );
      default:
        return <Dashboard rooms={rooms} guests={guests} setRooms={setRooms} setGuests={setGuests} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onLogout={handleLogout} 
        hotelName={hotelConfig.name}
        primaryColor={hotelConfig.primaryColor}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-black">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
