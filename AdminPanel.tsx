import { useState } from 'react';
import {
  LayoutDashboard, Package, Link2, Settings, LogOut,
  Plus, Trash2, Edit3, Save, X, ChevronRight,
  TrendingUp, ShoppingBag, Globe, DollarSign, Eye, EyeOff
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface StoreLink {
  id: string;
  storeName: string;
  baseUrl: string;
  searchParam: string;
  active: boolean;
  commission: string;
}

interface AdminPart {
  id: string;
  name: string;
  category: string;
  partNumber: string;
  brand: string;
  featured: boolean;
}

// ── Seed data ──────────────────────────────────────────────────────────────
const defaultStores: StoreLink[] = [
  { id: '1', storeName: 'Amazon', baseUrl: 'https://www.amazon.com/s', searchParam: 'k', active: true, commission: '3%' },
  { id: '2', storeName: 'eBay', baseUrl: 'https://www.ebay.com/sch/i.html', searchParam: '_nkw', active: true, commission: '5%' },
  { id: '3', storeName: 'RockAuto', baseUrl: 'https://www.rockauto.com/en/catalog/', searchParam: '', active: true, commission: '4%' },
  { id: '4', storeName: 'AutoZone', baseUrl: 'https://www.autozone.com/search', searchParam: 'searchText', active: true, commission: '2%' },
  { id: '5', storeName: 'AliExpress', baseUrl: 'https://www.aliexpress.com/wholesale', searchParam: 'SearchText', active: true, commission: '6%' },
  { id: '6', storeName: 'Walmart', baseUrl: 'https://www.walmart.com/search', searchParam: 'q', active: false, commission: '3%' },
];

const defaultParts: AdminPart[] = [
  { id: '1', name: 'Brake Pads Premium Set', category: 'Brake System', partNumber: 'BP-2024-PRO', brand: 'Bosch', featured: true },
  { id: '2', name: 'Oil Filter Cartridge', category: 'Filters', partNumber: 'OF-5518-ECO', brand: 'Mann', featured: false },
  { id: '3', name: 'Front Shock Absorber', category: 'Suspension', partNumber: 'SA-9901-HX', brand: 'KYB', featured: true },
  { id: '4', name: 'Spark Plug Set x4', category: 'Electrical', partNumber: 'SP-7732-IRD', brand: 'NGK', featured: false },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, delta, color }: { icon: any; label: string; value: string; delta?: string; color: string }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
          <Icon size={18} style={{ color }} />
        </div>
        {delta && <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>{delta}</span>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs mt-1" style={{ color: '#555' }}>{label}</p>
    </div>
  );
}

// ── Main Admin Component ───────────────────────────────────────────────────
interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stores' | 'parts' | 'settings'>('dashboard');
  const [stores, setStores] = useState<StoreLink[]>(defaultStores);
  const [parts, setParts] = useState<AdminPart[]>(defaultParts);
  const [editingStore, setEditingStore] = useState<StoreLink | null>(null);
  const [editingPart, setEditingPart] = useState<AdminPart | null>(null);
  const [addingStore, setAddingStore] = useState(false);
  const [addingPart, setAddingPart] = useState(false);
  const [newStore, setNewStore] = useState<Partial<StoreLink>>({ active: true, commission: '3%' });
  const [newPart, setNewPart] = useState<Partial<AdminPart>>({ featured: false });
  const [adminPass, setAdminPass] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Simple auth gate
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a', fontFamily: "'Outfit', sans-serif" }}>
        <div className="w-full max-w-sm p-8 rounded-2xl" style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ff461e' }}>
              <Settings size={22} className="text-black" />
            </div>
            <h2 className="text-white text-xl font-bold">Admin Access</h2>
            <p className="text-xs mt-1" style={{ color: '#555' }}>Enter admin password to continue</p>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (adminPass === 'admin123' ? setAuthenticated(true) : alert('Wrong password'))}
            className="w-full px-4 py-3 rounded-lg text-white outline-none mb-4 text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            onClick={() => adminPass === 'admin123' ? setAuthenticated(true) : alert('Wrong password. Hint: admin123')}
            className="w-full py-3 rounded-lg font-bold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#ff461e' }}
          >
            Login
          </button>
          <button onClick={onBack} className="w-full mt-3 text-xs text-center" style={{ color: '#444' }}>
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  const toggleStoreActive = (id: string) => {
    setStores((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteStore = (id: string) => setStores((prev) => prev.filter((s) => s.id !== id));
  const deletePart = (id: string) => setParts((prev) => prev.filter((p) => p.id !== id));

  const saveStore = () => {
    if (!newStore.storeName || !newStore.baseUrl) return;
    setStores((prev) => [...prev, { id: Date.now().toString(), storeName: newStore.storeName!, baseUrl: newStore.baseUrl!, searchParam: newStore.searchParam || '', active: true, commission: newStore.commission || '3%' }]);
    setNewStore({ active: true, commission: '3%' });
    setAddingStore(false);
  };

  const savePart = () => {
    if (!newPart.name) return;
    setParts((prev) => [...prev, { id: Date.now().toString(), name: newPart.name!, category: newPart.category || 'General', partNumber: newPart.partNumber || 'N/A', brand: newPart.brand || 'Generic', featured: newPart.featured || false }]);
    setNewPart({ featured: false });
    setAddingPart(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stores', label: 'Store Links', icon: Link2 },
    { id: 'parts', label: 'Parts', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0a0a', fontFamily: "'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col py-8 px-4 border-r" style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="px-3 mb-8">
          <span className="font-bold text-white text-lg tracking-tight">rabieforauto</span>
          <div className="text-xs mt-0.5" style={{ color: '#ff461e' }}>Admin Panel</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left"
              style={{
                backgroundColor: activeTab === id ? 'rgba(255,70,30,0.12)' : 'transparent',
                color: activeTab === id ? '#ff461e' : '#555',
              }}
            >
              <Icon size={16} />
              {label}
              {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 text-xs w-full rounded-lg transition-colors hover:text-white" style={{ color: '#444' }}>
            <LogOut size={14} />
            Back to Site
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-sm mb-8" style={{ color: '#555' }}>Overview of your auto parts platform</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard icon={Globe} label="Active Stores" value={stores.filter(s => s.active).length.toString()} delta="+2 this month" color="#ff461e" />
              <StatCard icon={Package} label="Parts Listed" value={parts.length.toString()} delta="+12 today" color="#3b82f6" />
              <StatCard icon={TrendingUp} label="Searches Today" value="1,284" delta="+8%" color="#22c55e" />
              <StatCard icon={DollarSign} label="Avg. Commission" value="3.8%" color="#f59e0b" />
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-white font-semibold mb-4">Active Store Links</h3>
              <div className="space-y-2">
                {stores.filter(s => s.active).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-sm text-white">{s.storeName}</span>
                    <span className="text-xs" style={{ color: '#22c55e' }}>● Live · {s.commission} commission</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Store Links */}
        {activeTab === 'stores' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">Store Links</h1>
                <p className="text-sm" style={{ color: '#555' }}>Manage affiliate & partner store URLs</p>
              </div>
              <button
                onClick={() => setAddingStore(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-black transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#ff461e' }}
              >
                <Plus size={15} /> Add Store
              </button>
            </div>

            {/* Add Store Form */}
            {addingStore && (
              <div className="mb-6 p-5 rounded-xl" style={{ backgroundColor: 'rgba(255,70,30,0.05)', border: '1px solid rgba(255,70,30,0.2)' }}>
                <h4 className="text-white font-semibold mb-4">New Store</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    { key: 'storeName', label: 'Store Name', placeholder: 'e.g. Parts Geek' },
                    { key: 'baseUrl', label: 'Search Base URL', placeholder: 'https://...' },
                    { key: 'searchParam', label: 'Search Param', placeholder: 'q or searchText' },
                    { key: 'commission', label: 'Commission %', placeholder: '3%' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs mb-1.5" style={{ color: '#888' }}>{label}</label>
                      <input
                        placeholder={placeholder}
                        value={(newStore as any)[key] || ''}
                        onChange={(e) => setNewStore((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={saveStore} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-black" style={{ backgroundColor: '#ff461e' }}>
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => setAddingStore(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ color: '#666' }}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Store Table */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Store', 'Base URL', 'Commission', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#555' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store, i) => (
                    <tr key={store.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-5 py-3 font-semibold text-white">{store.storeName}</td>
                      <td className="px-5 py-3 max-w-xs truncate" style={{ color: '#555', fontSize: '12px' }}>{store.baseUrl}</td>
                      <td className="px-5 py-3" style={{ color: '#22c55e' }}>{store.commission}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleStoreActive(store.id)} className="flex items-center gap-1.5 text-xs font-semibold">
                          {store.active ? <Eye size={13} style={{ color: '#22c55e' }} /> : <EyeOff size={13} style={{ color: '#555' }} />}
                          <span style={{ color: store.active ? '#22c55e' : '#555' }}>{store.active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(store.baseUrl, '_blank')}
                            className="p-1.5 rounded-md transition-colors hover:bg-white/10"
                            title="Open URL"
                          >
                            <ShoppingBag size={14} style={{ color: '#888' }} />
                          </button>
                          <button onClick={() => deleteStore(store.id)} className="p-1.5 rounded-md transition-colors hover:bg-red-500/10" title="Delete">
                            <Trash2 size={14} style={{ color: '#ff4444' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Parts */}
        {activeTab === 'parts' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">Parts</h1>
                <p className="text-sm" style={{ color: '#555' }}>Manage featured & catalogued parts</p>
              </div>
              <button
                onClick={() => setAddingPart(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-black transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#ff461e' }}
              >
                <Plus size={15} /> Add Part
              </button>
            </div>

            {addingPart && (
              <div className="mb-6 p-5 rounded-xl" style={{ backgroundColor: 'rgba(255,70,30,0.05)', border: '1px solid rgba(255,70,30,0.2)' }}>
                <h4 className="text-white font-semibold mb-4">New Part</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    { key: 'name', label: 'Part Name', placeholder: 'e.g. Oil Filter' },
                    { key: 'partNumber', label: 'Part Number', placeholder: 'ABC-1234' },
                    { key: 'brand', label: 'Brand', placeholder: 'Bosch' },
                    { key: 'category', label: 'Category', placeholder: 'Filters' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs mb-1.5" style={{ color: '#888' }}>{label}</label>
                      <input
                        placeholder={placeholder}
                        value={(newPart as any)[key] || ''}
                        onChange={(e) => setNewPart((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer" style={{ color: '#888' }}>
                  <input type="checkbox" checked={newPart.featured} onChange={(e) => setNewPart((p) => ({ ...p, featured: e.target.checked }))} className="accent-[#ff461e]" />
                  Featured part
                </label>
                <div className="flex gap-2">
                  <button onClick={savePart} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-black" style={{ backgroundColor: '#ff461e' }}>
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => setAddingPart(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ color: '#666' }}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Name', 'Part #', 'Brand', 'Category', 'Featured', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#555' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part, i) => (
                    <tr key={part.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-5 py-3 font-semibold text-white">{part.name}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: '#555' }}>{part.partNumber}</td>
                      <td className="px-5 py-3" style={{ color: '#ccc' }}>{part.brand}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(255,70,30,0.12)', color: '#ff461e' }}>
                          {part.category}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span style={{ color: part.featured ? '#fbbf24' : '#333' }}>{part.featured ? '★ Yes' : '—'}</span>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => deletePart(part.id)} className="p-1.5 rounded-md transition-colors hover:bg-red-500/10">
                          <Trash2 size={14} style={{ color: '#ff4444' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-lg">
            <h1 className="text-white text-2xl font-bold mb-2">Settings</h1>
            <p className="text-sm mb-8" style={{ color: '#555' }}>Platform configuration</p>
            {[
              { label: 'Site Name', value: 'rabieforauto' },
              { label: 'Default Currency', value: 'USD' },
              { label: 'Max Stores per Result', value: '6' },
              { label: 'Cache TTL (minutes)', value: '15' },
            ].map(({ label, value }) => (
              <div key={label} className="mb-4">
                <label className="block text-xs mb-1.5" style={{ color: '#888' }}>{label}</label>
                <input
                  defaultValue={value}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            ))}
            <button className="px-5 py-2.5 rounded-lg text-sm font-bold text-black mt-2 transition-opacity hover:opacity-90" style={{ backgroundColor: '#ff461e' }}>
              Save Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
