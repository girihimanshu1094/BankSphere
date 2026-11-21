import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

const VARIANTS = {
  danger: {
    icon: AlertCircle,
    iconColor: 'text-rose-600 bg-rose-50 border-rose-200',
    confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
    confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
    confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  },
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
  children,
}) => {
  const currentVariant = VARIANTS[variant] || VARIANTS.warning;
  const Icon = currentVariant.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={!loading}>
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-3 ${currentVariant.iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        {message && <p className="text-sm text-slate-500 mt-1">{message}</p>}

        {children && <div className="w-full mt-3 text-left">{children}</div>}

        <div className="flex items-center gap-3 w-full mt-6">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 ${currentVariant.confirmBtn}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
