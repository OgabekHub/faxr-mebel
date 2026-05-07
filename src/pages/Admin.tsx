import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn, formatPrice } from '../lib/utils';

const stats = [
  { label: 'Total Sales', value: '45B UZS', icon: BarChart3, trend: '+12.5%', color: 'text-green-500' },
  { label: 'New Orders', value: '1,234', icon: ShoppingBag, trend: '+5.2%', color: 'text-blue-500' },
  { label: 'Active Users', value: '850', icon: Users, trend: '+2.4%', color: 'text-purple-500' },
];

const mockProducts = [
  { id: '1', name: 'Royal Velvet Sofa', price: 12000000, stock: 12, sales: 45 },
  { id: '2', name: 'Modern Oak Dining', price: 8500000, stock: 8, sales: 22 },
  { id: '3', name: 'Minimalist Bed', price: 15000000, stock: 5, sales: 18 },
];

const mockOrders = [
  { id: 'ORD-2026-001', customer: 'Aziz Rahimov', total: 25000000, status: 'Completed', date: '2026-05-01' },
  { id: 'ORD-2026-002', customer: 'Malika Sobirova', total: 12000000, status: 'Processing', date: '2026-05-03' },
  { id: 'ORD-2026-003', customer: 'Doniyor Turopov', total: 8500000, status: 'Pending', date: '2026-05-05' },
  { id: 'ORD-2026-004', customer: 'Jasur Bekanov', total: 42000000, status: 'Completed', date: '2026-05-06' },
];

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-foreground/5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-4 rounded-2xl bg-foreground/5", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 bg-foreground/5 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-sm text-foreground/60 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>
      {renderProducts()}
    </>
  );

  const renderProducts = () => (
    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-foreground/5 overflow-hidden shadow-sm">
      <div className="p-8 border-b border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-bold">Product Inventory</h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="pl-12 pr-6 py-2 bg-foreground/5 rounded-full border border-transparent focus:border-brand-gold outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.02] text-xs font-bold uppercase tracking-widest text-foreground/40">
              <th className="px-8 py-6">Product</th>
              <th className="px-8 py-6">Price</th>
              <th className="px-8 py-6">Stock</th>
              <th className="px-8 py-6">Sales</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {mockProducts.map((p) => (
              <tr key={p.id} className="hover:bg-foreground/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center font-bold text-brand-gold">
                      {p.name.charAt(0)}
                    </div>
                    <span className="font-bold">{p.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6 font-medium">{formatPrice(p.price)}</td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    p.stock < 10 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                  )}>
                    {p.stock} units
                  </span>
                </td>
                <td className="px-8 py-6 font-medium">{p.sales}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-brand-gold hover:text-white rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-foreground/5 overflow-hidden shadow-sm">
      <div className="p-8 border-b border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-xl font-bold">Order Management</h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Filter orders..." 
            className="pl-12 pr-6 py-2 bg-foreground/5 rounded-full border border-transparent focus:border-brand-gold outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-foreground/[0.02] text-xs font-bold uppercase tracking-widest text-foreground/40">
              <th className="px-8 py-6">Order ID</th>
              <th className="px-8 py-6">Customer</th>
              <th className="px-8 py-6">Date</th>
              <th className="px-8 py-6">Total Amount</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-foreground/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-mono text-xs font-bold text-brand-gold">{order.id}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-[10px] font-bold">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-bold text-sm">{order.customer}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-foreground/60">{order.date}</td>
                <td className="px-8 py-6 font-display font-bold italic">{formatPrice(order.total)}</td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    order.status === 'Completed' ? "bg-green-500/10 text-green-500" :
                    order.status === 'Processing' ? "bg-blue-500/10 text-blue-500" :
                    "bg-amber-500/10 text-amber-500"
                  )}>
                    {order.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> :
                     order.status === 'Processing' ? <Clock className="w-3 h-3" /> :
                     <AlertCircle className="w-3 h-3" />}
                    {order.status}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="pt-24 min-h-screen bg-foreground/[0.02] flex">
      {/* Sidebar */}
      <aside className="w-64 glass hidden lg:flex flex-col border-r border-foreground/5 sticky top-24 h-[calc(100vh-6rem)]">
        <div className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-8">Management</h2>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                  activeTab === item.id 
                    ? "bg-brand-gold text-white shadow-lg shadow-brand-gold/20" 
                    : "hover:bg-foreground/5 text-foreground/60"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-light italic tracking-tight">Admin <span className="not-italic font-bold">Portal.</span></h1>
            <p className="text-foreground/40 text-[10px] uppercase tracking-hero font-bold mt-1">Management Center / {activeTab}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-brand-gold text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-hero shadow-lg hover:scale-105 transition-all">
              <Plus className="w-4 h-4 inline-block mr-2" /> New Entry
            </button>
          </div>
        </header>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'users' && <div className="text-center py-40 bento-card">User Management Coming Soon</div>}
          {activeTab === 'analytics' && <div className="text-center py-40 bento-card">Analytics Dashboard Coming Soon</div>}
        </motion.div>
      </main>
    </div>
  );
};
