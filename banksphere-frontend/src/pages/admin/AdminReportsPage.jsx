import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  FileSpreadsheet,
  Building,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';

const AdminReportsPage = () => {
  const [reportsData, setReportsData] = useState(null);
  const monthlyChartData = adminService.getMonthlyChartData();

  useEffect(() => {
    adminService.getReportsData().then(setReportsData);
  }, []);

  const customerGrowthData = [
    { month: 'Jun', totalCustomers: 1040, newSignups: 45 },
    { month: 'Jul', totalCustomers: 1088, newSignups: 48 },
    { month: 'Aug', totalCustomers: 1142, newSignups: 54 },
    { month: 'Sep', totalCustomers: 1190, newSignups: 48 },
    { month: 'Oct', totalCustomers: 1215, newSignups: 25 },
    { month: 'Nov', totalCustomers: 1248, newSignups: 33 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Banking Audit & Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Financial analytics, credit risk distribution, customer acquisition trends, and reserve reports
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Executive Audit</span>
        </button>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Clearing vs Retained Reserves */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gross Clearing vs Operational Expenses</h3>
              <p className="text-xs text-slate-400">Total volume turnover (INR)</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              CY 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Total Customer Credits" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Total Customer Debits" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth Trajectory */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Customer Onboarding Growth</h3>
              <p className="text-xs text-slate-400">Active net banking subscribers</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              1,248 Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="totalCustomers"
                  name="Total Registered Customers"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="newSignups"
                  name="Monthly New Signups"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Report Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print-area">
        {/* Monthly Turnover Summary */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">Monthly Clearing Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3 text-right">Deposits</th>
                  <th className="py-2.5 px-3 text-right">Withdrawals</th>
                  <th className="py-2.5 px-3 text-right">Net Vault Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reportsData?.monthlyTurnover?.map((item) => (
                  <tr key={item.month}>
                    <td className="py-2.5 px-3 font-semibold">{item.month}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-600">
                      {formatCurrency(item.deposits)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatCurrency(item.withdrawals)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                      +{formatCurrency(item.netReserve)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loan Disbursal Portfolio */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">Credit Lending Portfolio</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-center">Accounts</th>
                  <th className="py-2.5 px-3 text-right">Disbursed Volume</th>
                  <th className="py-2.5 px-3 text-right">NPA / Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reportsData?.loanDisbursementSummary?.map((item) => (
                  <tr key={item.category}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.category}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{item.disbursedCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(item.totalAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-medium">
                      {item.defaultRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
