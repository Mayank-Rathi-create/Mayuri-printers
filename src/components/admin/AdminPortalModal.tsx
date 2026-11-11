import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Package,
  ArrowRight,
  LogOut,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  type AdminOrder,
  type OrderStatus,
  getStoredOrders,
  saveStoredOrders,
  addStoredOrder,
} from '../../utils/orderStorage';

export type { AdminOrder, OrderStatus };

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Lockout & Attempts State: 4 tries total, 2 min lockout on 4 failures
  const [attemptsLeft, setAttemptsLeft] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mayuri_admin_attempts_left');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 4) return parsed;
      }
    } catch {
      // Fallback
    }
    return 4;
  });

  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(() => {
    try {
      const until = localStorage.getItem('mayuri_admin_lockout_until');
      if (until) {
        const diff = Math.ceil((parseInt(until, 10) - Date.now()) / 1000);
        if (diff > 0) return diff;
      }
    } catch {
      // Fallback
    }
    return 0;
  });

  // Orders State (Persisted in localStorage & synchronized across browser tabs / quote submissions)
  const [orders, setOrders] = useState<AdminOrder[]>(() => getStoredOrders());

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  // Add Order Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newProduct, setNewProduct] = useState('Carbonless Triplicate Bill Books');
  const [newAmount, setNewAmount] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newSpecs, setNewSpecs] = useState('');
  const [newStatus, setNewStatus] = useState<OrderStatus>('not_started');
  const [formError, setFormError] = useState('');

  // Format countdown seconds into MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Synchronize lockout countdown
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;

    const interval = setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('mayuri_admin_lockout_until');
          localStorage.setItem('mayuri_admin_attempts_left', '4');
          setAttemptsLeft(4);
          setLoginError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTimeLeft]);

  // Synchronize orders whenever storage updates or modal opens
  useEffect(() => {
    if (isOpen) {
      setOrders(getStoredOrders());
      // Recheck lockout status
      try {
        const until = localStorage.getItem('mayuri_admin_lockout_until');
        if (until) {
          const diff = Math.ceil((parseInt(until, 10) - Date.now()) / 1000);
          if (diff > 0) setLockoutTimeLeft(diff);
        }
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSync = () => {
      setOrders(getStoredOrders());
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('mayuri_orders_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('mayuri_orders_updated', handleSync);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isAddModalOpen) setIsAddModalOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAddModalOpen, onClose]);

  // Handle Login Authentication with 4 Attempts & 2-Minute Lockout
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (lockoutTimeLeft > 0) {
      setLoginError(`Wrong password. Access locked. Please wait ${formatTimer(lockoutTimeLeft)} before trying again.`);
      return;
    }

    const cleanName = adminName.trim();
    const cleanPass = adminPassword.trim();

    // Exact check required: name "Binay Rathi" and password "Moon@Rise5"
    if (cleanName.toLowerCase() === 'binay rathi' && cleanPass === 'Moon@Rise5') {
      setIsLoggedIn(true);
      setLoginError('');
      setAttemptsLeft(4);
      localStorage.setItem('mayuri_admin_attempts_left', '4');
      localStorage.removeItem('mayuri_admin_lockout_until');
    } else {
      const remaining = attemptsLeft - 1;
      if (remaining <= 0) {
        // Trigger 2-minute (120 seconds) lockout
        const lockoutEnd = Date.now() + 120 * 1000;
        localStorage.setItem('mayuri_admin_lockout_until', String(lockoutEnd));
        localStorage.setItem('mayuri_admin_attempts_left', '0');
        setAttemptsLeft(0);
        setLockoutTimeLeft(120);
        setLoginError('Wrong password. Too many failed attempts. Access locked for 02:00.');
      } else {
        setAttemptsLeft(remaining);
        localStorage.setItem('mayuri_admin_attempts_left', String(remaining));
        setLoginError(`Wrong password. ${remaining} ${remaining === 1 ? 'try' : 'tries'} remaining.`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminName('');
    setAdminPassword('');
    setLoginError('');
  };

  // Update Status of an Order
  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus, isNew: false } : o));
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // Delete an Order
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updated = orders.filter((o) => o.id !== orderId);
      setOrders(updated);
      saveStoredOrders(updated);
    }
  };

  // Submit New Order
  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newClient.trim() || !newAmount.trim() || !newPrice.trim()) {
      setFormError('Please enter Client Name, Product Amount, and Total Price.');
      return;
    }

    const newOrder: AdminOrder = {
      id: `MP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      client: newClient.trim(),
      location: newLocation.trim() || 'Factory Direct Pickup',
      product: newProduct.trim(),
      amount: newAmount.trim(),
      price: newPrice.trim().startsWith('₹') || newPrice.trim().startsWith('$') ? newPrice.trim() : `₹${newPrice.trim()}`,
      specs: newSpecs.trim() || 'Standard commercial offset production specifications',
      status: newStatus,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    addStoredOrder(newOrder);
    setOrders(getStoredOrders());
    setIsAddModalOpen(false);

    // Reset Form
    setNewClient('');
    setNewLocation('');
    setNewAmount('');
    setNewPrice('');
    setNewSpecs('');
    setNewStatus('not_started');
  };

  if (!isOpen) return null;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      o.client.toLowerCase().includes(query) ||
      o.product.toLowerCase().includes(query) ||
      o.id.toLowerCase().includes(query) ||
      o.specs.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const countNotStarted = orders.filter((o) => o.status === 'not_started').length;
  const countGoingOn = orders.filter((o) => o.status === 'going_on').length;
  const countCompleted = orders.filter((o) => o.status === 'completed').length;

  // ========================================================
  // 1. LOGIN DIALOG (Centered modal overlay when not signed in)
  // ========================================================
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090B10]/95 backdrop-blur-2xl animate-fadeIn select-none">
        <div className="relative w-full max-w-md bg-[#0E121A] border border-[#232A38] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] p-6 sm:p-8 overflow-hidden">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D6AD61]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close Admin Modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#A1A8B5] hover:text-[#F5F3ED] hover:bg-[#1E2533] border border-[#232A38] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#141821] border border-[#D6AD61]/40 flex items-center justify-center text-[#D6AD61] shadow-lg mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-technical uppercase tracking-widest text-[#D6AD61] font-semibold">
              MAYURI PRINTERS • FACTORY MANAGEMENT
            </div>
            <h2 className="text-2xl font-editorial font-bold text-[#F5F3ED]">
              Executive Admin Portal
            </h2>
            <p className="text-xs text-[#A1A8B5] max-w-xs leading-relaxed">
              Restricted management area. Sign in to view live production runs, incoming quotation orders, amounts, and completion statuses.
            </p>
          </div>

          {/* Error Message with Countdown Timer on Lockout */}
          {lockoutTimeLeft > 0 ? (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-semibold">Wrong password. Access locked.</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-900/60 border border-red-700/80 font-mono text-xs font-bold text-red-100">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>{formatTimer(lockoutTimeLeft)}</span>
              </div>
            </div>
          ) : (
            loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center justify-between gap-2 leading-relaxed">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
                <span className="font-technical text-[10px] px-2 py-0.5 rounded bg-red-900/50 border border-red-700/60 text-red-300 font-semibold whitespace-nowrap">
                  {attemptsLeft} / 4 left
                </span>
              </div>
            )
          )}

          {/* Login Form (Empty placeholder, no leaked credentials) */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-technical text-[#A1A8B5] mb-1.5 uppercase tracking-wider">
                Authorized Executive Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={lockoutTimeLeft > 0}
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder=""
                  className="w-full bg-[#141821] border border-[#232A38] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <User className="w-4 h-4 text-[#A1A8B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-technical text-[#A1A8B5] mb-1.5 uppercase tracking-wider">
                Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={lockoutTimeLeft > 0}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder=""
                  className="w-full bg-[#141821] border border-[#232A38] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F5F3ED] focus:border-[#D6AD61] focus:outline-none transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Lock className="w-4 h-4 text-[#A1A8B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={lockoutTimeLeft > 0}
              className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 mt-6 ${
                lockoutTimeLeft > 0
                  ? 'bg-[#1C222E] text-[#A1A8B5] border border-[#2B3545] cursor-not-allowed opacity-75'
                  : 'bg-[#D6AD61] hover:bg-[#E5C384] text-[#090B10] cursor-pointer'
              }`}
            >
              {lockoutTimeLeft > 0 ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span>Access Locked: Wait {formatTimer(lockoutTimeLeft)}</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Access Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#232A38] text-center text-[11px] font-technical text-[#A1A8B5]">
            Authorized Signatory • Mayuri Printers Est. 1991
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. AUTHENTICATED ORDERS MANAGEMENT PORTAL (FULL SCREEN)
  // ========================================================
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#0E121A] flex flex-col overflow-hidden animate-fadeIn select-none">
      
      {/* Top Bar: Brand, Admin Profile, Stats & Action Controls (Full Width) */}
      <div className="px-6 sm:px-10 py-4 border-b border-[#232A38] flex flex-wrap items-center justify-between gap-4 z-20 bg-[#121722] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D6AD61]/15 border border-[#D6AD61]/50 flex items-center justify-center text-[#D6AD61] font-bold text-sm shadow-sm">
            BR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-base sm:text-lg font-bold text-[#F5F3ED]">
                Binay Rathi
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-technical bg-[#D6AD61]/20 text-[#D6AD61] border border-[#D6AD61]/40 font-semibold uppercase">
                Managing Director
              </span>
            </div>
            <div className="text-[11px] font-technical text-[#A1A8B5]">
              Factory Order Book & Production Dispatch Control
            </div>
          </div>
        </div>

        {/* Quick Stat Counters */}
        <div className="hidden md:flex items-center gap-2.5 font-technical text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#141821] border border-[#232A38] text-[#A1A8B5]">
            Total: <strong className="text-[#F5F3ED]">{orders.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#0F2027] border border-emerald-900/50 text-emerald-400">
            Completed: <strong>{countCompleted}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#2D2110] border border-amber-900/50 text-amber-300">
            Going On: <strong>{countGoingOn}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#1A1F2C] border border-slate-700/50 text-slate-300">
            Not Started: <strong>{countNotStarted}</strong>
          </span>
        </div>

        {/* Actions: Add Order, Logout, Close Fullscreen */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E5C384] text-[#090B10] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Order</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log Out Admin"
            className="p-2 rounded-xl text-[#A1A8B5] hover:text-red-400 hover:bg-[#1E2533] border border-[#232A38] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            aria-label="Exit Fullscreen Portal"
            title="Exit Fullscreen Portal"
            className="p-2 rounded-xl text-[#A1A8B5] hover:text-[#F5F3ED] hover:bg-[#1E2533] border border-[#232A38] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Status Filter Ribbon (Full Width) */}
      <div className="px-6 sm:px-10 py-3.5 border-b border-[#232A38] bg-[#0E121A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by client, product, amount, or ID..."
            className="w-full bg-[#141821] border border-[#232A38] rounded-xl pl-9 pr-8 py-2 text-xs text-[#F5F3ED] placeholder-[#A1A8B5]/50 focus:border-[#D6AD61] focus:outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#A1A8B5] absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A8B5] hover:text-[#F5F3ED]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141821] rounded-xl border border-[#232A38] overflow-x-auto">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'going_on', label: `Going On (${countGoingOn})` },
            { id: 'completed', label: `Completed (${countCompleted})` },
            { id: 'not_started', label: `Not Started (${countNotStarted})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-technical uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#D6AD61] text-[#090B10] font-bold shadow-sm'
                  : 'text-[#A1A8B5] hover:text-[#F5F3ED]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List View (Fills full viewport height, highlights Product, Amount, and Price) */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-[#A1A8B5] space-y-3">
            <Package className="w-12 h-12 mx-auto text-[#A1A8B5]/40" />
            <div className="text-xl font-editorial font-bold text-[#F5F3ED]">No new orders</div>
            <div className="text-xs font-technical text-[#A1A8B5] max-w-sm mx-auto leading-relaxed">
              New orders submitted through the quotation engine or added manually will appear here in real time.
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isCompleted = order.status === 'completed';
            const isGoingOn = order.status === 'going_on';
            const isNotStarted = order.status === 'not_started';

            return (
              <div
                key={order.id}
                className={`p-4 sm:p-5 rounded-2xl bg-[#141821] border transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm group ${
                  order.isNew ? 'border-[#D6AD61]/60 shadow-[0_0_20px_rgba(214,173,97,0.1)]' : 'border-[#232A38] hover:border-[#D6AD61]/40'
                }`}
              >
                {/* Left: Client Name (WIDER & CLEAR), Order ID, Date, Specs */}
                <div className="space-y-1.5 flex-1 min-w-0 pr-0 xl:pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D6AD61] bg-[#1A2230] px-2.5 py-0.5 rounded border border-[#D6AD61]/30">
                      {order.id}
                    </span>
                    {order.isNew && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-technical uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>New Quotation Order</span>
                      </span>
                    )}
                    <span className="text-xs font-technical text-[#A1A8B5] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#A1A8B5]" />
                      <span>{order.date}</span>
                    </span>
                    {order.location && (
                      <span className="text-[11px] font-technical text-[#A1A8B5]/70">
                        • {order.location}
                      </span>
                    )}
                  </div>

                  {/* Client Name: Wider, Expansive, Clear & Prominent */}
                  <div className="font-editorial text-lg sm:text-xl font-bold text-[#F5F3ED] leading-snug tracking-wide">
                    {order.client}
                  </div>

                  <div className="text-xs text-[#A1A8B5] leading-relaxed max-w-4xl font-normal">
                    <strong className="text-[#D6AD61] font-technical text-[11px] uppercase mr-1">Specs:</strong>
                    {order.specs}
                  </div>
                </div>

                {/* Middle (3rd image): SHORTENED, GAP-FREE & TIGHT WITH ZERO WASTED SPACE */}
                <div className="flex items-center gap-3 sm:gap-4 bg-[#0B0E14] px-4 py-2.5 rounded-xl border border-[#232A38] shrink-0 self-start xl:self-center">
                  {/* Product */}
                  <div className="pr-3 border-r border-[#232A38]">
                    <span className="text-[10px] font-technical uppercase tracking-wider text-[#A1A8B5] block">
                      Product
                    </span>
                    <div className="text-xs font-semibold text-[#D6AD61] mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
                      <Package className="w-3.5 h-3.5 shrink-0 text-[#D6AD61]" />
                      <span>{order.product}</span>
                    </div>
                  </div>

                  {/* Amount / Quantity */}
                  <div className="pr-3 border-r border-[#232A38] whitespace-nowrap">
                    <span className="text-[10px] font-technical uppercase tracking-wider text-[#A1A8B5] block">
                      Amount / Quantity
                    </span>
                    <div className="text-xs font-bold text-[#F5F3ED] mt-0.5 font-mono">
                      {order.amount}
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="whitespace-nowrap">
                    <span className="text-[10px] font-technical uppercase tracking-wider text-[#A1A8B5] block">
                      Total Price
                    </span>
                    <div className="text-sm font-bold text-[#D6AD61] font-mono mt-0.5">
                      {order.price}
                    </div>
                  </div>
                </div>

                {/* Right: Status Controls & Delete */}
                <div className="flex items-center gap-2 shrink-0 self-start xl:self-center">
                  {/* Status Selector Segmented Buttons */}
                  <div className="flex items-center gap-1 bg-[#090B10] p-1 rounded-xl border border-[#232A38]">
                    <button
                      onClick={() => handleStatusChange(order.id, 'not_started')}
                      title="Mark Not Started"
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-technical transition-all cursor-pointer flex items-center gap-1 ${
                        isNotStarted
                          ? 'bg-slate-700 text-white font-bold shadow-sm'
                          : 'text-[#A1A8B5] hover:text-white'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>Not Started</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.id, 'going_on')}
                      title="Mark Going On / In Production"
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-technical transition-all cursor-pointer flex items-center gap-1 ${
                        isGoingOn
                          ? 'bg-amber-500 text-black font-bold shadow-sm'
                          : 'text-[#A1A8B5] hover:text-amber-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isGoingOn ? 'bg-black' : 'bg-amber-400'} animate-pulse`} />
                      <span>Going On</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      title="Mark Completed"
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-technical transition-all cursor-pointer flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white font-bold shadow-sm'
                          : 'text-[#A1A8B5] hover:text-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </button>
                  </div>

                  {/* Delete Action */}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="p-2 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all cursor-pointer"
                    title="Delete order record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer Bar (Full Width) */}
      <div className="px-6 sm:px-10 py-3 border-t border-[#232A38] bg-[#121722] flex items-center justify-between text-xs font-technical text-[#A1A8B5] shrink-0">
        <span>Mayuri Printers Management • Factory Production System</span>
        <span className="text-[#D6AD61] font-semibold">Binay Rathi • Master Administration</span>
      </div>

      {/* ========================================================
          3. ADD NEW ORDER MODAL
      ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0E121A] border border-[#232A38] rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#A1A8B5] hover:text-[#F5F3ED] p-1.5 rounded-full hover:bg-[#1A202B] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="text-[10px] font-technical text-[#D6AD61] uppercase tracking-widest font-semibold">
                FACTORY RECORD ENTRY
              </div>
              <h3 className="text-xl font-editorial font-bold text-[#F5F3ED]">
                Add New Production Order
              </h3>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddOrderSubmit} className="space-y-3.5 text-xs font-technical">
              <div>
                <label className="block text-[#A1A8B5] mb-1 uppercase tracking-wider">
                  Client / Institutional Name *
                </label>
                <input
                  type="text"
                  required
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Apex University Medical College"
                  className="w-full bg-[#141821] border border-[#232A38] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] placeholder-[#A1A8B5]/50 focus:border-[#D6AD61] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A8B5] mb-1 uppercase tracking-wider">
                  Destination / Delivery Center
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Kathmandu Campus Logistics Depots"
                  className="w-full bg-[#141821] border border-[#232A38] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] placeholder-[#A1A8B5]/50 focus:border-[#D6AD61] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A8B5] mb-1 uppercase tracking-wider">
                  Product *
                </label>
                <select
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full bg-[#141821] border border-[#232A38] rounded-xl px-3.5 py-2 text-xs text-[#D6AD61] focus:border-[#D6AD61] focus:outline-none"
                >
                  <option value="Carbonless Triplicate Bill Books">Carbonless Triplicate Bill Books</option>
                  <option value="Academic Curriculum Textbooks">Academic Curriculum Textbooks</option>
                  <option value="700 GSM Luxury Visiting Cards">700 GSM Luxury Visiting Cards</option>
                  <option value="Anti-Counterfeit Certificates">Anti-Counterfeit Certificates</option>
                  <option value="Examination Answer Booklets">Examination Answer Booklets</option>
                  <option value="Custom Paper Packaging & Ledgers">Custom Paper Packaging & Ledgers</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A1A8B5] mb-1 uppercase tracking-wider">
                    Amount / Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 50,000 Copies"
                    className="w-full bg-[#141821] border border-[#232A38] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] placeholder-[#A1A8B5]/50 focus:border-[#D6AD61] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#A1A8B5] mb-1 uppercase tracking-wider">
                    Total Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. ₹18,50,000"
                    className="w-full bg-[#141821] border border-[#232A38] rounded-xl px-3.5 py-2 text-xs text-[#D6AD61] placeholder-[#A1A8B5]/50 focus:border-[#D6AD61] focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A1A8B5] mb-1 uppercase tracking-wider">
                  Production Specifications & Details
                </label>
                <textarea
                  rows={2}
                  value={newSpecs}
                  onChange={(e) => setNewSpecs(e.target.value)}
                  placeholder="e.g. 70 GSM Maplitho, Smyth-sewn lay-flat, 24K gold foil deboss, matte lamination"
                  className="w-full bg-[#141821] border border-[#232A38] rounded-xl px-3.5 py-2 text-xs text-[#F5F3ED] placeholder-[#A1A8B5]/50 focus:border-[#D6AD61] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#A1A8B5] mb-1 uppercase tracking-wider">
                  Initial Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'not_started', label: 'Not Started' },
                    { id: 'going_on', label: 'Going On' },
                    { id: 'completed', label: 'Completed' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setNewStatus(s.id as OrderStatus)}
                      className={`py-2 rounded-xl text-[11px] font-technical uppercase transition-all cursor-pointer ${
                        newStatus === s.id
                          ? 'bg-[#D6AD61] text-[#090B10] font-bold shadow-sm'
                          : 'bg-[#141821] border border-[#232A38] text-[#A1A8B5] hover:text-[#F5F3ED]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs bg-[#141821] hover:bg-[#1A202B] text-[#A1A8B5] hover:text-[#F5F3ED] border border-[#232A38] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#D6AD61] hover:bg-[#E5C384] text-[#090B10] shadow-sm transition-all cursor-pointer"
                >
                  Save Order Record
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
