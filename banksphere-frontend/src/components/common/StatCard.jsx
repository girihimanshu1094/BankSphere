import React from 'react';

const COLOR_VARIANTS = {
  blue: {
    bg: 'bg-blue-50 text-blue-600',
    border: 'border-slate-200 hover:border-blue-300',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600',
    border: 'border-slate-200 hover:border-emerald-300',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600',
    border: 'border-slate-200 hover:border-amber-300',
  },
  navy: {
    bg: 'bg-slate-900 text-white',
    border: 'border-slate-200 hover:border-slate-400',
  },
  purple: {
    bg: 'bg-purple-50 text-purple-600',
    border: 'border-slate-200 hover:border-purple-300',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = 'blue',
  badge,
  onClick,
  className = '',
}) => {
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border p-5 shadow-sm transition-all duration-200 ${variant.border} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${variant.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center text-xs text-slate-500">
          {trend && (
            <span
              className={`font-semibold mr-1.5 ${
                trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend}
            </span>
          )}
          <span>{trendLabel || subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
