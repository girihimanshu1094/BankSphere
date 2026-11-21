import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  History,
  FileCheck2,
  ShieldAlert,
  Landmark,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { useBankData } from '../../context/BankDataContext';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

const AdminDashboard = () => {
  const { loans, complaints, customers, transactions } = useBankData();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const chartData = adminService.getMonthlyChartData();

  useEffect(() => {
    adminService.getDashboardStats().then(setStats);
  }, [customers, loans, complaints, transactions]);

  const pendingLoans = loans.filter((l) => (l.status || '').toUpperCase() === 'PENDING');
  const pendingComplaints = complaints.filter(
    (c) => (c.status || '').toUpperCase() !== 'RESOLVED' && (c.status || '').toUpperCase() !== 'CLOSED'
  );

  const customerDistribution = [
    { name: 'Savings Accounts', value: 780 },
    { name: 'Current Accounts', value: 310 },
    { name: 'Fixed Deposits', value: 290 },
    { name: 'Salary Accounts', value: 130 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Core Banking Node: BSPH-HQ-01
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">Bank Administrator Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            System Operations, Customer Onboarding, Credit Approvals & Grievance Governance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/loans')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Review Loans ({pendingLoans.length})</span>
          </button>
          <button
            onClick={() => navigate('/admin/complaints')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Resolve Grievances ({pendingComplaints.length})</span>
          </button>
        </div>
      </div>

      {/* Admin Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Customers"
          value={stats ? stats.totalCustomers.toLocaleString('en-IN') : '1,248'}
          icon={Users}
          color="blue"
          onClick={() => navigate('/admin/customers')}
        />
        <StatCard
          title="Active Accounts"
          value={stats ? stats.totalAccounts.toLocaleString('en-IN') : '1,510'}
          icon={Building2}
          color="navy"
          onClick={() => navigate('/admin/accounts')}
        />
        <StatCard
          title="Total Transactions"
          value={stats ? stats.totalTransactionsCount.toLocaleString('en-IN') : '14,290'}
          icon={History}
          color="emerald"
          onClick={() => navigate('/admin/transactions')}
        />
        <StatCard
          title="Vault Reserves"
          value="₹18.45 Cr"
          subtitle="Tier-1 Capital"
          icon={Landmark}
          color="purple"
        />
        <StatCard
          title="Pending Loans"
          value={pendingLoans.length}
          subtitle="Needs verification"
          icon={FileCheck2}
          color="amber"
          badge={pendingLoans.length > 0 ? 'Action Req' : 'Clear'}
          onClick={() => navigate('/admin/loans')}
        />
        <StatCard
          title="Open Complaints"
          value={pendingComplaints.length}
          subtitle="Customer tickets"
          icon={ShieldAlert}
          color="navy"
          badge={pendingComplaints.length > 0 ? 'Pending' : 'Clear'}
          onClick={() => navigate('/admin/complaints')}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Turnover Volume */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Transaction Turnover & Net Reserves</h3>
              <p className="text-xs text-slate-400">Monthly bank clearing volumes (in INR)</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              +14.2% Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Gross Inflow"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#incomeColor)"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  name="Net Retained"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#netColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Account Types Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Account Composition</h3>
            <p className="text-xs text-slate-400">Distribution across product categories</p>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDistribution}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {customerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {customerDistribution.map((d, idx) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-semibold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Tasks Quick Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Loans Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Pending Loan Applications</h3>
            </div>
            <button
              onClick={() => navigate('/admin/loans')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              Manage ({pendingLoans.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {pendingLoans.length > 0 ? (
              pendingLoans.slice(0, 3).map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-800">{l.id}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="font-medium text-slate-700">{l.loanType}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{l.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">
                      {formatCurrency(l.amount)}
                    </span>
                    <StatusBadge status={l.status} size="xs" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                All loan applications have been audited and resolved!
              </div>
            )}
          </div>
        </div>

        {/* Pending Complaints Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Active Grievance Tickets</h3>
            </div>
            <button
              onClick={() => navigate('/admin/complaints')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              Helpdesk ({pendingComplaints.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {pendingComplaints.length > 0 ? (
              pendingComplaints.slice(0, 3).map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-800">{c.id}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="font-medium text-slate-700">{c.category}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">{c.subject}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={c.status} size="xs" />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {formatDate(c.submittedDate)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                No pending customer complaints awaiting action.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
