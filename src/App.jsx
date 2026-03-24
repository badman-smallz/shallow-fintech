import { useState, useEffect, useMemo } from 'react';
import {
  ArrowUpRight, ArrowDownLeft, Bell, Search, Home, Settings, User, X,
  CheckCircle2, AlertCircle, Globe, ChevronRight, ChevronLeft, CreditCard,
  Shield, Smartphone, LogOut, Copy, Check, Activity, Menu,
  Fingerprint, Lock, Mail, Eye, EyeOff, ToggleLeft, ToggleRight, Landmark, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './app.css';

// ─── Data ─────────────────────────────────────────────────────────────────────
const generateTransactions = () => {
  // Seeded PRNG so transactions never change on refresh
  let seed = 20200919;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  const merchants = ['Amazon','Walmart','Target','Starbucks','Uber','Netflix','Spotify','Whole Foods','Shell Gas','Home Depot','Apple Store','CVS Pharmacy','Delta Airlines','Airbnb'];
  const incomeSources = ['Payroll Direct Deposit','Venmo Transfer','Zelle Transfer','Interest Payment','Tax Refund'];
  const start = new Date('2020-09-19').getTime();
  const end = new Date('2025-08-19').getTime();
  return Array.from({ length: 120 }, (_, i) => {
    const date = new Date(start + rand() * (end - start));
    const isIncome = rand() > 0.85;
    return {
      id: `tx-${10000 + i}`,
      name: isIncome ? incomeSources[Math.floor(rand() * incomeSources.length)] : merchants[Math.floor(rand() * merchants.length)],
      type: isIncome ? 'received' : 'sent',
      amount: parseFloat((isIncome ? rand() * 4000 + 500 : rand() * 150 + 5).toFixed(2)),
      date: date.toISOString(),
      status: rand() > 0.95 ? 'pending' : 'completed',
      ref: `REF-${Math.floor(rand() * 100000000)}`,
      network: isIncome ? 'ACH' : 'Visa Debit 4567',
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const BANKS = [
  { id: 'chase', name: 'JPMorgan Chase', type: 'Commercial Bank', region: 'US, Global', countries: ['United States','Canada','United Kingdom'], services: ['International Wire','SWIFT','ACH'], swiftCode: 'CHASUS33', fee: 'Standard Wire Fees', time: '1-2 Days', icon: Landmark },
  { id: 'bofa', name: 'Bank of America', type: 'Commercial Bank', region: 'US, Global', countries: ['United States','Mexico','Canada'], services: ['International Wire','SWIFT','ACH'], swiftCode: 'BOFAUS3N', fee: 'Standard Wire Fees', time: '1-2 Days', icon: Landmark },
  { id: 'paypal', name: 'PayPal', type: 'Digital Wallet', region: 'Global', countries: ['United States','United Kingdom','Australia','Global'], services: ['P2P Transfer','International Wire','Digital Wallet'], swiftCode: 'N/A', fee: '2.9% + $0.30', time: 'Instant', icon: Smartphone },
  { id: 'wellsfargo', name: 'Wells Fargo', type: 'Commercial Bank', region: 'US, Global', countries: ['United States','Global'], services: ['International Wire','SWIFT','ACH'], swiftCode: 'WFBIUS6S', fee: 'Varies by account', time: '1-3 Days', icon: Landmark },
  { id: 'westernunion', name: 'Western Union', type: 'Wire Transfer', region: 'Global (200+)', countries: ['Global','Mexico','India','Philippines'], services: ['Cash Pickup','International Wire','Mobile Wallet'], swiftCode: 'N/A', fee: 'Varies by destination', time: 'Minutes to Days', icon: Globe },
  { id: 'barclays', name: 'Barclays', type: 'Commercial Bank', region: 'UK, Global', countries: ['United Kingdom','United States','Europe'], services: ['International Wire','SWIFT','SEPA'], swiftCode: 'BARCGB22', fee: 'Standard banking fees', time: '1-3 Days', icon: Landmark },
  { id: 'hsbc', name: 'HSBC', type: 'Commercial Bank', region: 'Global', countries: ['United Kingdom','Hong Kong','United States','Global'], services: ['International Wire','SWIFT','SEPA','Global Transfers'], swiftCode: 'HSBCGB2L', fee: 'Varies by region', time: '1-3 Days', icon: Globe },
];

const NOTIFS = [
  { id: 'n1', title: 'Direct Deposit Received', desc: 'Payroll deposit of $4,250.00 has cleared.', time: '2h ago', unread: true },
  { id: 'n2', title: 'Low Balance Alert', desc: 'Your checking account is below $500.', time: '1d ago', unread: false },
  { id: 'n3', title: 'Security Update', desc: 'New login from an unrecognized device.', time: '2d ago', unread: false },
];

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: Home },
  { id: 'transfers', label: 'Transfers', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (s, full = false) => {
  const d = new Date(s);
  if (full) return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const today = new Date(), yest = new Date(today);
  yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (d.toDateString() === yest.toDateString()) return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [view, setView] = useState('dashboard');
  const [balance, setBalance] = useState(26740000.00);
  const [savings] = useState(643032.00);
  const [txs, setTxs] = useState([]);
  const [txSearch, setTxSearch] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selTx, setSelTx] = useState(null);
  const [selBank, setSelBank] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const [modal, setModal] = useState('none');
  const [form, setForm] = useState({ name: '', amount: '' });
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'ok' });
  const [settingsCat, setSettingsCat] = useState(null);
  const [settings, setSettings] = useState({
    biometrics: true, twoFactor: false,
    emailNotifs: true, smsNotifs: false,
    intlTransfers: true, overdraft: false,
  });

  useEffect(() => { setTxs(generateTransactions()); }, []);

  const pop = (msg, type = 'ok') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'signin') {
      if (email && password) { setAuthed(true); pop('Welcome back!'); }
      else pop('Please enter your email and password.', 'err');
    } else {
      if (email && password) { setAuthed(true); pop('Account created successfully.'); }
      else pop('Please fill in all fields.', 'err');
    }
  };

  const handleBio = () => { pop('Biometric authentication successful.'); setAuthed(true); };
  const handleSignOut = () => { setAuthed(false); setEmail(''); setPassword(''); setView('dashboard'); pop('Signed out securely.'); };

  const filteredTxs = useMemo(() =>
    txs.filter(t => t.name.toLowerCase().includes(txSearch.toLowerCase()) || t.ref.toLowerCase().includes(txSearch.toLowerCase())),
    [txs, txSearch]);

  const filteredBanks = useMemo(() => {
    const q = bankSearch.toLowerCase();
    return BANKS.filter(b =>
      b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q) ||
      b.region.toLowerCase().includes(q) || b.swiftCode.toLowerCase().includes(q) ||
      b.countries.some(c => c.toLowerCase().includes(q)) || b.services.some(s => s.toLowerCase().includes(q))
    );
  }, [bankSearch]);

  const markNotif = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const copy = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const submitTx = (e) => {
    e.preventDefault();
    setModal('none'); setForm({ name: '', amount: '' });
  };

  const toggleSetting = (key) => { setSettings(prev => ({ ...prev, [key]: !prev[key] })); pop('Setting updated.'); };

  // ── AUTH ────────────────────────────────────────────────────────────────────
  if (!authed) return (
    <>
      <div className="auth-root">
        {/* Left branding panel */}
        <div className="auth-left">
          <div className="auth-left-glow" />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
              <Landmark size={18} color="#fff" strokeWidth={2} />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Vault Bank</span>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Banking built<br />for the future.
            </h1>
            <p style={{ color: '#a5b4fc', fontSize: '1rem', lineHeight: 1.7, maxWidth: '22rem' }}>
              Manage your money, send transfers globally, and grow your savings — all in one place.
            </p>
            <div className="auth-stats">
              {[['$2.4B+','Assets managed'],['180+','Countries'],['99.9%','Uptime SLA']].map(([v, l]) => (
                <div key={l} className="auth-stat-card">
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#fff' }}>{v}</div>
                  <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.25rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ position: 'relative', zIndex: 1, fontSize: '0.75rem', color: 'rgba(165,180,252,0.5)' }}>FDIC Insured · 256-bit encryption</p>
        </div>

        {/* Right form panel */}
        <div className="auth-right">
          <div className="auth-form-box">
            {/* Mobile logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2.5rem' }} className="lg-hide">
              <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Landmark size={16} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Vault Bank</span>
            </div>

            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
              {authMode === 'signin' ? 'Welcome back' : 'Get started'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem' }}>
              {authMode === 'signin' ? "No account? " : 'Have an account? '}
              <button onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                {authMode === 'signin' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Email</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="auth-input" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="auth-input auth-input-pr" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="auth-input-icon-right">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {authMode === 'signin' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: '#6366f1' }} />
                    <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Remember me</span>
                  </label>
                  <a href="#" style={{ fontSize: '0.8125rem', color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
                </div>
              )}
              <button type="submit" className="grad-btn" style={{ marginTop: '0.5rem' }}>
                {authMode === 'signin' ? 'Sign in to Vault' : 'Create my account'}
              </button>
            </form>

            {authMode === 'signin' && (
              <>
                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span style={{ fontSize: '0.75rem', color: '#334155' }}>or</span>
                  <div className="auth-divider-line" />
                </div>
                <button onClick={handleBio} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}>
                  <Fingerprint size={18} color="#818cf8" />
                  Continue with Biometrics
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1.25rem', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', background: toast.type === 'ok' ? '#f0fdf4' : '#fef2f2', color: toast.type === 'ok' ? '#166534' : '#991b1b', border: `1px solid ${toast.type === 'ok' ? '#bbf7d0' : '#fecaca'}` }}>
              {toast.type === 'ok' ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#dc2626" />}
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // ── MAIN SHELL ──────────────────────────────────────────────────────────────
  return (
    <div className="app-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Landmark size={16} color="#fff" strokeWidth={2} /></div>
          <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Vault Bank</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`sidebar-nav-item${view === item.id ? ' active' : ''}`}>
              <item.icon size={16} />
              {item.label}
              {item.id === 'dashboard' && <span className="sidebar-nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-user" onClick={() => setView('profile')}>
            <div className="sidebar-avatar">EJ</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Eunice Angelina James</div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.125rem' }}>Premier Banking</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-logo-mobile">
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={14} color="#fff" strokeWidth={2} />
            </div>
            <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>Vault Bank</span>
          </div>
          <div className="topbar-spacer" />
          <div className="topbar-actions">
            <button className="topbar-btn" onClick={() => setShowNotifs(true)}>
              <Bell size={18} strokeWidth={1.75} />
              {notifs.some(n => n.unread) && <span className="notif-dot" />}
            </button>
            <button className="topbar-btn topbar-menu-btn" style={{ display: 'flex' }} onClick={() => setMobileMenu(true)}>
              <Menu size={18} />
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="page-content">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && <DashView key="dash" balance={balance} savings={savings} filteredTxs={filteredTxs} txSearch={txSearch} setTxSearch={setTxSearch} setSelTx={setSelTx} setModal={setModal} />}
            {view === 'transfers' && <TransfersView key="transfers" filteredBanks={filteredBanks} bankSearch={bankSearch} setBankSearch={setBankSearch} setSelBank={setSelBank} />}
            {view === 'settings' && <SettingsView key="settings" settingsCat={settingsCat} setSettingsCat={setSettingsCat} settings={settings} toggleSetting={toggleSetting} />}
            {view === 'profile' && <ProfileView key="profile" handleSignOut={handleSignOut} />}
          </AnimatePresence>
        </main>

        {/* Bottom nav */}
        <nav className="bottom-nav">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`bottom-nav-item${view === item.id ? ' active' : ''}`}>
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mobile-drawer" style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileMenu(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }} className="mobile-drawer-panel" onClick={e => e.stopPropagation()}>
              <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9375rem' }}>Menu</span>
                <button className="icon-btn" onClick={() => setMobileMenu(false)}><X size={16} /></button>
              </div>
              <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {NAV.map(item => (
                  <button key={item.id} onClick={() => { setView(item.id); setMobileMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.875rem', border: 'none', background: view === item.id ? '#eef2ff' : 'none', color: view === item.id ? '#6366f1' : '#64748b', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background 0.15s' }}>
                    <item.icon size={16} />{item.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.875rem', border: 'none', background: 'none', color: '#ef4444', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications panel */}
      <AnimatePresence>
        {showNotifs && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.2)', backdropFilter: 'blur(4px)', zIndex: 49 }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }} className="notif-panel">
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>Notifications</span>
                <button className="icon-btn" onClick={() => setShowNotifs(false)}><X size={16} /></button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {notifs.map(n => (
                  <div key={n.id} onClick={() => markNotif(n.id)} style={{ padding: '1rem', borderRadius: '1rem', border: '1px solid #f1f5f9', cursor: 'pointer', position: 'relative', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    {n.unread && <span style={{ position: 'absolute', top: '1.25rem', left: '0.75rem', width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1' }} />}
                    <div style={{ paddingLeft: n.unread ? '1rem' : '0' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: n.unread ? 700 : 600, color: n.unread ? '#0f172a' : '#475569' }}>{n.title}</p>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>{n.desc}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Transaction detail modal */}
      <AnimatePresence>
        {selTx && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={() => setSelTx(null)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Transaction Details</span>
                <button className="modal-close" onClick={() => setSelTx(null)}><X size={14} /></button>
              </div>
              <div className="modal-body">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '4rem', height: '4rem', borderRadius: '1.25rem', background: selTx.type === 'received' ? '#d1fae5' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: selTx.type === 'received' ? '#059669' : '#64748b' }}>
                    {selTx.type === 'received' ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{selTx.type === 'received' ? '+' : '-'}{fmt(selTx.amount)}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.375rem' }}>{selTx.name}</div>
                </div>
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                  {[
                    ['Status', <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', textTransform: 'capitalize' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selTx.status === 'completed' ? '#10b981' : selTx.status === 'pending' ? '#f59e0b' : '#ef4444' }} />{selTx.status}</span>],
                    ['Date', <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{fmtDate(selTx.date, true)}</span>],
                    ['Network', <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{selTx.network}</span>],
                    ['Reference', <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: '#f8fafc', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9', color: '#475569' }}>{selTx.ref}</span>
                      <button className="icon-btn" onClick={() => copy(selTx.ref)}>{copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}</button>
                    </div>],
                  ].map(([label, val]) => (
                    <div key={label} className="detail-row">
                      <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{label}</span>
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank detail modal */}
      <AnimatePresence>
        {selBank && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={() => setSelBank(null)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Transfer Details</span>
                <button className="modal-close" onClick={() => setSelBank(null)}><X size={14} /></button>
              </div>
              <div className="modal-body">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '4rem', height: '4rem', borderRadius: '1.25rem', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#6366f1' }}>
                    <selBank.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a' }}>{selBank.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>{selBank.type}</div>
                </div>
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                  {[['Regions', selBank.region],['Fees', selBank.fee],['Processing', selBank.time]].map(([l, v]) => (
                    <div key={l} className="detail-row">
                      <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{l}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{v}</span>
                    </div>
                  ))}
                  <button className="grad-btn" style={{ marginTop: '1.25rem' }} onClick={() => { setSelBank(null); setModal('send'); }}>
                    Initiate Transfer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send / Deposit modal */}
      <AnimatePresence>
        {modal !== 'none' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={() => setModal('none')}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{modal === 'send' ? 'Transfer Funds' : 'Deposit Funds'}</span>
                <button className="modal-close" onClick={() => setModal('none')}><X size={14} /></button>
              </div>
              <div className="modal-body">
       

                <form onSubmit={submitTx} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Amount</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: '#cbd5e1' }}>$</span>
                      <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" autoFocus
                        style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', background: 'none', border: 'none', outline: 'none', width: '12rem', textAlign: 'center' }} />
                    </div>
                    {modal === 'send' && <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.5rem' }}>Available: <strong style={{ color: '#0f172a' }}>{fmt(balance)}</strong></p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>{modal === 'send' ? 'Recipient' : 'From Account'}</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={modal === 'send' ? 'Name, account, or email' : 'Select linked account'}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '0.875rem', fontSize: '0.875rem', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Memo (optional)</label>
                      <input type="text" placeholder="What is this for?"
                        style={{ width: '100%', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '0.875rem', fontSize: '0.875rem', color: '#0f172a', outline: 'none' }} />
                    </div>
                  </div>
                  <button type="submit" className="grad-btn">
                    {modal === 'send' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    {modal === 'send' ? 'Confirm Transfer' : 'Initiate Deposit'}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 1.25rem', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', background: toast.type === 'ok' ? '#f0fdf4' : '#fef2f2', color: toast.type === 'ok' ? '#166534' : '#991b1b', border: `1px solid ${toast.type === 'ok' ? '#bbf7d0' : '#fecaca'}` }}>
              {toast.type === 'ok' ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#dc2626" />}
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashView({ balance, savings, filteredTxs, txSearch, setTxSearch, setSelTx, setModal }) {
  return (
    <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Balance + savings */}
      <div className="dash-top">
        {/* Balance hero */}
        <div className="balance-hero">
          <div className="balance-hero-glow1" />
          <div className="balance-hero-glow2" />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(199,210,254,0.9)', fontWeight: 600, marginBottom: '0.25rem' }}>Everyday Checking</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>•••• 4567</div>
            </div>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.875rem', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} color="#fff" />
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.375rem' }}>Available Balance</div>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{fmt(balance)}</div>
            <div style={{ marginTop: '0.875rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#6ee7b7', background: 'rgba(110,231,183,0.15)', padding: '0.25rem 0.625rem', borderRadius: '999px', fontWeight: 700 }}>+2.4% this month</span>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="savings-panel">
          <div className="savings-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>High Yield Savings</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>4.25% APY</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{fmt(savings)}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem', fontFamily: 'monospace' }}>•••• 8901</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        {[
          { label: 'Transfer', icon: ArrowUpRight, action: () => {}, bg: '#eef2ff', color: '#6366f1' },
          { label: 'Deposit', icon: ArrowDownLeft, action: () => {}, bg: '#f5f3ff', color: '#7c3aed' },
          { label: 'Pay Bills', icon: CreditCard, action: () => {}, bg: '#eff6ff', color: '#2563eb' },
          { label: 'Invest', icon: Activity, action: () => {}, bg: '#f0fdf4', color: '#16a34a' },
        ].map(({ label, icon: Icon, action, bg, color }) => (
          <button key={label} onClick={action} className="qa-btn" style={{ background: bg, color }}>
            <div className="qa-icon"><Icon size={18} color={color} /></div>
            {label}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="tx-card">
        <div className="tx-header">
          <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>Recent Transactions</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="tx-search-wrap">
              <Search size={14} className="tx-search-icon" />
              <input type="text" value={txSearch} onChange={e => setTxSearch(e.target.value)} placeholder="Search..." className="tx-search" />
            </div>
            <button style={{ padding: '0.5rem 0.875rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '0.875rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>Filter</button>
          </div>
        </div>
        <div className="tx-body">
          {/* Desktop table */}
          <table className="tx-table" id="tx-desktop">
            <thead>
              <tr>
                {['Date','Description','Network','Amount'].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 3 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTxs.map(tx => (
                <tr key={tx.id} onClick={() => setSelTx(tx)}>
                  <td style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmtDate(tx.date)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="tx-icon" style={{ background: tx.type === 'received' ? '#d1fae5' : '#f1f5f9', color: tx.type === 'received' ? '#059669' : '#64748b' }}>
                        {tx.type === 'received' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{tx.name}</div>
                        {tx.status === 'pending' && <div style={{ fontSize: '0.6875rem', color: '#d97706', fontWeight: 700 }}>Pending</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>{tx.network}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: tx.type === 'received' ? '#059669' : '#0f172a', whiteSpace: 'nowrap' }}>
                    {tx.type === 'received' ? '+' : '-'}{fmt(tx.amount)}
                  </td>
                </tr>
              ))}
              {filteredTxs.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.875rem' }}>No transactions found.</td></tr>
              )}
            </tbody>
          </table>
          {/* Mobile list */}
          <div id="tx-mobile">
            {filteredTxs.map(tx => (
              <div key={tx.id} className="tx-mobile-item" onClick={() => setSelTx(tx)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="tx-icon" style={{ width: '2.5rem', height: '2.5rem', background: tx.type === 'received' ? '#d1fae5' : '#f1f5f9', color: tx.type === 'received' ? '#059669' : '#64748b' }}>
                    {tx.type === 'received' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', maxWidth: '45vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' }}>{fmtDate(tx.date)}</div>
                    {tx.status === 'pending' && <div style={{ fontSize: '0.6875rem', color: '#d97706', fontWeight: 700 }}>Pending</div>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: tx.type === 'received' ? '#059669' : '#0f172a' }}>
                    {tx.type === 'received' ? '+' : '-'}{fmt(tx.amount)}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.125rem' }}>{tx.network}</div>
                </div>
              </div>
            ))}
            {filteredTxs.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>No transactions found.</div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Transfers View ───────────────────────────────────────────────────────────
function TransfersView({ filteredBanks, bankSearch, setBankSearch, setSelBank }) {
  return (
    <motion.div key="transfers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Global Transfers</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Domestic and international wire services.</p>
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input type="text" value={bankSearch} onChange={e => setBankSearch(e.target.value)} placeholder="Search by country, SWIFT..."
            style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '0.875rem', fontSize: '0.8125rem', outline: 'none', width: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['SWIFT','International Wire','United States','SEPA'].map(f => (
          <button key={f} onClick={() => setBankSearch(f)} className="filter-pill">{f}</button>
        ))}
        {bankSearch && <button onClick={() => setBankSearch('')} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Clear</button>}
      </div>
      <div className="banks-grid">
        {filteredBanks.map(bank => (
          <div key={bank.id} className="bank-card" onClick={() => setSelBank(bank)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div className="bank-icon"><bank.icon size={22} strokeWidth={1.5} /></div>
              {bank.swiftCode !== 'N/A' && (
                <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', fontWeight: 700, color: '#94a3b8', background: '#f8fafc', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>{bank.swiftCode}</span>
              )}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{bank.name}</div>
            <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.25rem' }}>{bank.type}</div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
                {bank.services.slice(0, 2).map(s => (
                  <span key={s} style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, color: '#6366f1', background: '#eef2ff', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>{s}</span>
                ))}
                {bank.services.length > 2 && <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, color: '#94a3b8', background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>+{bank.services.length - 2}</span>}
              </div>
              <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '0.875rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Region</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bank.region}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Est. time</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>{bank.time}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredBanks.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center' }}>
            <Globe size={40} color="#e2e8f0" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 700, color: '#64748b' }}>No services found</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>Try adjusting your search.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────
const SETTINGS_MAP = {
  'Security & Privacy': [
    { key: 'biometrics', label: 'Biometric Login', desc: 'Use FaceID or TouchID to sign in' },
    { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require an extra code when signing in' },
  ],
  'Notifications': [
    { key: 'emailNotifs', label: 'Email Alerts', desc: 'Receive statements and alerts via email' },
    { key: 'smsNotifs', label: 'SMS Alerts', desc: 'Get text messages for large transactions' },
  ],
  'Account Features': [
    { key: 'intlTransfers', label: 'International Transfers', desc: 'Allow sending money outside the US' },
    { key: 'overdraft', label: 'Overdraft Protection', desc: 'Auto-pull from savings if checking is low' },
  ],
};

function SettingsView({ settingsCat, setSettingsCat, settings, toggleSetting }) {
  if (settingsCat) {
    const items = SETTINGS_MAP[settingsCat] || [];
    return (
      <motion.div key="settings-cat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button onClick={() => setSettingsCat(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> Back to Settings
        </button>
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '1.5rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>{settingsCat}</h2>
          {items.map(({ key, label, desc }) => (
            <div key={key} className="detail-row">
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{label}</div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>{desc}</div>
              </div>
              <button className="toggle-btn" onClick={() => toggleSetting(key)} style={{ color: settings[key] ? '#6366f1' : '#cbd5e1' }}>
                {settings[key] ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>
          ))}
          {settingsCat === 'Security & Privacy' && (
            <div style={{ paddingTop: '1rem' }}>
              <button style={{ padding: '0.625rem 1.25rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Change Password</button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div key="settings-main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Manage your account preferences and security.</p>
      </div>
      <div className="settings-list">
        {[
          { icon: Shield, title: 'Security & Privacy', desc: 'Biometrics, Password, 2FA' },
          { icon: Bell, title: 'Notifications', desc: 'Email and SMS alert preferences' },
          { icon: Activity, title: 'Account Features', desc: 'Overdraft, international limits' },
          { icon: CreditCard, title: 'Cards & Devices', desc: 'Manage debit cards and Apple Pay' },
          { icon: User, title: 'Personal Info', desc: 'Update your contact details' },
        ].map((item) => (
          <div key={item.title} className="settings-item" onClick={() => setSettingsCat(item.title)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="settings-icon"><item.icon size={18} /></div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.125rem' }}>{item.desc}</div>
              </div>
            </div>
            <ChevronRight size={16} color="#cbd5e1" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Profile View ─────────────────────────────────────────────────────────────
function ProfileView({ handleSignOut }) {
  return (
    <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="profile-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '5rem', height: '5rem', borderRadius: '1.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>EJ</div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Eunice Angelina James</h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>Elisabethsey5807@hotmail.com</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #f1f5f9', fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                <Smartphone size={14} /> +1 (555) 000-0000
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '0.8125rem', fontWeight: 600, color: '#15803d' }}>
                <CheckCircle2 size={14} /> Identity Verified
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-grid-2col">
        <div className="profile-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Account Type</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Premier Banking</div>
          <button style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.75rem', padding: 0 }}>View Benefits</button>
        </div>
        <div className="profile-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Member Since</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>October 2007</div>
        </div>
      </div>
      <button onClick={handleSignOut} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.875rem', border: '1px solid #f1f5f9', background: '#fff', color: '#475569', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'background 0.15s' }}>
        <LogOut size={16} /> Sign Out Securely
      </button>
    </motion.div>
  );
}
