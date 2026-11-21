import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Send,
  History,
  Users,
  BadgePercent,
  MessageSquareWarning,
  Bell,
  User,
  LogOut,
  Building2,
  FileCheck2,
  BarChart3,
  X,
  Wallet,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBankData } from '../../context/BankDataContext';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

const Sidebar = ({ isOpen, onClose }) => {
  const { role, logout, user } = useAuth();
  const { unreadNotificationCount, loans, complaints, primaryAccount } = useBankData();
  const navigate = useNavigate();

  const isAdmin = role === 'ADMIN';

  const pendingLoansCount = loans.filter((l) => l.status === 'Pending').length;
  const pendingComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const customerLinks = [
    { name: 'Dashboard', to: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Account', to: '/customer/my-account', icon: CreditCard },
    { name: 'Transfer Money', to: '/customer/transfer', icon: Send },
    { name: 'Transactions', to: '/customer/transactions', icon: History },
    { name: 'Beneficiaries', to: '/customer/beneficiaries', icon: Users },
    { name: 'Loans & EMI', to: '/customer/loans', icon: BadgePercent },
    { name: 'Complaints', to: '/customer/complaints', icon: MessageSquareWarning },
    {
      name: 'Notifications',
      to: '/customer/notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    { name: 'Profile', to: '/customer/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Customers', to: '/admin/customers', icon: Users },
    { name: 'Accounts', to: '/admin/accounts', icon: Building2 },
    { name: 'Transactions', to: '/admin/transactions', icon: History },
    {
      name: 'Loan Requests',
      to: '/admin/loans',
      icon: FileCheck2,
      badge: pendingLoansCount > 0 ? pendingLoansCount : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      name: 'Complaints Desk',
      to: '/admin/complaints',
      icon: ShieldAlert,
      badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    { name: 'Reports & Audit', to: '/admin/reports', icon: BarChart3 },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              BS
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-base">BankSphere</span>
              <p className="text-[10px] text-slate-400 -mt-1 font-mono">
                {isAdmin ? 'ADMIN CONTROL' : 'NETBANKING'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'Management Menu' : 'Customer Services'}
          </div>

          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Card & Quick Balance */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          {!isAdmin && primaryAccount ? (
            <div className="mb-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span className="flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-blue-400" /> Primary Balance
                </span>
                <span className="font-mono text-[10px]">{maskAccountNumber(primaryAccount.accountNumber)}</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {formatCurrency(primaryAccount.balance)}
              </div>
            </div>
          ) : (
            <div className="mb-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="text-[10px] text-amber-400 font-semibold block uppercase">
                Bank Operations Center
              </span>
              <span className="text-xs text-white font-medium block truncate">
                {user?.name || 'Administrator'}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
