
import React, { useState, useEffect } from 'react';
import { Room, Guest, Reservation, ReceptionNote, RoomStatus, RoomType, Product, Purchase, PaymentStatus, PaymentMethod } from './types';
import { Hotel, LayoutGrid, Loader2 } from 'lucide-react';
import { supabase } from './supabase';
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notes, setNotes] = useState<ReceptionNote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [prefilledGuest, setPrefilledGuest] = useState<Partial<Guest> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Persistence - Fetch from Supabase
  const fetchData = async () => {
    try {
      const [
        { data: roomsData },
        { data: guestsData },
        { data: resData },
        { data: notesData },
        { data: productsData },
        { data: purchasesData },
        { data: settingsData }
      ] = await Promise.all([
        supabase.from('rooms').select('*'),
        supabase.from('guests').select('*'),
        supabase.from('reservations').select('*'),
        supabase.from('notes').select('*'),
        supabase.from('products').select('*'),
        supabase.from('purchases').select('*'),
        supabase.from('settings').select('*').eq('id', 'hotel_config').single()
      ]);

      // Bootstrap logic: if DB is completely empty for key tables, insert initial data
      if (!roomsData || roomsData.length === 0) {
        await supabase.from('rooms').insert(INITIAL_ROOMS);
        setRooms(INITIAL_ROOMS);
      } else {
        setRooms(roomsData as Room[]);
      }

      if (!guestsData || guestsData.length === 0) {
        // Only bootstrap if it's the very first load and no guests ever
        // We'll just show them for now, but not necessarily insert initial guest automatically to avoid pollution
        setGuests(guestsData && guestsData.length === 0 ? [] : (guestsData as Guest[] || INITIAL_GUESTS));
      } else {
        setGuests(guestsData as Guest[]);
      }

      if (resData) setReservations(resData as Reservation[]);
      if (notesData) setNotes(notesData as ReceptionNote[]);
      
      if (!productsData || productsData.length === 0) {
        await supabase.from('products').insert(INITIAL_PRODUCTS);
        setProducts(INITIAL_PRODUCTS);
      } else {
        setProducts(productsData as Product[]);
      }

      if (purchasesData) setPurchases(purchasesData as Purchase[]);
      if (settingsData) {
        setHotelConfig({ name: settingsData.name, primaryColor: settingsData.primaryColor });
      } else {
        // If no settings exist, the useEffect will create them soon
        console.log('No settings found in Supabase, using defaults.');
      }

    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      // Fallback to avoid empty screen
      setRooms(INITIAL_ROOMS);
      setProducts(INITIAL_PRODUCTS);
      setGuests(INITIAL_GUESTS);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('hotel_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsLoaded(true);
    }

    // Set up real-time subscriptions
    const roomsSub = supabase.channel('rooms-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => fetchData()).subscribe();
    const guestsSub = supabase.channel('guests-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => fetchData()).subscribe();
    const resSub = supabase.channel('res-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => fetchData()).subscribe();
    const productsSub = supabase.channel('products-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData()).subscribe();
    const purchasesSub = supabase.channel('purchases-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => fetchData()).subscribe();
    const notesSub = supabase.channel('notes-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => fetchData()).subscribe();
    const settingsSub = supabase.channel('settings-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchData()).subscribe();

    return () => {
      supabase.removeChannel(roomsSub);
      supabase.removeChannel(guestsSub);
      supabase.removeChannel(resSub);
      supabase.removeChannel(productsSub);
      supabase.removeChannel(purchasesSub);
      supabase.removeChannel(notesSub);
      supabase.removeChannel(settingsSub);
    };
  }, []);

  // Update effect to save config to settings table
  useEffect(() => {
    if (isAuthenticated && isLoaded) {
      const saveConfig = async () => {
        await supabase.from('settings').upsert({
          id: 'hotel_config',
          name: hotelConfig.name,
          primaryColor: hotelConfig.primaryColor,
          updated_at: new Date().toISOString()
        });
      };
      saveConfig();
    }
  }, [hotelConfig, isAuthenticated, isLoaded]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('hotel_auth', 'true');
      fetchData();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hotel_auth');
  };

  const addPurchase = async (purchaseData: Omit<Purchase, 'id' | 'timestamp'>) => {
    setIsSyncing(true);
    const newPurchase: Purchase = {
      ...purchaseData,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
    };

    try {
      await Promise.all([
        supabase.from('purchases').insert(newPurchase),
        supabase.from('products').update({ stock: Math.max(0, products.find(p => p.id === purchaseData.productId)?.stock! - 1) }).eq('id', purchaseData.productId),
        supabase.from('rooms').update({ 
          extraCharges: (rooms.find(r => r.id === purchaseData.roomId)?.extraCharges || 0) + purchaseData.price 
        }).eq('id', purchaseData.roomId)
      ]);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddGuest = async (newGuest: Guest) => {
    setIsSyncing(true);
    try {
      await supabase.from('guests').insert(newGuest);
      if (newGuest.roomId) {
        await supabase.from('rooms').update({ 
          status: RoomStatus.OCCUPIED, 
          currentGuestId: newGuest.id 
        }).eq('id', newGuest.roomId);
      }
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateGuest = async (updatedGuest: Guest) => {
    setIsSyncing(true);
    try {
      const oldGuest = guests.find(g => g.id === updatedGuest.id);
      await supabase.from('guests').update(updatedGuest).eq('id', updatedGuest.id);

      if (oldGuest && oldGuest.roomId !== updatedGuest.roomId) {
        if (oldGuest.roomId) {
          await supabase.from('rooms').update({ status: RoomStatus.AVAILABLE, currentGuestId: null }).eq('id', oldGuest.roomId);
        }
        if (updatedGuest.roomId) {
          await supabase.from('rooms').update({ status: RoomStatus.OCCUPIED, currentGuestId: updatedGuest.id }).eq('id', updatedGuest.roomId);
        }
      } else if (updatedGuest.roomId) {
        await supabase.from('rooms').update({ status: RoomStatus.OCCUPIED, currentGuestId: updatedGuest.id }).eq('id', updatedGuest.roomId);
      }
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddReservation = async (res: Reservation) => {
    setIsSyncing(true);
    try {
      await supabase.from('reservations').insert(res);
      if (res.roomId) {
        await supabase.from('rooms').update({ status: RoomStatus.RESERVED }).eq('id', res.roomId);
      }
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateReservation = async (updatedRes: Reservation) => {
    setIsSyncing(true);
    try {
      const oldRes = reservations.find(r => r.id === updatedRes.id);
      await supabase.from('reservations').update(updatedRes).eq('id', updatedRes.id);
      
      if (oldRes && oldRes.roomId !== updatedRes.roomId) {
        if (oldRes.roomId) await supabase.from('rooms').update({ status: RoomStatus.AVAILABLE }).eq('id', oldRes.roomId);
        if (updatedRes.roomId) await supabase.from('rooms').update({ status: RoomStatus.RESERVED }).eq('id', updatedRes.roomId);
      } else if (updatedRes.roomId) {
        await supabase.from('rooms').update({ status: RoomStatus.RESERVED }).eq('id', updatedRes.roomId);
      }
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    setIsSyncing(true);
    try {
      const res = reservations.find(r => r.id === id);
      await supabase.from('reservations').delete().eq('id', id);
      if (res && res.roomId) {
        await supabase.from('rooms').update({ status: RoomStatus.AVAILABLE }).eq('id', res.roomId);
      }
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    setIsSyncing(true);
    try {
      const guest = guests.find(g => g.id === id);
      await supabase.from('guests').delete().eq('id', id);
      if (guest && guest.roomId) {
        await supabase.from('rooms').update({ status: RoomStatus.AVAILABLE, currentGuestId: null }).eq('id', guest.roomId);
      }
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCheckOut = async (roomId: string) => {
    setIsSyncing(true);
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room || !room.currentGuestId) return;

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      await Promise.all([
        supabase.from('guests').update({
          checkOutDate: dateStr,
          checkOutTime: timeStr
        }).eq('id', room.currentGuestId),
        supabase.from('rooms').update({
          status: RoomStatus.CLEANING,
          currentGuestId: null,
          extraCharges: 0
        }).eq('id', roomId)
      ]);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMarkRoomCleaned = async (roomId: string) => {
    setIsSyncing(true);
    try {
      await supabase.from('rooms').update({ status: RoomStatus.AVAILABLE }).eq('id', roomId).eq('status', RoomStatus.CLEANING);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConfirmReservation = async (res: Reservation) => {
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
    
    await supabase.from('reservations').update({ status: 'Confirmed' }).eq('id', res.id);
    await fetchData();
    setCurrentPage('guests');
  };

  const handleAddRoom = async (room: Room) => {
    setIsSyncing(true);
    try {
      await supabase.from('rooms').insert(room);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateRoom = async (room: Room) => {
    setIsSyncing(true);
    try {
      await supabase.from('rooms').update(room).eq('id', room.id);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    setIsSyncing(true);
    try {
      await supabase.from('rooms').delete().eq('id', id);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddProduct = async (product: Product) => {
    setIsSyncing(true);
    try {
      await supabase.from('products').insert(product);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    setIsSyncing(true);
    try {
      await supabase.from('products').update(product).eq('id', product.id);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setIsSyncing(true);
    try {
      await supabase.from('products').delete().eq('id', id);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateNotes = async (updatedNotes: ReceptionNote[]) => {
    setIsSyncing(true);
    try {
      // Find what changed
      const [
        { data: existingNotes }
      ] = await Promise.all([
        supabase.from('notes').select('id')
      ]);
      const existingIds = existingNotes?.map(n => n.id) || [];
      const updatedIds = updatedNotes.map(n => n.id);

      // Deletes
      const toDelete = existingIds.filter(id => !updatedIds.includes(id));
      if (toDelete.length > 0) await supabase.from('notes').delete().in('id', toDelete);

      // Upserts
      if (updatedNotes.length > 0) await supabase.from('notes').upsert(updatedNotes);
      
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateRooms = async (updatedRooms: Room[]) => {
    setIsSyncing(true);
    try {
      await supabase.from('rooms').upsert(updatedRooms);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateGuests = async (updatedGuests: Guest[]) => {
    setIsSyncing(true);
    try {
      await supabase.from('guests').upsert(updatedGuests);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} hotelName={hotelConfig.name} primaryColor={hotelConfig.primaryColor} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard rooms={rooms} guests={guests} setRooms={handleUpdateRooms} setGuests={handleUpdateGuests} onNavigate={setCurrentPage} fetchAllData={fetchData} />;
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
            setRooms={handleUpdateRooms} 
            guests={guests} 
            purchases={purchases}
            onCheckOut={handleCheckOut}
            onMarkCleaned={handleMarkRoomCleaned}
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
        return <Notes notes={notes} setNotes={handleUpdateNotes} />;
      case 'convenience':
        return (
          <Convenience 
            products={products} 
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
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
            onAddRoom={handleAddRoom}
            onUpdateRoom={handleUpdateRoom}
            onDeleteRoom={handleDeleteRoom}
            hotelConfig={hotelConfig}
            setHotelConfig={setHotelConfig}
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      default:
        return <Dashboard rooms={rooms} guests={guests} setRooms={handleUpdateRooms} setGuests={handleUpdateGuests} onNavigate={setCurrentPage} fetchAllData={fetchData} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {isSyncing && (
        <div className="fixed top-4 right-4 z-[999] bg-blue-600 text-white rounded-full p-2 shadow-lg flex items-center gap-2 pr-4 animate-in fade-in slide-in-from-right-4">
          <Loader2 className="animate-spin" size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</span>
        </div>
      )}
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

