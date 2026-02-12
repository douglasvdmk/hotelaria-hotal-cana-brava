
import React, { useState, useEffect } from 'react';
import { Room, Guest, Reservation, ReceptionNote, RoomStatus, RoomType, Product, Purchase } from './types';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Rooms from './pages/Rooms';
import Reservations from './pages/Reservations';
import Notes from './pages/Notes';
import Convenience from './pages/Convenience';
import Settings from './pages/Settings';

// Initial Mock Data
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
    checkOutDate: '2023-10-25', 
    roomId: '2' 
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // App State
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notes, setNotes] = useState<ReceptionNote[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Persistent login for demo purposes
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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard rooms={rooms} guests={guests} setRooms={setRooms} setGuests={setGuests} />;
      case 'guests':
        return <Guests guests={guests} setGuests={setGuests} rooms={rooms} />;
      case 'rooms':
        return <Rooms rooms={rooms} setRooms={setRooms} />;
      case 'reservations':
        return <Reservations reservations={reservations} setReservations={setReservations} rooms={rooms} />;
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
          />
        );
      case 'settings':
        return (
          <Settings 
            rooms={rooms} 
            setRooms={setRooms} 
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
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
