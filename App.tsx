
import React, { useState, useEffect } from 'react';
import { Room, Guest, Reservation, ReceptionNote, RoomStatus, RoomType, Product, Purchase, PaymentStatus, PaymentMethod } from './types';
import { Hotel, LayoutGrid } from 'lucide-react';
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
  { id: '1', number: '101', type: RoomType.SIMPLE, status: RoomStatus.AVAILABLE, extraCharges: 0, price: 0 },
  { id: '2', number: '102', type: RoomType.SIMPLE, status: RoomStatus.OCCUPIED, currentGuestId: 'g1', extraCharges: 0, price: 0 },
  { id: '3', number: '201', type: RoomType.DOUBLE, status: RoomStatus.CLEANING, extraCharges: 0, price: 0 },
  { id: '4', number: '202', type: RoomType.DOUBLE, status: RoomStatus.AVAILABLE, extraCharges: 0, price: 0 },
  { id: '5', number: '301', type: RoomType.SUITE, status: RoomStatus.MAINTENANCE, extraCharges: 0, price: 0 },
  { id: '6', number: '302', type: RoomType.SUITE, status: RoomStatus.AVAILABLE, extraCharges: 0, price: 0 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Água Mineral 500ml', price: 5.00, stock: 50 },
  { id: 'p2', name: 'Cerveja Lata', price: 12.00, stock: 24 },
  { id: 'p3', name: 'Chocolate 100g', price: 8.50, stock: 15 },
  { id: 'p4', name: 'Salgadinho Pote', price: 10.00, stock: 20 },
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
    notes: '',
    dailyRate: 0
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  // Persistence - Load from LocalStorage
  useEffect(() => {
    const auth = localStorage.getItem('hotel_auth');
    if (auth === 'true') setIsAuthenticated(true);

    const savedConfig = localStorage.getItem('hotel_config');
    if (savedConfig) setHotelConfig(JSON.parse(savedConfig));

    const savedRooms = localStorage.getItem('hotel_rooms');
    if (savedRooms) setRooms(JSON.parse(savedRooms));

    const savedGuests = localStorage.getItem('hotel_guests');
    if (savedGuests) setGuests(JSON.parse(savedGuests));

    const savedReservations = localStorage.getItem('hotel_reservations');
    if (savedReservations) setReservations(JSON.parse(savedReservations));

    const savedNotes = localStorage.getItem('hotel_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const savedProducts = localStorage.getItem('hotel_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));

    const savedPurchases = localStorage.getItem('hotel_purchases');
    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
  }, []);

  // Persistence - Save to LocalStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('hotel_config', JSON.stringify(hotelConfig));
      localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
      localStorage.setItem('hotel_guests', JSON.stringify(guests));
      localStorage.setItem('hotel_reservations', JSON.stringify(reservations));
      localStorage.setItem('hotel_notes', JSON.stringify(notes));
      localStorage.setItem('hotel_products', JSON.stringify(products));
      localStorage.setItem('hotel_purchases', JSON.stringify(purchases));
    }
  }, [hotelConfig, rooms, guests, reservations, notes, products, purchases, isAuthenticated]);

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
    setProducts(prev => prev.map(p => 
      p.id === purchase.productId ? { ...p, stock: Math.max(0, p.stock - 1) } : p
    ));
    setRooms(prevRooms => prevRooms.map(room => 
      room.id === purchase.roomId 
        ? { ...room, extraCharges: (room.extraCharges || 0) + purchase.price }
        : room
    ));
  };

  const handleAddGuest = (newGuest: Guest) => {
    setGuests(prev => [...prev, newGuest]);
    if (newGuest.roomId) {
      setRooms(prev => prev.map(r => r.id === newGuest.roomId ? { 
        ...r, 
        status: RoomStatus.OCCUPIED, 
        currentGuestId: newGuest.id 
      } : r));
    }
  };

  const handleUpdateGuest = (updatedGuest: Guest) => {
    const oldGuest = guests.find(g => g.id === updatedGuest.id);
    setGuests(prev => prev.map(g => g.id === updatedGuest.id ? updatedGuest : g));

    if (oldGuest && oldGuest.roomId !== updatedGuest.roomId) {
      // Room changed
      setRooms(prev => prev.map(r => {
        if (r.id === oldGuest.roomId) return { ...r, status: RoomStatus.AVAILABLE, currentGuestId: undefined };
        if (r.id === updatedGuest.roomId) return { ...r, status: RoomStatus.OCCUPIED, currentGuestId: updatedGuest.id };
        return r;
      }));
    } else if (updatedGuest.roomId) {
      // Ensure room is marked occupied
      setRooms(prev => prev.map(r => r.id === updatedGuest.roomId ? { 
        ...r, 
        status: RoomStatus.OCCUPIED, 
        currentGuestId: updatedGuest.id 
      } : r));
    }
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

  const handleConfirmReservation = (res: Reservation) => {
    setPrefilledGuest({
      name: res.guestName,
      document: res.document,
      phone: res.phone,
      email: res.email,
      checkInDate: res.date,
      checkInTime: res.time,
      roomId: res.roomId,
      paymentStatus: res.paymentStatus,
      paymentMethod: res.paymentMethod,
      amountPaid: res.amountPaid,
      notes: res.notes || '',
      dailyRate: res.dailyRate
    });
    
    // Update reservation status to Confirmed if we are moving to check-in
    setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: 'Confirmed' } : r));
    
    setCurrentPage('guests');
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
            onAddGuest={handleAddGuest}
            onUpdateGuest={handleUpdateGuest}
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
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={(page) => {
          setCurrentPage(page);
          setIsSidebarOpen(false);
        }} 
        onLogout={handleLogout} 
        hotelName={hotelConfig.name}
        primaryColor={hotelConfig.primaryColor}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6 bg-[#955251] p-4 rounded-2xl border border-white/10 text-white">
          <div className="flex items-center gap-3">
            <Hotel className="text-white" />
            <h1 className="font-black text-sm tracking-tighter uppercase">{hotelConfig.name}</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/10 rounded-xl"
          >
            <LayoutGrid size={24} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
