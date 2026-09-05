import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "Staff" | "Manager";
interface User { id: string; name: string; username: string; role: Role; status: "Active" | "Inactive"; created: string; }
interface Product { id: string; barcode: string; name: string; category: string; price: number; unit: string; stock: number; reorderLevel: number; supplier: string; description?: string; }
interface Supplier { id: string; name: string; contact: string; phone: string; email: string; status: "Active" | "Inactive"; products: string[]; }
interface StockTx { id: string; type: "IN" | "OUT" | "ADJ"; product: string; qty: number; date: string; user: string; ref?: string; reason?: string; }
interface AuditLog { id: string; datetime: string; user: string; activity: string; details: string; }
interface BackupFile { id: string; date: string; size: string; status: "Verified" | "Unverified"; }

// ─── Sample Data ─────────────────────────────────────────────────────────────
const INIT_USERS: User[] = [
  { id: "USR001", name: "Maria Santos", username: "manager01", role: "Manager", status: "Active", created: "2026-01-10" },
  { id: "USR002", name: "Juan Reyes", username: "staff01", role: "Staff", status: "Active", created: "2026-01-15" },
  { id: "USR003", name: "Ana Dela Cruz", username: "staff02", role: "Staff", status: "Active", created: "2026-02-01" },
  { id: "USR004", name: "Pedro Gomez", username: "staff03", role: "Staff", status: "Inactive", created: "2026-03-12" },
];
const INIT_PRODUCTS: Product[] = [
  { id: "PRD001", barcode: "8901234567890", name: "Bond Paper", category: "Paper", price: 250, unit: "Ream", stock: 8, reorderLevel: 10, supplier: "SUP001" },
  { id: "PRD002", barcode: "8901234567891", name: "Ballpen (Blue)", category: "Writing", price: 8, unit: "Piece", stock: 50, reorderLevel: 20, supplier: "SUP002" },
  { id: "PRD003", barcode: "8901234567892", name: "Folder (Long)", category: "Filing", price: 15, unit: "Piece", stock: 5, reorderLevel: 15, supplier: "SUP001" },
  { id: "PRD004", barcode: "8901234567893", name: "Notebook (80 leaves)", category: "Notebook", price: 45, unit: "Piece", stock: 48, reorderLevel: 25, supplier: "SUP003" },
  { id: "PRD005", barcode: "8901234567894", name: "Pencil (#2)", category: "Writing", price: 6, unit: "Piece", stock: 120, reorderLevel: 50, supplier: "SUP002" },
  { id: "PRD006", barcode: "8901234567895", name: "Scotch Tape", category: "Adhesives", price: 22, unit: "Roll", stock: 0, reorderLevel: 10, supplier: "SUP003" },
  { id: "PRD007", barcode: "8901234567896", name: "Whiteboard Marker", category: "Markers", price: 35, unit: "Piece", stock: 18, reorderLevel: 20, supplier: "SUP001" },
];
const INIT_SUPPLIERS: Supplier[] = [
  { id: "SUP001", name: "ABC School Supplies", contact: "Rodrigo Bautista", phone: "09171234567", email: "abc@schoolsupply.ph", status: "Active", products: ["PRD001", "PRD003", "PRD007"] },
  { id: "SUP002", name: "XYZ Stationery Hub", contact: "Liza Fernandez", phone: "09281234567", email: "xyz@stationery.ph", status: "Active", products: ["PRD002", "PRD005"] },
  { id: "SUP003", name: "Metro Office Depot", contact: "Carlo Ramos", phone: "09091234567", email: "metro@officedepot.ph", status: "Active", products: ["PRD004", "PRD006"] },
  { id: "SUP004", name: "National Book Store Supply", contact: "Alma Cruz", phone: "09351234567", email: "nbs@supply.ph", status: "Inactive", products: [] },
];
const INIT_TRANSACTIONS: StockTx[] = [
  { id: "TXN001", type: "IN", product: "PRD001", qty: 50, date: "2026-09-01 08:15", user: "staff01", ref: "DR-20260901-001" },
  { id: "TXN002", type: "OUT", product: "PRD002", qty: 10, date: "2026-09-02 09:30", user: "staff01" },
  { id: "TXN003", type: "IN", product: "PRD004", qty: 100, date: "2026-09-03 10:00", user: "staff02", ref: "DR-20260903-002" },
  { id: "TXN004", type: "OUT", product: "PRD001", qty: 5, date: "2026-09-04 14:20", user: "staff01" },
  { id: "TXN005", type: "ADJ", product: "PRD003", qty: -3, date: "2026-09-05 08:45", user: "manager01", reason: "Damaged" },
  { id: "TXN006", type: "OUT", product: "PRD004", qty: 5, date: "2026-09-05 10:30", user: "staff02" },
];
const INIT_LOGS: AuditLog[] = [
  { id: "LOG001", datetime: "2026-09-05 12:15", user: "staff01", activity: "Stock-Out", details: "Notebook × 5 (TXN006)" },
  { id: "LOG002", datetime: "2026-09-05 11:02", user: "manager01", activity: "Product Update", details: "Bond Paper — price updated" },
  { id: "LOG003", datetime: "2026-09-05 10:30", user: "staff02", activity: "Stock-Out", details: "Notebook × 5 (TXN006)" },
  { id: "LOG004", datetime: "2026-09-05 08:45", user: "manager01", activity: "Stock Adjustment", details: "Folder (-3) — Damaged" },
  { id: "LOG005", datetime: "2026-09-04 14:20", user: "staff01", activity: "Stock-Out", details: "Bond Paper × 5 (TXN004)" },
  { id: "LOG006", datetime: "2026-09-03 10:00", user: "staff02", activity: "Stock-In", details: "Notebook × 100 (DR-20260903-002)" },
  { id: "LOG007", datetime: "2026-09-02 09:30", user: "staff01", activity: "Stock-Out", details: "Ballpen × 10 (TXN002)" },
  { id: "LOG008", datetime: "2026-09-01 08:15", user: "staff01", activity: "Stock-In", details: "Bond Paper × 50 (DR-20260901-001)" },
  { id: "LOG009", datetime: "2026-08-31 16:00", user: "manager01", activity: "User Created", details: "staff03 account created" },
  { id: "LOG010", datetime: "2026-08-30 11:30", user: "manager01", activity: "Supplier Registered", details: "Metro Office Depot (SUP003)" },
];
const INIT_BACKUPS: BackupFile[] = [
  { id: "BKP001", date: "2026-09-05 00:00", size: "4.2 MB", status: "Verified" },
  { id: "BKP002", date: "2026-09-04 00:00", size: "4.1 MB", status: "Verified" },
  { id: "BKP003", date: "2026-09-03 00:00", size: "4.0 MB", status: "Unverified" },
];

// ─── Utility Components ───────────────────────────────────────────────────────
const Badge = ({ label, color }: { label: string; color: "green" | "red" | "yellow" | "gray" | "blue" }) => {
  const cls = { green: "bg-emerald-100 text-emerald-700", red: "bg-red-100 text-red-700", yellow: "bg-amber-100 text-amber-700", gray: "bg-slate-100 text-slate-600", blue: "bg-blue-100 text-blue-700" }[color];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-work ${cls}`}>{label}</span>;
};
const StatusBadge = ({ status }: { status: "Active" | "Inactive" }) => <Badge label={status} color={status === "Active" ? "green" : "gray"} />;
const StockBadge = ({ stock, reorder }: { stock: number; reorder: number }) => {
  if (stock === 0) return <Badge label="Out of Stock" color="red" />;
  if (stock <= reorder) return <Badge label="Low Stock" color="yellow" />;
  return <Badge label="Normal" color="green" />;
};
const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-work ${className}`}>{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>
);
const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-600 font-work uppercase tracking-wide">{label}</label>
    <input {...props} className={`border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${props.className || ""}`} />
  </div>
);
const Select = ({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-600 font-work uppercase tracking-wide">{label}</label>
    <select {...props} className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
      {children}
    </select>
  </div>
);
const Textarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-600 font-work uppercase tracking-wide">{label}</label>
    <textarea {...props} className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none" />
  </div>
);
const Btn = ({ children, variant = "primary", size = "md", onClick, type = "button", disabled = false, className = "" }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md"; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; className?: string;
}) => {
  const base = "inline-flex items-center gap-2 font-semibold font-work rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const v = { primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500", secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400 border border-slate-300", danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500", ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400" }[variant];
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sz} ${v} ${className}`}>{children}</button>;
};
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>{children}</div>
);
const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold text-slate-900 font-work">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);
const Alert = ({ type, message, onClose }: { type: "success" | "error" | "warning"; message: string; onClose?: () => void }) => {
  const c = { success: "bg-emerald-50 border-emerald-300 text-emerald-800", error: "bg-red-50 border-red-300 text-red-800", warning: "bg-amber-50 border-amber-300 text-amber-800" }[type];
  const icon = { success: "✓", error: "✕", warning: "⚠" }[type];
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border rounded-md text-sm font-work ${c}`}>
      <span className="font-bold">{icon}</span>
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100">✕</button>}
    </div>
  );
};
const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h3 className="text-base font-bold text-slate-900 font-work">{title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">&times;</button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  </div>
);
const TabBar = ({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) => (
  <div className="flex gap-1 border-b border-slate-200 mb-6">
    {tabs.map(t => (
      <button key={t} onClick={() => onChange(t)}
        className={`px-4 py-2.5 text-sm font-semibold font-work border-b-2 transition -mb-px ${active === t ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
        {t}
      </button>
    ))}
  </div>
);
const EmptyTable = ({ message = "No records found." }: { message?: string }) => (
  <tr><td colSpan={20} className="px-4 py-10 text-center text-sm text-slate-400 font-work">{message}</td></tr>
);

// ─── Login Screen ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const accounts = [
    { username: "manager01", password: "manager123", user: INIT_USERS[0] },
    { username: "staff01", password: "staff123", user: INIT_USERS[1] },
    { username: "staff02", password: "staff123", user: INIT_USERS[2] },
  ];
  const handleLogin = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      const match = accounts.find(a => a.username === username && a.password === password);
      if (match) { onLogin(match.user); }
      else { setError("Invalid username or password. Please try again."); }
      setLoading(false);
    }, 600);
  };
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="bg-blue-600 rounded-t-xl px-8 py-8 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <h1 className="text-xl font-bold font-work">School Supply Inventory</h1>
          <p className="text-blue-200 text-sm mt-1">Internal Management System</p>
        </div>
        <Card className="rounded-t-none rounded-b-xl px-8 py-8">
          <div className="flex flex-col gap-5">
            {error && <Alert type="error" message={error} onClose={() => setError("")} />}
            <Input label="Username" type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 font-work uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder="Enter your password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 pr-10 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-work">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <Btn onClick={handleLogin} disabled={loading || !username || !password} className="w-full justify-center">
              {loading ? "Signing in…" : "Login"}
            </Btn>
            <Btn variant="secondary" onClick={() => { setUsername(""); setPassword(""); setError(""); }} className="w-full justify-center">Clear</Btn>
            <p className="text-xs text-slate-400 text-center font-work">Demo: manager01 / manager123 · staff01 / staff123</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ products, transactions, logs, onNav }: {
  products: Product[]; transactions: StockTx[]; logs: AuditLog[];
  onNav: (section: string, sub?: string) => void;
}) => {
  const low = products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel);
  const out = products.filter(p => p.stock === 0);
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const recent = transactions.slice(-5).reverse();
  const recentLogs = logs.slice(0, 5);
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Dashboard" subtitle="Overview of your inventory system" />
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length, icon: "📦", color: "bg-blue-50 border-blue-200 text-blue-700", accent: "text-blue-600" },
          { label: "Total Stock Items", value: totalStock.toLocaleString(), icon: "🗃️", color: "bg-slate-50 border-slate-200 text-slate-700", accent: "text-slate-600" },
          { label: "Low Stock Items", value: low.length, icon: "⚠️", color: "bg-amber-50 border-amber-200 text-amber-700", accent: "text-amber-600" },
          { label: "Out of Stock", value: out.length, icon: "🔴", color: "bg-red-50 border-red-200 text-red-700", accent: "text-red-600" },
        ].map(c => (
          <div key={c.label} className={`border rounded-lg p-5 ${c.color}`}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className={`text-3xl font-bold font-work ${c.accent}`}>{c.value}</div>
            <div className="text-sm font-work mt-1 opacity-80">{c.label}</div>
          </div>
        ))}
      </div>
      {/* Alert bar */}
      {(low.length > 0 || out.length > 0) && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-red-100 transition"
          onClick={() => onNav("inventory", "Low-Stock Alerts")}>
          <span className="text-red-500 font-bold text-base">🔴</span>
          <span className="text-sm font-work text-red-700 font-semibold">{low.length + out.length} product{(low.length + out.length) !== 1 ? "s" : ""} need attention (low stock or out of stock)</span>
          <span className="ml-auto text-xs text-red-500 font-work">View Alerts →</span>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Inventory Status */}
        <Card className="xl:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 font-work text-sm">Inventory Status</h3>
            <Btn variant="ghost" size="sm" onClick={() => onNav("inventory", "Inventory Monitoring")}>View All</Btn>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr><Th>Product</Th><Th>Stock</Th><Th>Reorder Level</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <Td><div className="font-medium text-slate-800">{p.name}</div><div className="text-xs text-slate-400 font-mono-data">{p.id}</div></Td>
                    <Td><span className="font-semibold font-work">{p.stock}</span> <span className="text-slate-400 text-xs">{p.unit}</span></Td>
                    <Td className="text-slate-500">{p.reorderLevel}</Td>
                    <Td><StockBadge stock={p.stock} reorder={p.reorderLevel} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Recent Activity */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 font-work text-sm">Recent Activity</h3>
            </div>
            <div className="px-5 py-3 flex flex-col gap-3">
              {recentLogs.map(l => (
                <div key={l.id} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-700 font-work"><span className="font-semibold">{l.user}</span> — {l.activity}</p>
                    <p className="text-xs text-slate-400">{l.datetime}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {/* Quick Actions */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 font-work text-sm">Quick Actions</h3>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-2">
              {[
                { label: "Stock-In", nav: "stock", sub: "Stock-In" },
                { label: "Stock-Out", nav: "stock", sub: "Stock-Out" },
                { label: "View Inventory", nav: "inventory", sub: "Inventory Monitoring" },
                { label: "Generate Report", nav: "reports", sub: "" },
              ].map(a => (
                <button key={a.label} onClick={() => onNav(a.nav, a.sub)}
                  className="text-xs font-semibold font-work text-blue-600 border border-blue-200 rounded-md py-2 px-3 hover:bg-blue-50 transition text-center">
                  {a.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── User Management ──────────────────────────────────────────────────────────
const UserManagement = ({ users, setUsers, currentUser }: { users: User[]; setUsers: (u: User[]) => void; currentUser: User }) => {
  const [tab, setTab] = useState("User Accounts");
  const [modal, setModal] = useState<null | "add" | "edit" | "deactivate" | "view">(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", username: "", role: "Staff" as Role, password: "" });
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [search, setSearch] = useState("");
  const isManager = currentUser.role === "Manager";
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));
  const showAlert = (type: "success" | "error", msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3500); };
  const openAdd = () => { setForm({ name: "", username: "", role: "Staff", password: "" }); setModal("add"); };
  const openEdit = (u: User) => { setSelected(u); setForm({ name: u.name, username: u.username, role: u.role, password: "" }); setModal("edit"); };
  const saveAdd = () => {
    if (!form.name || !form.username) return;
    const nu: User = { id: `USR${String(users.length + 1).padStart(3, "0")}`, name: form.name, username: form.username, role: form.role, status: "Active", created: new Date().toISOString().split("T")[0] };
    setUsers([...users, nu]); setModal(null); showAlert("success", `User "${form.name}" created successfully.`);
  };
  const saveEdit = () => {
    if (!selected) return;
    setUsers(users.map(u => u.id === selected.id ? { ...u, name: form.name, username: form.username, role: form.role } : u));
    setModal(null); showAlert("success", "User account updated.");
  };
  const deactivate = () => {
    if (!selected) return;
    setUsers(users.map(u => u.id === selected.id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
    setModal(null); showAlert("success", `User status updated.`);
  };
  const perms: { fn: string; staff: boolean; manager: boolean }[] = [
    { fn: "Product Management", staff: true, manager: true },
    { fn: "Supplier Management", staff: true, manager: true },
    { fn: "Stock Management", staff: true, manager: true },
    { fn: "Inventory Monitoring", staff: true, manager: true },
    { fn: "User Management", staff: false, manager: true },
    { fn: "Reports (Full)", staff: false, manager: true },
    { fn: "Reports (Limited)", staff: true, manager: false },
    { fn: "Activity & Audit Logs", staff: false, manager: true },
    { fn: "Backup & Restore", staff: false, manager: true },
    { fn: "My Account / Profile", staff: true, manager: true },
  ];
  return (
    <div>
      <SectionHeader title="Account & User Management" subtitle="Manage user accounts, roles, and permissions" />
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} /></div>}
      <TabBar tabs={isManager ? ["User Accounts", "Roles & Permissions"] : ["My Account"]} active={tab} onChange={setTab} />
      {tab === "User Accounts" && isManager && (
        <div>
          <div className="flex gap-3 mb-4">
            <input className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by name or username…" value={search} onChange={e => setSearch(e.target.value)} />
            <Btn onClick={openAdd}>+ Add User</Btn>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>User ID</Th><Th>Name</Th><Th>Username</Th><Th>Role</Th><Th>Status</Th><Th>Created</Th><Th>Actions</Th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? <EmptyTable /> : filtered.map(u => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <Td><span className="font-mono-data text-xs text-slate-500">{u.id}</span></Td>
                      <Td><span className="font-medium text-slate-800">{u.name}</span></Td>
                      <Td><span className="font-mono-data text-xs">{u.username}</span></Td>
                      <Td><Badge label={u.role} color={u.role === "Manager" ? "blue" : "gray"} /></Td>
                      <Td><StatusBadge status={u.status} /></Td>
                      <Td className="text-slate-400 text-xs">{u.created}</Td>
                      <Td>
                        <div className="flex gap-2">
                          <Btn variant="ghost" size="sm" onClick={() => { setSelected(u); setModal("view"); }}>View</Btn>
                          <Btn variant="secondary" size="sm" onClick={() => openEdit(u)}>Edit</Btn>
                          <Btn variant={u.status === "Active" ? "danger" : "secondary"} size="sm" onClick={() => { setSelected(u); setModal("deactivate"); }}>{u.status === "Active" ? "Deactivate" : "Activate"}</Btn>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      {tab === "Roles & Permissions" && (
        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500 mb-4 font-work">Role-based access control for system functions. Permissions are fixed by role.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><Th>System Function</Th><Th>Staff</Th><Th>Inventory Manager</Th></tr>
                </thead>
                <tbody>
                  {perms.map(p => (
                    <tr key={p.fn} className="border-b border-slate-100">
                      <Td className="font-medium">{p.fn}</Td>
                      <Td>{p.staff ? <span className="text-emerald-600 font-bold text-base">✓</span> : <span className="text-slate-300 text-base">—</span>}</Td>
                      <Td>{p.manager ? <span className="text-emerald-600 font-bold text-base">✓</span> : <span className="text-slate-300 text-base">—</span>}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
      {/* My Account always accessible */}
      {(tab === "My Account" || !isManager) && (
        <MyAccount currentUser={currentUser} />
      )}
      {/* Modals */}
      {modal === "add" && (
        <Modal title="Add New User" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Juan Dela Cruz" />
            <Input label="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="e.g. staff04" />
            <Input label="Temporary Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Set initial password" />
            <Select label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
              <option>Staff</option><option>Manager</option>
            </Select>
            <div className="flex gap-3 pt-2">
              <Btn onClick={saveAdd} disabled={!form.name || !form.username}>Register User</Btn>
              <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}
      {modal === "edit" && selected && (
        <Modal title="Edit User Account" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            <Select label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
              <option>Staff</option><option>Manager</option>
            </Select>
            <div className="flex gap-3 pt-2"><Btn onClick={saveEdit}>Save Changes</Btn><Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
      {modal === "deactivate" && selected && (
        <Modal title={`${selected.status === "Active" ? "Deactivate" : "Activate"} User`} onClose={() => setModal(null)}>
          <p className="text-sm text-slate-600 mb-6 font-work">Are you sure you want to <strong>{selected.status === "Active" ? "deactivate" : "activate"}</strong> <strong>{selected.name}</strong>?{selected.status === "Active" && " They will no longer be able to log in."}</p>
          <div className="flex gap-3">
            <Btn variant={selected.status === "Active" ? "danger" : "primary"} onClick={deactivate}>{selected.status === "Active" ? "Deactivate" : "Activate"}</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      {modal === "view" && selected && (
        <Modal title="User Details" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-3 text-sm">
            {[["User ID", selected.id], ["Full Name", selected.name], ["Username", selected.username], ["Role", selected.role], ["Status", selected.status], ["Date Created", selected.created]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-work text-xs uppercase tracking-wide">{k}</span>
                <span className="font-medium text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

const MyAccount = ({ currentUser }: { currentUser: User }) => {
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwAlert, setPwAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const changePassword = () => {
    if (!pwForm.current) { setPwAlert({ type: "error", msg: "Please enter your current password." }); return; }
    if (pwForm.next.length < 8) { setPwAlert({ type: "error", msg: "New password must be at least 8 characters." }); return; }
    if (pwForm.next !== pwForm.confirm) { setPwAlert({ type: "error", msg: "New passwords do not match." }); return; }
    setPwAlert({ type: "success", msg: "Password updated successfully." });
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwAlert(null), 3000);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-5">
        <h3 className="font-bold text-slate-800 font-work mb-4">My Profile</h3>
        <div className="flex flex-col gap-3 text-sm">
          {[["User ID", currentUser.id], ["Full Name", currentUser.name], ["Username", currentUser.username], ["Role", currentUser.role], ["Status", currentUser.status]].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-work text-xs uppercase tracking-wide">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-bold text-slate-800 font-work mb-4">Change Password</h3>
        <div className="flex flex-col gap-4">
          {pwAlert && <Alert type={pwAlert.type} message={pwAlert.msg} />}
          <Input label="Current Password" type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
          <Input label="New Password" type="password" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
          <Input label="Confirm New Password" type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
          <Btn onClick={changePassword}>Change Password</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── Product Management ───────────────────────────────────────────────────────
const ProductManagement = ({ products, setProducts, suppliers }: { products: Product[]; setProducts: (p: Product[]) => void; suppliers: Supplier[]; }) => {
  const [tab, setTab] = useState("Search / View");
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const showAlert = (type: "success" | "error", msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3500); };
  const cats = ["Paper", "Writing", "Filing", "Notebook", "Adhesives", "Markers", "Art Supplies", "Other"];
  const units = ["Piece", "Ream", "Pack", "Box", "Set", "Roll", "Dozen", "Bundle"];
  const [regForm, setRegForm] = useState({ barcode: "", name: "", category: cats[0], price: "", unit: units[0], reorderLevel: "", supplier: suppliers[0]?.id || "", description: "" });
  const [search, setSearch] = useState(""); const [searchBy, setSearchBy] = useState("name");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const registerProduct = () => {
    if (!regForm.name || !regForm.barcode) { showAlert("error", "Product Name and Barcode are required."); return; }
    const np: Product = { id: `PRD${String(products.length + 1).padStart(3, "0")}`, barcode: regForm.barcode, name: regForm.name, category: regForm.category, price: parseFloat(regForm.price) || 0, unit: regForm.unit, stock: 0, reorderLevel: parseInt(regForm.reorderLevel) || 10, supplier: regForm.supplier, description: regForm.description };
    setProducts([...products, np]);
    setRegForm({ barcode: "", name: "", category: cats[0], price: "", unit: units[0], reorderLevel: "", supplier: suppliers[0]?.id || "", description: "" });
    showAlert("success", `Product "${regForm.name}" registered successfully.`);
  };
  const saveEdit = () => {
    if (!editProduct) return;
    setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...editForm } : p));
    setEditProduct(null); showAlert("success", "Product information updated.");
  };
  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    if (searchBy === "name") return p.name.toLowerCase().includes(q);
    if (searchBy === "code") return p.id.toLowerCase().includes(q);
    return p.barcode.includes(q);
  });
  const supplierName = (id: string) => suppliers.find(s => s.id === id)?.name || id;
  return (
    <div>
      <SectionHeader title="Product Management" subtitle="Register, update, and search school supply products" />
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} /></div>}
      <TabBar tabs={["Search / View", "Register Product", "Update Product", "Price & Category"]} active={tab} onChange={setTab} />
      {tab === "Search / View" && (
        <div>
          <div className="flex gap-3 mb-4">
            <select className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={searchBy} onChange={e => setSearchBy(e.target.value)}>
              <option value="name">Product Name</option><option value="code">Product Code</option><option value="barcode">Barcode</option>
            </select>
            <input className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Code</Th><Th>Barcode</Th><Th>Product Name</Th><Th>Category</Th><Th>Price</Th><Th>Stock</Th><Th>Status</Th><Th>{" "}</Th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? <EmptyTable /> : filtered.map(p => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <Td><span className="font-mono-data text-xs text-slate-500">{p.id}</span></Td>
                      <Td><span className="font-mono-data text-xs text-slate-500">{p.barcode}</span></Td>
                      <Td><span className="font-medium text-slate-800">{p.name}</span></Td>
                      <Td><Badge label={p.category} color="gray" /></Td>
                      <Td className="font-work font-semibold">₱{p.price.toLocaleString()}/{p.unit}</Td>
                      <Td className="font-work">{p.stock} {p.unit}</Td>
                      <Td><StockBadge stock={p.stock} reorder={p.reorderLevel} /></Td>
                      <Td><Btn variant="ghost" size="sm" onClick={() => setViewProduct(p)}>Details</Btn></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {viewProduct && (
            <Modal title="Product Details" onClose={() => setViewProduct(null)}>
              <div className="flex flex-col gap-3 text-sm">
                {[["Product ID", viewProduct.id], ["Barcode", viewProduct.barcode], ["Product Name", viewProduct.name], ["Category", viewProduct.category], ["Unit Price", `₱${viewProduct.price.toLocaleString()} / ${viewProduct.unit}`], ["Current Stock", `${viewProduct.stock} ${viewProduct.unit}`], ["Reorder Level", String(viewProduct.reorderLevel)], ["Supplier", supplierName(viewProduct.supplier)], ["Description", viewProduct.description || "—"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-work text-xs uppercase tracking-wide">{k}</span>
                    <span className="font-medium text-right text-slate-800 max-w-xs">{v}</span>
                  </div>
                ))}
              </div>
            </Modal>
          )}
        </div>
      )}
      {tab === "Register Product" && (
        <Card className="p-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Barcode / Item Code" value={regForm.barcode} onChange={e => setRegForm(f => ({ ...f, barcode: e.target.value }))} placeholder="e.g. 8901234567897" />
            <Input label="Product Name" value={regForm.name} onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Correction Tape" />
            <Select label="Category" value={regForm.category} onChange={e => setRegForm(f => ({ ...f, category: e.target.value }))}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Select label="Unit" value={regForm.unit} onChange={e => setRegForm(f => ({ ...f, unit: e.target.value }))}>
              {units.map(u => <option key={u}>{u}</option>)}
            </Select>
            <Input label="Unit Price (₱)" type="number" value={regForm.price} onChange={e => setRegForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
            <Input label="Reorder Level" type="number" value={regForm.reorderLevel} onChange={e => setRegForm(f => ({ ...f, reorderLevel: e.target.value }))} placeholder="e.g. 10" />
            <Select label="Supplier" value={regForm.supplier} onChange={e => setRegForm(f => ({ ...f, supplier: e.target.value }))}>
              {suppliers.filter(s => s.status === "Active").map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <div className="sm:col-span-2">
              <Textarea label="Description (Optional)" value={regForm.description} onChange={e => setRegForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Brief product description…" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Btn onClick={registerProduct}>Register Product</Btn>
            <Btn variant="secondary" onClick={() => setRegForm({ barcode: "", name: "", category: cats[0], price: "", unit: units[0], reorderLevel: "", supplier: suppliers[0]?.id || "", description: "" })}>Clear</Btn>
          </div>
        </Card>
      )}
      {tab === "Update Product" && (
        <div>
          <Card className="p-5 mb-4 max-w-xl">
            <p className="text-sm text-slate-500 font-work mb-3">Select a product to update its information.</p>
            <Select label="Select Product" value={editProduct?.id || ""} onChange={e => { const p = products.find(x => x.id === e.target.value); setEditProduct(p || null); setEditForm(p ? { ...p } : {}); }}>
              <option value="">— Choose product —</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </Select>
          </Card>
          {editProduct && (
            <Card className="p-6 max-w-2xl">
              <h3 className="font-bold text-slate-700 font-work mb-4">Editing: {editProduct.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Barcode" value={String(editForm.barcode || "")} onChange={e => setEditForm(f => ({ ...f, barcode: e.target.value }))} />
                <Input label="Product Name" value={String(editForm.name || "")} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                <Select label="Category" value={String(editForm.category || "")} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                  {cats.map(c => <option key={c}>{c}</option>)}
                </Select>
                <Select label="Unit" value={String(editForm.unit || "")} onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}>
                  {units.map(u => <option key={u}>{u}</option>)}
                </Select>
                <Select label="Supplier" value={String(editForm.supplier || "")} onChange={e => setEditForm(f => ({ ...f, supplier: e.target.value }))}>
                  {suppliers.filter(s => s.status === "Active").map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                <Input label="Reorder Level" type="number" value={String(editForm.reorderLevel || "")} onChange={e => setEditForm(f => ({ ...f, reorderLevel: parseInt(e.target.value) }))} />
                <div className="sm:col-span-2">
                  <Textarea label="Description" value={String(editForm.description || "")} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                </div>
              </div>
              <div className="flex gap-3 mt-5"><Btn onClick={saveEdit}>Save Changes</Btn><Btn variant="secondary" onClick={() => setEditProduct(null)}>Cancel</Btn></div>
            </Card>
          )}
        </div>
      )}
      {tab === "Price & Category" && (
        <div>
          <Card className="p-5 mb-4 max-w-xl">
            <Select label="Select Product" value={editProduct?.id || ""} onChange={e => { const p = products.find(x => x.id === e.target.value); setEditProduct(p || null); setEditForm(p ? { ...p } : {}); }}>
              <option value="">— Choose product —</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </Select>
          </Card>
          {editProduct && (
            <Card className="p-6 max-w-sm">
              <h3 className="font-bold text-slate-700 font-work mb-4">{editProduct.name}</h3>
              <div className="flex flex-col gap-4">
                <Input label="Unit Price (₱)" type="number" value={String(editForm.price || "")} onChange={e => setEditForm(f => ({ ...f, price: parseFloat(e.target.value) }))} />
                <Select label="Category" value={String(editForm.category || "")} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                  {cats.map(c => <option key={c}>{c}</option>)}
                </Select>
                <div className="flex gap-3">
                  <Btn onClick={saveEdit}>Save Changes</Btn>
                  <Btn variant="secondary" onClick={() => setEditForm({ ...editProduct })}>Reset</Btn>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Supplier Management ──────────────────────────────────────────────────────
const SupplierManagement = ({ suppliers, setSuppliers, products }: { suppliers: Supplier[]; setSuppliers: (s: Supplier[]) => void; products: Product[]; }) => {
  const [tab, setTab] = useState("Suppliers");
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const showAlert = (type: "success" | "error", msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3500); };
  const [modal, setModal] = useState<null | "add" | "edit" | "deactivate" | "link">(null);
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", phone: "", email: "" });
  const [linkProduct, setLinkProduct] = useState("");
  const saveAdd = () => {
    if (!form.name) return;
    setSuppliers([...suppliers, { id: `SUP${String(suppliers.length + 1).padStart(3, "0")}`, name: form.name, contact: form.contact, phone: form.phone, email: form.email, status: "Active", products: [] }]);
    setModal(null); showAlert("success", `Supplier "${form.name}" registered.`);
  };
  const saveEdit = () => {
    if (!selected) return;
    setSuppliers(suppliers.map(s => s.id === selected.id ? { ...s, ...form } : s));
    setModal(null); showAlert("success", "Supplier updated.");
  };
  const deactivate = () => {
    if (!selected) return;
    setSuppliers(suppliers.map(s => s.id === selected.id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
    setModal(null); showAlert("success", "Supplier status updated.");
  };
  const linkSupplierProduct = () => {
    if (!selected || !linkProduct) return;
    setSuppliers(suppliers.map(s => s.id === selected.id ? { ...s, products: s.products.includes(linkProduct) ? s.products : [...s.products, linkProduct] } : s));
    showAlert("success", `Product linked to ${selected.name}.`); setLinkProduct("");
  };
  const productName = (id: string) => products.find(p => p.id === id)?.name || id;
  return (
    <div>
      <SectionHeader title="Supplier Management" subtitle="Manage supplier records and product links" />
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} /></div>}
      <TabBar tabs={["Suppliers", "Register Supplier", "Link Supplier to Product"]} active={tab} onChange={setTab} />
      {tab === "Suppliers" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Supplier ID</Th><Th>Name</Th><Th>Contact Person</Th><Th>Phone</Th><Th>Email</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <Td><span className="font-mono-data text-xs text-slate-500">{s.id}</span></Td>
                    <Td><span className="font-medium text-slate-800">{s.name}</span></Td>
                    <Td>{s.contact}</Td>
                    <Td><span className="font-mono-data text-xs">{s.phone}</span></Td>
                    <Td className="text-slate-500 text-xs">{s.email}</Td>
                    <Td><StatusBadge status={s.status} /></Td>
                    <Td>
                      <div className="flex gap-2">
                        <Btn variant="secondary" size="sm" onClick={() => { setSelected(s); setForm({ name: s.name, contact: s.contact, phone: s.phone, email: s.email }); setModal("edit"); }}>Edit</Btn>
                        <Btn variant={s.status === "Active" ? "danger" : "secondary"} size="sm" onClick={() => { setSelected(s); setModal("deactivate"); }}>{s.status === "Active" ? "Deactivate" : "Activate"}</Btn>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {tab === "Register Supplier" && (
        <Card className="p-6 max-w-xl">
          <div className="flex flex-col gap-4">
            <Input label="Supplier Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Best Office Supply Co." />
            <Input label="Contact Person" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="e.g. Maria Reyes" />
            <Input label="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. 09171234567" />
            <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. contact@supplier.ph" />
            <div className="flex gap-3 pt-1">
              <Btn onClick={saveAdd} disabled={!form.name}>Register Supplier</Btn>
              <Btn variant="secondary" onClick={() => setForm({ name: "", contact: "", phone: "", email: "" })}>Clear</Btn>
            </div>
          </div>
        </Card>
      )}
      {tab === "Link Supplier to Product" && (
        <div className="flex flex-col gap-4">
          <Card className="p-5 max-w-xl">
            <div className="flex flex-col gap-4">
              <Select label="Select Supplier" value={selected?.id || ""} onChange={e => setSelected(suppliers.find(s => s.id === e.target.value) || null)}>
                <option value="">— Select supplier —</option>
                {suppliers.filter(s => s.status === "Active").map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
              <Select label="Select Product" value={linkProduct} onChange={e => setLinkProduct(e.target.value)}>
                <option value="">— Select product —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
              </Select>
              <Btn onClick={linkSupplierProduct} disabled={!selected || !linkProduct}>Link Supplier</Btn>
            </div>
          </Card>
          {selected && (
            <Card className="p-5 max-w-xl">
              <h4 className="font-bold text-slate-700 font-work text-sm mb-3">Products linked to {selected.name}</h4>
              {selected.products.length === 0 ? (
                <p className="text-sm text-slate-400 font-work">No products linked yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selected.products.map(pid => <Badge key={pid} label={productName(pid)} color="blue" />)}
                </div>
              )}
            </Card>
          )}
        </div>
      )}
      {modal === "edit" && selected && (
        <Modal title="Edit Supplier" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Supplier Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Contact Person" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
            <Input label="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <div className="flex gap-3"><Btn onClick={saveEdit}>Save Changes</Btn><Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
      {modal === "deactivate" && selected && (
        <Modal title={`${selected.status === "Active" ? "Deactivate" : "Activate"} Supplier`} onClose={() => setModal(null)}>
          <p className="text-sm text-slate-600 font-work mb-6">Are you sure you want to <strong>{selected.status === "Active" ? "deactivate" : "activate"}</strong> <strong>{selected.name}</strong>? Historical records will be preserved.</p>
          <div className="flex gap-3">
            <Btn variant={selected.status === "Active" ? "danger" : "primary"} onClick={deactivate}>{selected.status === "Active" ? "Deactivate" : "Activate"} Supplier</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Stock Management ─────────────────────────────────────────────────────────
const StockManagement = ({ products, setProducts, transactions, setTransactions, currentUser, suppliers }: {
  products: Product[]; setProducts: (p: Product[]) => void;
  transactions: StockTx[]; setTransactions: (t: StockTx[]) => void;
  currentUser: User; suppliers: Supplier[];
}) => {
  const [tab, setTab] = useState("Stock-In");
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const showAlert = (type: "success" | "error", msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };
  const nextTxId = () => `TXN${String(transactions.length + 1).padStart(3, "0")}`;
  // Stock-In
  const [inForm, setInForm] = useState({ product: "", qty: "", supplier: "", date: new Date().toISOString().split("T")[0], ref: "" });
  const [inItems, setInItems] = useState<{ product: string; qty: number; supplier: string; ref: string }[]>([]);
  const addInItem = () => {
    if (!inForm.product || !inForm.qty) return;
    setInItems(it => [...it, { product: inForm.product, qty: parseInt(inForm.qty), supplier: inForm.supplier, ref: inForm.ref }]);
    setInForm(f => ({ ...f, product: "", qty: "", ref: "" }));
  };
  const confirmStockIn = () => {
    if (inItems.length === 0) return;
    const newTxs = inItems.map(item => ({ id: nextTxId(), type: "IN" as const, product: item.product, qty: item.qty, date: inForm.date + " " + new Date().toTimeString().slice(0, 5), user: currentUser.username, ref: item.ref }));
    setTransactions([...transactions, ...newTxs]);
    setProducts(products.map(p => { const it = inItems.find(i => i.product === p.id); return it ? { ...p, stock: p.stock + it.qty } : p; }));
    setInItems([]); showAlert("success", `Stock-In confirmed. ${inItems.length} item(s) recorded.`);
  };
  // Stock-Out
  const [outCode, setOutCode] = useState(""); const [outProduct, setOutProduct] = useState<Product | null>(null);
  const [outQty, setOutQty] = useState(""); const [outItems, setOutItems] = useState<{ product: Product; qty: number }[]>([]);
  const lookupProduct = () => {
    const p = products.find(x => x.id === outCode || x.barcode === outCode);
    if (!p) { showAlert("error", "Product not found. Check the code or barcode."); return; }
    setOutProduct(p); setOutCode("");
  };
  const addOutItem = () => {
    if (!outProduct || !outQty) return;
    const qty = parseInt(outQty);
    if (qty > outProduct.stock) { showAlert("error", `Insufficient stock. Available quantity: ${outProduct.stock} ${outProduct.unit}.`); return; }
    setOutItems(it => [...it, { product: outProduct, qty }]);
    setOutProduct(null); setOutQty("");
  };
  const confirmStockOut = () => {
    if (outItems.length === 0) return;
    const newTxs = outItems.map(item => ({ id: nextTxId(), type: "OUT" as const, product: item.product.id, qty: item.qty, date: new Date().toISOString().slice(0, 16).replace("T", " "), user: currentUser.username }));
    setTransactions([...transactions, ...newTxs]);
    setProducts(products.map(p => { const it = outItems.find(i => i.product.id === p.id); return it ? { ...p, stock: p.stock - it.qty } : p; }));
    setOutItems([]); showAlert("success", `Stock-Out confirmed. ${outItems.length} item(s) recorded.`);
  };
  // Physical Count
  const [counts, setCounts] = useState<Record<string, string>>({});
  const variance = (p: Product) => { const c = parseInt(counts[p.id] || ""); return isNaN(c) ? null : c - p.stock; };
  const submitCount = () => {
    const hasCount = products.some(p => counts[p.id] !== undefined && counts[p.id] !== "");
    if (!hasCount) { showAlert("error", "Please enter at least one physical count value."); return; }
    showAlert("success", "Physical stock count submitted. Variances recorded for review.");
    setCounts({});
  };
  // Adjustment
  const reasons = ["Damaged", "Lost", "Missing", "Miscount Correction", "Expired", "Other"];
  const [adjForm, setAdjForm] = useState({ product: "", adjustedQty: "", reason: reasons[0], remarks: "" });
  const [adjModal, setAdjModal] = useState(false);
  const adjProduct = products.find(p => p.id === adjForm.product);
  const submitAdj = () => {
    if (!adjProduct) return;
    const diff = parseInt(adjForm.adjustedQty) - adjProduct.stock;
    setProducts(products.map(p => p.id === adjProduct.id ? { ...p, stock: parseInt(adjForm.adjustedQty) } : p));
    setTransactions([...transactions, { id: nextTxId(), type: "ADJ", product: adjProduct.id, qty: diff, date: new Date().toISOString().slice(0, 16).replace("T", " "), user: currentUser.username, reason: adjForm.reason }]);
    setAdjModal(false); setAdjForm({ product: "", adjustedQty: "", reason: reasons[0], remarks: "" });
    showAlert("success", "Stock adjustment applied.");
  };
  const productName = (id: string) => products.find(p => p.id === id)?.name || id;
  const supplierName = (id: string) => suppliers.find(s => s.id === id)?.name || id;
  return (
    <div>
      <SectionHeader title="Stock Management" subtitle="Record stock movements and physical counts" />
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} /></div>}
      <TabBar tabs={["Stock-In", "Stock-Out", "Physical Count", "Stock Adjustment"]} active={tab} onChange={setTab} />
      {tab === "Stock-In" && (
        <div className="flex flex-col gap-4">
          <Card className="p-5 max-w-2xl">
            <h3 className="font-bold text-slate-700 font-work text-sm mb-4">Add Item to Stock-In</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Product" value={inForm.product} onChange={e => setInForm(f => ({ ...f, product: e.target.value }))}>
                <option value="">— Select product —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
              </Select>
              <Input label="Quantity Received" type="number" value={inForm.qty} onChange={e => setInForm(f => ({ ...f, qty: e.target.value }))} placeholder="e.g. 50" />
              <Select label="Supplier" value={inForm.supplier} onChange={e => setInForm(f => ({ ...f, supplier: e.target.value }))}>
                <option value="">— Select supplier —</option>
                {suppliers.filter(s => s.status === "Active").map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
              <Input label="Delivery Date" type="date" value={inForm.date} onChange={e => setInForm(f => ({ ...f, date: e.target.value }))} />
              <div className="sm:col-span-2">
                <Input label="Reference / Delivery Number" value={inForm.ref} onChange={e => setInForm(f => ({ ...f, ref: e.target.value }))} placeholder="e.g. DR-20260905-001" />
              </div>
            </div>
            <Btn className="mt-4" variant="secondary" onClick={addInItem} disabled={!inForm.product || !inForm.qty}>+ Add Item</Btn>
          </Card>
          {inItems.length > 0 && (
            <Card>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-700 font-work text-sm">Items to Stock-In ({inItems.length})</h4>
                <Btn onClick={confirmStockIn}>Confirm Stock-In</Btn>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100"><tr><Th>Product</Th><Th>Quantity</Th><Th>Supplier</Th><Th>Reference</Th></tr></thead>
                  <tbody>
                    {inItems.map((it, i) => (
                      <tr key={i} className="border-b border-slate-50">
                        <Td className="font-medium">{productName(it.product)}</Td>
                        <Td className="font-work font-semibold">{it.qty}</Td>
                        <Td>{supplierName(it.supplier) || "—"}</Td>
                        <Td className="font-mono-data text-xs text-slate-500">{it.ref || "—"}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
      {tab === "Stock-Out" && (
        <div className="flex flex-col gap-4">
          <Card className="p-5 max-w-xl">
            <h3 className="font-bold text-slate-700 font-work text-sm mb-3">Scan Barcode / Enter Item Code</h3>
            <div className="flex gap-3">
              <input className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm font-mono-data focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Barcode or Product Code…" value={outCode} onChange={e => setOutCode(e.target.value)} onKeyDown={e => e.key === "Enter" && lookupProduct()} />
              <Btn onClick={lookupProduct} disabled={!outCode}>Lookup</Btn>
            </div>
            {outProduct && (
              <div className="mt-4 border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-slate-800 font-work">{outProduct.name}</p>
                    <p className="text-xs text-slate-500 font-mono-data">{outProduct.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-work">Current Stock</p>
                    <p className="text-2xl font-bold font-work text-slate-800">{outProduct.stock} <span className="text-sm font-normal text-slate-500">{outProduct.unit}</span></p>
                  </div>
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1"><Input label="Quantity to Remove" type="number" value={outQty} onChange={e => setOutQty(e.target.value)} /></div>
                  <Btn onClick={addOutItem} disabled={!outQty}>Add to Transaction</Btn>
                </div>
              </div>
            )}
          </Card>
          {outItems.length > 0 && (
            <Card>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-700 font-work text-sm">Stock-Out Transaction ({outItems.length} item{outItems.length !== 1 ? "s" : ""})</h4>
                <Btn onClick={confirmStockOut}>Confirm Stock-Out</Btn>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100"><tr><Th>Product</Th><Th>Current Stock</Th><Th>Qty to Remove</Th><Th>{" "}</Th></tr></thead>
                  <tbody>
                    {outItems.map((it, i) => (
                      <tr key={i} className="border-b border-slate-50">
                        <Td className="font-medium">{it.product.name}</Td>
                        <Td className="font-work">{it.product.stock} {it.product.unit}</Td>
                        <Td className="font-work font-semibold text-red-600">−{it.qty}</Td>
                        <Td><Btn variant="ghost" size="sm" onClick={() => setOutItems(outItems.filter((_, j) => j !== i))}>Remove</Btn></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
      {tab === "Physical Count" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-work">Enter actual physical quantities. The system calculates variance against recorded stock.</p>
            <Btn onClick={submitCount}>Submit Count</Btn>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Product</Th><Th>Recorded Qty</Th><Th>Physical Qty</Th><Th>Variance</Th></tr></thead>
                <tbody>
                  {products.map(p => {
                    const v = variance(p);
                    return (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <Td><span className="font-medium">{p.name}</span><span className="text-xs text-slate-400 font-mono-data ml-2">{p.id}</span></Td>
                        <Td className="font-work font-semibold">{p.stock} <span className="text-slate-400 text-xs">{p.unit}</span></Td>
                        <Td>
                          <input type="number" className="w-24 border border-slate-300 rounded px-2 py-1 text-sm font-work focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" value={counts[p.id] || ""} onChange={e => setCounts(c => ({ ...c, [p.id]: e.target.value }))} />
                        </Td>
                        <Td>
                          {v === null ? <span className="text-slate-300">—</span> :
                            <span className={`font-work font-bold text-sm ${v < 0 ? "text-red-600" : v > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                              {v > 0 ? "+" : ""}{v}
                            </span>}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      {tab === "Stock Adjustment" && (
        <Card className="p-5 max-w-lg">
          <div className="flex flex-col gap-4">
            <Alert type="warning" message="Stock adjustments directly alter recorded inventory. A reason is required and this action will be logged." />
            <Select label="Product" value={adjForm.product} onChange={e => setAdjForm(f => ({ ...f, product: e.target.value }))}>
              <option value="">— Select product —</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </Select>
            {adjProduct && (
              <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm">
                <span className="text-slate-500 font-work">Current Quantity:</span> <span className="font-bold font-work">{adjProduct.stock} {adjProduct.unit}</span>
              </div>
            )}
            <Input label="Adjusted Quantity" type="number" value={adjForm.adjustedQty} onChange={e => setAdjForm(f => ({ ...f, adjustedQty: e.target.value }))} placeholder="Enter corrected quantity" />
            <Select label="Reason" value={adjForm.reason} onChange={e => setAdjForm(f => ({ ...f, reason: e.target.value }))}>
              {reasons.map(r => <option key={r}>{r}</option>)}
            </Select>
            <Textarea label="Remarks" value={adjForm.remarks} onChange={e => setAdjForm(f => ({ ...f, remarks: e.target.value }))} rows={2} placeholder="Additional notes…" />
            <Btn onClick={() => setAdjModal(true)} disabled={!adjForm.product || !adjForm.adjustedQty}>Submit Adjustment</Btn>
          </div>
          {adjModal && adjProduct && (
            <Modal title="Confirm Stock Adjustment" onClose={() => setAdjModal(false)}>
              <div className="flex flex-col gap-4">
                <Alert type="warning" message={`This will change "${adjProduct.name}" from ${adjProduct.stock} to ${adjForm.adjustedQty} ${adjProduct.unit}. Reason: ${adjForm.reason}.`} />
                <div className="flex gap-3"><Btn variant="danger" onClick={submitAdj}>Confirm Adjustment</Btn><Btn variant="secondary" onClick={() => setAdjModal(false)}>Cancel</Btn></div>
              </div>
            </Modal>
          )}
        </Card>
      )}
    </div>
  );
};

// ─── Inventory Management ─────────────────────────────────────────────────────
const InventoryManagement = ({ products, setProducts, suppliers, initialTab }: { products: Product[]; setProducts: (p: Product[]) => void; suppliers: Supplier[]; initialTab?: string; }) => {
  const [tab, setTab] = useState(initialTab || "Inventory Monitoring");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const showAlert = (type: "success" | "error", msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3500); };
  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);
  const [reorderEdit, setReorderEdit] = useState<Record<string, string>>({});
  const [updateEdit, setUpdateEdit] = useState<Record<string, Partial<Product>>>({});
  const filtered = products.filter(p => {
    if (filter === "Low Stock" && !(p.stock > 0 && p.stock <= p.reorderLevel)) return false;
    if (filter === "Out of Stock" && p.stock !== 0) return false;
    if (filter === "Normal" && (p.stock <= p.reorderLevel)) return false;
    return p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
  });
  const low = products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel);
  const out = products.filter(p => p.stock === 0);
  const supplierName = (id: string) => suppliers.find(s => s.id === id)?.name || id;
  const saveReorder = (id: string) => {
    const val = parseInt(reorderEdit[id]);
    if (isNaN(val)) return;
    setProducts(products.map(p => p.id === id ? { ...p, reorderLevel: val } : p));
    setReorderEdit(r => { const n = { ...r }; delete n[id]; return n; });
    showAlert("success", "Reorder level updated.");
  };
  return (
    <div>
      <SectionHeader title="Inventory Management" subtitle="Monitor stock levels and manage reorder settings" />
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} /></div>}
      <TabBar tabs={["Inventory Monitoring", "Reorder Levels", "Low-Stock Alerts", "Inventory Updates"]} active={tab} onChange={setTab} />
      {tab === "Inventory Monitoring" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            {["All", "Normal", "Low Stock", "Out of Stock"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-semibold font-work rounded-full border transition ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}>{f}</button>
            ))}
            <input className="ml-auto border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" placeholder="Search product…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Product</Th><Th>Category</Th><Th>Current Stock</Th><Th>Reorder Level</Th><Th>Supplier</Th><Th>Status</Th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? <EmptyTable /> : filtered.map(p => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <Td><span className="font-medium">{p.name}</span><span className="text-xs text-slate-400 font-mono-data ml-2">{p.id}</span></Td>
                      <Td><Badge label={p.category} color="gray" /></Td>
                      <Td><span className={`font-bold font-work ${p.stock === 0 ? "text-red-600" : p.stock <= p.reorderLevel ? "text-amber-600" : "text-slate-800"}`}>{p.stock}</span> <span className="text-slate-400 text-xs">{p.unit}</span></Td>
                      <Td className="text-slate-500 font-work">{p.reorderLevel}</Td>
                      <Td className="text-slate-500 text-xs">{supplierName(p.supplier)}</Td>
                      <Td><StockBadge stock={p.stock} reorder={p.reorderLevel} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      {tab === "Reorder Levels" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Product</Th><Th>Current Stock</Th><Th>Reorder Level</Th><Th>Action</Th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <Td><span className="font-medium">{p.name}</span></Td>
                    <Td className="font-work font-semibold">{p.stock} {p.unit}</Td>
                    <Td>
                      <input type="number" className="w-24 border border-slate-300 rounded px-2 py-1 text-sm font-work focus:outline-none focus:ring-2 focus:ring-blue-500" value={reorderEdit[p.id] !== undefined ? reorderEdit[p.id] : p.reorderLevel} onChange={e => setReorderEdit(r => ({ ...r, [p.id]: e.target.value }))} />
                    </Td>
                    <Td><Btn variant="secondary" size="sm" onClick={() => saveReorder(p.id)} disabled={reorderEdit[p.id] === undefined || reorderEdit[p.id] === String(p.reorderLevel)}>Save</Btn></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {tab === "Low-Stock Alerts" && (
        <div className="flex flex-col gap-4">
          {low.length === 0 && out.length === 0 ? (
            <Alert type="success" message="All products are adequately stocked. No alerts at this time." />
          ) : (
            <>
              {out.length > 0 && (
                <div>
                  <h3 className="font-bold text-red-700 font-work text-sm mb-2 flex items-center gap-2"><span>🔴</span> Out of Stock ({out.length})</h3>
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-red-50 border-b border-red-100"><tr><Th>Product</Th><Th>Current Stock</Th><Th>Reorder Level</Th><Th>Supplier</Th></tr></thead>
                        <tbody>{out.map(p => (<tr key={p.id} className="border-b border-red-50"><Td className="font-medium text-red-800">{p.name}</Td><Td className="font-bold text-red-600 font-work">0 {p.unit}</Td><Td className="font-work text-slate-500">{p.reorderLevel}</Td><Td className="text-slate-500 text-xs">{supplierName(p.supplier)}</Td></tr>))}</tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
              {low.length > 0 && (
                <div>
                  <h3 className="font-bold text-amber-700 font-work text-sm mb-2 flex items-center gap-2"><span>⚠️</span> Low Stock ({low.length})</h3>
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-amber-50 border-b border-amber-100"><tr><Th>Product</Th><Th>Current Stock</Th><Th>Reorder Level</Th><Th>Supplier</Th></tr></thead>
                        <tbody>{low.map(p => (<tr key={p.id} className="border-b border-amber-50"><Td className="font-medium text-amber-800">{p.name}</Td><Td className="font-bold text-amber-700 font-work">{p.stock} {p.unit}</Td><Td className="font-work text-slate-500">{p.reorderLevel}</Td><Td className="text-slate-500 text-xs">{supplierName(p.supplier)}</Td></tr>))}</tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {tab === "Inventory Updates" && (
        <Card>
          <div className="px-5 py-4 border-b border-slate-100"><p className="text-sm text-slate-500 font-work">Administrative inventory data corrections. Changes are logged.</p></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Product</Th><Th>Current Stock</Th><Th>Inventory Status</Th><Th>Reorder Level</Th><Th>Action</Th></tr></thead>
              <tbody>
                {products.map(p => {
                  const e = updateEdit[p.id] || {};
                  return (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <Td className="font-medium">{p.name}</Td>
                      <Td>
                        <input type="number" className="w-20 border border-slate-300 rounded px-2 py-1 text-sm font-work focus:outline-none focus:ring-2 focus:ring-blue-500" value={e.stock !== undefined ? e.stock : p.stock} onChange={ev => setUpdateEdit(u => ({ ...u, [p.id]: { ...u[p.id], stock: parseInt(ev.target.value) } }))} />
                      </Td>
                      <Td><StockBadge stock={e.stock !== undefined ? e.stock as number : p.stock} reorder={p.reorderLevel} /></Td>
                      <Td>
                        <input type="number" className="w-20 border border-slate-300 rounded px-2 py-1 text-sm font-work focus:outline-none focus:ring-2 focus:ring-blue-500" value={e.reorderLevel !== undefined ? e.reorderLevel : p.reorderLevel} onChange={ev => setUpdateEdit(u => ({ ...u, [p.id]: { ...u[p.id], reorderLevel: parseInt(ev.target.value) } }))} />
                      </Td>
                      <Td>
                        <Btn variant="secondary" size="sm" onClick={() => {
                          setProducts(products.map(x => x.id === p.id ? { ...x, ...e } : x));
                          setUpdateEdit(u => { const n = { ...u }; delete n[p.id]; return n; });
                          showAlert("success", `Inventory data for "${p.name}" updated.`);
                        }} disabled={!updateEdit[p.id]}>Update</Btn>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

// ─── Reports ──────────────────────────────────────────────────────────────────
const Reports = ({ products, transactions, suppliers }: { products: Product[]; transactions: StockTx[]; suppliers: Supplier[]; }) => {
  const [tab, setTab] = useState("Request");
  const [form, setForm] = useState({ type: "Inventory Report", dateFrom: "2026-09-01", dateTo: "2026-09-05", category: "All" });
  const [generated, setGenerated] = useState(false);
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const productName = (id: string) => products.find(p => p.id === id)?.name || id;
  const supplierName = (id: string) => suppliers.find(s => s.id === id)?.name || id;
  const generate = () => { setGenerated(true); setTab("Preview"); };
  const reportTypes = ["Inventory Report", "Stock-In Report", "Stock-Out Report", "Stock Adjustment Report", "Low-Stock Report", "Transaction History"];
  const filteredTx = transactions.filter(tx => {
    const d = tx.date.split(" ")[0];
    return d >= form.dateFrom && d <= form.dateTo;
  });
  const renderReport = () => {
    if (form.type === "Inventory Report") return (
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Product</Th><Th>Category</Th><Th>Current Stock</Th><Th>Reorder Level</Th><Th>Status</Th></tr></thead>
        <tbody>
          {products.filter(p => form.category === "All" || p.category === form.category).map(p => (
            <tr key={p.id} className="border-b border-slate-100"><Td className="font-medium">{p.name}</Td><Td>{p.category}</Td><Td className="font-work font-semibold">{p.stock} {p.unit}</Td><Td className="font-work">{p.reorderLevel}</Td><Td><StockBadge stock={p.stock} reorder={p.reorderLevel} /></Td></tr>
          ))}
        </tbody>
      </table>
    );
    if (form.type === "Stock-In Report") return (
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Date</Th><Th>Product</Th><Th>Quantity</Th><Th>User</Th><Th>Reference</Th></tr></thead>
        <tbody>
          {filteredTx.filter(t => t.type === "IN").map(t => <tr key={t.id} className="border-b border-slate-100"><Td className="font-mono-data text-xs text-slate-500">{t.date}</Td><Td className="font-medium">{productName(t.product)}</Td><Td className="font-work text-emerald-600 font-semibold">+{t.qty}</Td><Td className="font-mono-data text-xs">{t.user}</Td><Td className="font-mono-data text-xs text-slate-400">{t.ref || "—"}</Td></tr>)}
        </tbody>
      </table>
    );
    if (form.type === "Stock-Out Report") return (
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Date</Th><Th>Product</Th><Th>Quantity</Th><Th>User</Th></tr></thead>
        <tbody>
          {filteredTx.filter(t => t.type === "OUT").map(t => <tr key={t.id} className="border-b border-slate-100"><Td className="font-mono-data text-xs text-slate-500">{t.date}</Td><Td className="font-medium">{productName(t.product)}</Td><Td className="font-work text-red-600 font-semibold">−{t.qty}</Td><Td className="font-mono-data text-xs">{t.user}</Td></tr>)}
        </tbody>
      </table>
    );
    if (form.type === "Low-Stock Report") return (
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Product</Th><Th>Current Stock</Th><Th>Reorder Level</Th><Th>Supplier</Th><Th>Status</Th></tr></thead>
        <tbody>
          {products.filter(p => p.stock <= p.reorderLevel).map(p => <tr key={p.id} className="border-b border-slate-100"><Td className="font-medium">{p.name}</Td><Td className="font-work font-semibold">{p.stock} {p.unit}</Td><Td className="font-work">{p.reorderLevel}</Td><Td className="text-xs">{supplierName(p.supplier)}</Td><Td><StockBadge stock={p.stock} reorder={p.reorderLevel} /></Td></tr>)}
        </tbody>
      </table>
    );
    return (
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Date</Th><Th>Type</Th><Th>Product</Th><Th>Quantity</Th><Th>User</Th></tr></thead>
        <tbody>
          {filteredTx.map(t => <tr key={t.id} className="border-b border-slate-100"><Td className="font-mono-data text-xs text-slate-500">{t.date}</Td><Td><Badge label={t.type} color={t.type === "IN" ? "green" : t.type === "OUT" ? "red" : "yellow"} /></Td><Td className="font-medium">{productName(t.product)}</Td><Td className={`font-work font-semibold ${t.qty < 0 ? "text-red-600" : "text-emerald-600"}`}>{t.qty > 0 ? "+" : ""}{t.qty}</Td><Td className="font-mono-data text-xs">{t.user}</Td></tr>)}
        </tbody>
      </table>
    );
  };
  return (
    <div>
      <SectionHeader title="Report Generation" subtitle="Generate and export inventory and transaction reports" />
      <TabBar tabs={["Request", "Preview"]} active={tab} onChange={setTab} />
      {tab === "Request" && (
        <Card className="p-6 max-w-xl">
          <div className="flex flex-col gap-5">
            <Select label="Report Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {reportTypes.map(r => <option key={r}>{r}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date From" type="date" value={form.dateFrom} onChange={e => setForm(f => ({ ...f, dateFrom: e.target.value }))} />
              <Input label="Date To" type="date" value={form.dateTo} onChange={e => setForm(f => ({ ...f, dateTo: e.target.value }))} />
            </div>
            <Select label="Category Filter" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Btn onClick={generate} className="mt-1">Generate Report</Btn>
          </div>
        </Card>
      )}
      {tab === "Preview" && (
        <div className="flex flex-col gap-4">
          {!generated ? (
            <Alert type="warning" message="No report generated yet. Go to Request tab and generate a report first." />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 font-work">{form.type}</h3>
                  <p className="text-xs text-slate-500 font-work">{form.dateFrom} to {form.dateTo} · Generated: September 5, 2026</p>
                </div>
                <div className="flex gap-2">
                  <Btn variant="secondary" size="sm" onClick={() => window.print()}>🖨️ Print</Btn>
                  <Btn variant="secondary" size="sm">⬇️ Export CSV</Btn>
                </div>
              </div>
              <Card>
                <div className="overflow-x-auto">{renderReport()}</div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
const AuditLogs = ({ logs }: { logs: AuditLog[] }) => {
  const [filters, setFilters] = useState({ user: "", activity: "", dateFrom: "", dateTo: "" });
  const [archived, setArchived] = useState(false);
  const activities = Array.from(new Set(logs.map(l => l.activity)));
  const filtered = logs.filter(l => {
    if (filters.user && !l.user.includes(filters.user)) return false;
    if (filters.activity && l.activity !== filters.activity) return false;
    if (filters.dateFrom && l.datetime.split(" ")[0] < filters.dateFrom) return false;
    if (filters.dateTo && l.datetime.split(" ")[0] > filters.dateTo) return false;
    return true;
  });
  return (
    <div>
      <SectionHeader title="Activity & Audit Logs" subtitle="Chronological record of all system activities" action={<Btn variant="secondary" onClick={() => setArchived(true)}>Archive Old Logs</Btn>} />
      {archived && <div className="mb-4"><Alert type="success" message="Logs older than 30 days have been archived successfully." /></div>}
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="User" value={filters.user} onChange={e => setFilters(f => ({ ...f, user: e.target.value }))} placeholder="e.g. staff01" />
          <Select label="Activity Type" value={filters.activity} onChange={e => setFilters(f => ({ ...f, activity: e.target.value }))}>
            <option value="">All Activities</option>
            {activities.map(a => <option key={a}>{a}</option>)}
          </Select>
          <Input label="Date From" type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
          <Input label="Date To" type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
        </div>
        <div className="flex gap-3 mt-4">
          <Btn variant="secondary" size="sm" onClick={() => setFilters({ user: "", activity: "", dateFrom: "", dateTo: "" })}>Clear Filters</Btn>
          <span className="text-xs text-slate-400 font-work self-center">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</span>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Date / Time</Th><Th>User</Th><Th>Activity</Th><Th>Details</Th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <EmptyTable /> : filtered.map(l => (
                <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <Td><span className="font-mono-data text-xs text-slate-500">{l.datetime}</span></Td>
                  <Td><span className="font-mono-data text-xs font-medium text-blue-600">{l.user}</span></Td>
                  <Td><Badge label={l.activity} color="gray" /></Td>
                  <Td className="text-slate-600">{l.details}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── Backup & Restore ─────────────────────────────────────────────────────────
const BackupRestore = ({ backups, setBackups }: { backups: BackupFile[]; setBackups: (b: BackupFile[]) => void }) => {
  const [tab, setTab] = useState("Backup");
  const [schedule, setSchedule] = useState({ enabled: true, frequency: "Daily", time: "00:00", location: "/backups/school-supply-inventory/" });
  const [backupProgress, setBackupProgress] = useState<null | "preparing" | "creating" | "verifying" | "done">(null);
  const [restoreModal, setRestoreModal] = useState<BackupFile | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const showAlert = (type: "success" | "error", msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };
  const runBackup = () => {
    setBackupProgress("preparing");
    setTimeout(() => setBackupProgress("creating"), 800);
    setTimeout(() => setBackupProgress("verifying"), 1800);
    setTimeout(() => {
      setBackupProgress("done");
      const nb: BackupFile = { id: `BKP${String(backups.length + 1).padStart(3, "0")}`, date: new Date().toISOString().slice(0, 16).replace("T", " "), size: "4.3 MB", status: "Verified" };
      setBackups([nb, ...backups]);
      setTimeout(() => setBackupProgress(null), 2000);
    }, 2800);
  };
  const verifyBackup = (id: string) => {
    setBackups(backups.map(b => b.id === id ? { ...b, status: "Verified" } : b));
    showAlert("success", "Backup verified successfully. File integrity confirmed.");
  };
  const confirmRestore = () => {
    setRestoreModal(null);
    showAlert("success", `Database restored from backup ${restoreModal?.date}. System restarting…`);
  };
  const steps = ["preparing", "creating", "verifying", "done"];
  const stepLabels = ["Preparing backup…", "Creating backup…", "Verifying…", "Backup completed."];
  return (
    <div>
      <SectionHeader title="Backup & Restore" subtitle="Schedule, perform, verify, and restore database backups" />
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} /></div>}
      <TabBar tabs={["Backup", "Restore"]} active={tab} onChange={setTab} />
      {tab === "Backup" && (
        <div className="flex flex-col gap-6">
          {/* Schedule */}
          <Card className="p-5 max-w-lg">
            <h3 className="font-bold text-slate-800 font-work text-sm mb-4">Schedule Backup</h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={schedule.enabled} onChange={e => setSchedule(s => ({ ...s, enabled: e.target.checked }))} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm font-work text-slate-700 font-semibold">Enable Scheduled Backup</span>
              </label>
              {schedule.enabled && (
                <>
                  <Select label="Frequency" value={schedule.frequency} onChange={e => setSchedule(s => ({ ...s, frequency: e.target.value }))}>
                    <option>Daily</option><option>Weekly</option><option>Monthly</option>
                  </Select>
                  <Input label="Backup Time" type="time" value={schedule.time} onChange={e => setSchedule(s => ({ ...s, time: e.target.value }))} />
                  <Input label="Backup Location" value={schedule.location} onChange={e => setSchedule(s => ({ ...s, location: e.target.value }))} />
                  <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm font-work text-slate-600">
                    Next Backup: <strong className="text-slate-800">September 6, 2026 — {schedule.time}</strong>
                  </div>
                </>
              )}
              <Btn onClick={() => showAlert("success", "Backup schedule saved.")} size="sm">Save Schedule</Btn>
            </div>
          </Card>
          {/* Manual Backup */}
          <Card className="p-5 max-w-lg">
            <h3 className="font-bold text-slate-800 font-work text-sm mb-4">Perform Database Backup</h3>
            {backupProgress ? (
              <div className="flex flex-col gap-2">
                {steps.map((s, i) => {
                  const current = steps.indexOf(backupProgress);
                  const done = i < current || backupProgress === "done";
                  const active = i === current && backupProgress !== "done";
                  return (
                    <div key={s} className={`flex items-center gap-3 text-sm font-work py-1 ${done ? "text-emerald-600" : active ? "text-blue-600 font-semibold" : "text-slate-300"}`}>
                      <span>{done ? "✓" : active ? "⟳" : "○"}</span>
                      {stepLabels[i]}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-500 font-work">Last Backup: <strong className="text-slate-700">{backups[0]?.date || "Never"}</strong></p>
                <Btn onClick={runBackup} className="w-fit">Backup Now</Btn>
              </div>
            )}
          </Card>
          {/* Backup Files */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 font-work text-sm">Backup Files</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Backup ID</Th><Th>Date Created</Th><Th>Size</Th><Th>Status</Th><Th>Action</Th></tr></thead>
                <tbody>
                  {backups.map(b => (
                    <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <Td><span className="font-mono-data text-xs text-slate-500">{b.id}</span></Td>
                      <Td className="font-mono-data text-xs">{b.date}</Td>
                      <Td className="font-work text-slate-600">{b.size}</Td>
                      <Td>{b.status === "Verified" ? <Badge label="✓ Verified" color="green" /> : <Badge label="Unverified" color="yellow" />}</Td>
                      <Td>
                        <div className="flex gap-2">
                          {b.status === "Unverified" && <Btn variant="secondary" size="sm" onClick={() => verifyBackup(b.id)}>Verify</Btn>}
                          <Btn variant="ghost" size="sm" onClick={() => { setTab("Restore"); setRestoreModal(b); }}>Restore</Btn>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      {tab === "Restore" && (
        <div className="flex flex-col gap-4">
          <Alert type="warning" message="Restoring a backup may replace current database information. This action cannot be undone." />
          <Card>
            <div className="px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 font-work text-sm">Select Backup File to Restore</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><Th>Backup ID</Th><Th>Date Created</Th><Th>Size</Th><Th>Status</Th><Th>Action</Th></tr></thead>
                <tbody>
                  {backups.map(b => (
                    <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <Td><span className="font-mono-data text-xs text-slate-500">{b.id}</span></Td>
                      <Td className="font-mono-data text-xs">{b.date}</Td>
                      <Td>{b.size}</Td>
                      <Td>{b.status === "Verified" ? <Badge label="✓ Verified" color="green" /> : <Badge label="Unverified" color="yellow" />}</Td>
                      <Td><Btn variant="danger" size="sm" onClick={() => setRestoreModal(b)}>Restore</Btn></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      {restoreModal && (
        <Modal title="Confirm Database Restore" onClose={() => setRestoreModal(null)}>
          <div className="flex flex-col gap-4">
            <Alert type="warning" message={`Restoring backup from ${restoreModal.date} (${restoreModal.size}) may replace all current database information. This cannot be undone.`} />
            <div className="bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm font-work">
              <span className="text-slate-500">Backup File:</span> <strong className="text-slate-800">{restoreModal.id}</strong><br />
              <span className="text-slate-500">Created:</span> <strong className="text-slate-800">{restoreModal.date}</strong>
            </div>
            <div className="flex gap-3">
              <Btn variant="secondary" onClick={() => setRestoreModal(null)}>Cancel</Btn>
              <Btn variant="danger" onClick={confirmRestore}>Confirm Restore</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Sidebar Navigation ───────────────────────────────────────────────────────
const navItems = [
  { section: "dashboard", label: "Dashboard", icon: "⊞" },
  { section: "users", label: "User Management", icon: "👥" },
  { section: "products", label: "Product Management", icon: "📦" },
  { section: "suppliers", label: "Supplier Management", icon: "🏢" },
  { section: "stock", label: "Stock Management", icon: "📋" },
  { section: "inventory", label: "Inventory", icon: "📊" },
  { section: "reports", label: "Reports", icon: "📄" },
  { section: "logs", label: "Audit Logs", icon: "🔍", managerOnly: true },
  { section: "backup", label: "Backup & Restore", icon: "💾", managerOnly: true },
];

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [section, setSection] = useState("dashboard");
  const [subSection, setSubSection] = useState<string | undefined>();
  const [users, setUsers] = useState<User[]>(INIT_USERS);
  const [products, setProducts] = useState<Product[]>(INIT_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INIT_SUPPLIERS);
  const [transactions, setTransactions] = useState<StockTx[]>(INIT_TRANSACTIONS);
  const [logs] = useState<AuditLog[]>(INIT_LOGS);
  const [backups, setBackups] = useState<BackupFile[]>(INIT_BACKUPS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNav = (s: string, sub?: string) => { setSection(s); setSubSection(sub); };
  const low = products.filter(p => p.stock <= p.reorderLevel);

  if (!currentUser) return <LoginScreen onLogin={(u) => { setCurrentUser(u); setSection("dashboard"); }} />;

  const visibleNav = navItems.filter(n => !n.managerOnly || currentUser.role === "Manager");

  return (
    <div className="flex h-full bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-14"} shrink-0 bg-slate-900 text-slate-300 flex flex-col transition-all duration-200 overflow-hidden`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700/60">
          <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          {sidebarOpen && <span className="text-white font-bold text-sm font-work leading-tight">School Supply<br />Inventory</span>}
        </div>
        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {visibleNav.map(item => (
            <button key={item.section} onClick={() => handleNav(item.section)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-work transition-all ${section === item.section ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent"}`}>
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
              {sidebarOpen && item.section === "inventory" && low.length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{low.length}</span>
              )}
            </button>
          ))}
        </nav>
        {/* User info */}
        <div className="border-t border-slate-700/60 px-4 py-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{currentUser.name[0]}</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 font-work truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500 font-work">{currentUser.role}</p>
              </div>
              <button onClick={() => setCurrentUser(null)} className="ml-auto text-slate-500 hover:text-slate-300 text-xs font-work shrink-0" title="Logout">✕</button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer" onClick={() => setCurrentUser(null)}>{currentUser.name[0]}</div>
            </div>
          )}
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(s => !s)} className="text-slate-500 hover:text-slate-800 transition text-lg">☰</button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-slate-800 font-work capitalize">{navItems.find(n => n.section === section)?.label || section}</h1>
          </div>
          {low.length > 0 && (
            <button onClick={() => handleNav("inventory", "Low-Stock Alerts")} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs font-work text-amber-700 hover:bg-amber-100 transition">
              ⚠️ {low.length} Low Stock
            </button>
          )}
          <div className="text-xs text-slate-400 font-work">September 5, 2026</div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {section === "dashboard" && <Dashboard products={products} transactions={transactions} logs={logs} onNav={handleNav} />}
          {section === "users" && <UserManagement users={users} setUsers={setUsers} currentUser={currentUser} />}
          {section === "products" && <ProductManagement products={products} setProducts={setProducts} suppliers={suppliers} />}
          {section === "suppliers" && <SupplierManagement suppliers={suppliers} setSuppliers={setSuppliers} products={products} />}
          {section === "stock" && <StockManagement products={products} setProducts={setProducts} transactions={transactions} setTransactions={setTransactions} currentUser={currentUser} suppliers={suppliers} />}
          {section === "inventory" && <InventoryManagement products={products} setProducts={setProducts} suppliers={suppliers} initialTab={subSection} />}
          {section === "reports" && <Reports products={products} transactions={transactions} suppliers={suppliers} />}
          {section === "logs" && <AuditLogs logs={logs} />}
          {section === "backup" && <BackupRestore backups={backups} setBackups={setBackups} />}
        </main>
      </div>
    </div>
  );
}
