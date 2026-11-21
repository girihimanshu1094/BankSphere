import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, Building2 } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Brand Bar */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200">
        <Link to="/login" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Bank<span className="text-blue-600">Sphere</span>
            </span>
            <p className="text-[10px] text-slate-500 font-mono">ONLINE BANKING PORTAL</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          
      
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Academic / Banking Compliance Footer */}
      <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>© 2026 BankSphere</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
