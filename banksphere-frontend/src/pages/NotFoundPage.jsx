import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
  const { isAuthenticated, role } = useAuth();
  const homePath = isAuthenticated
    ? role === 'ADMIN'
      ? '/admin/dashboard'
      : '/customer/dashboard'
    : '/login';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-4xl font-extrabold text-slate-900 font-mono">404</span>
        <h2 className="text-lg font-bold text-slate-900 mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The requested banking portal route does not exist or has been relocated.
        </p>
        <Link
          to={homePath}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
