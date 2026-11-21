/**
 * Admin Service
 * Handles administrative actions: customer management (block/unblock),
 * loan approvals/rejections, complaint handling, and banking audit reports.
 */
import api from './api';
import { INITIAL_ADMIN_STATS, INITIAL_MONTHLY_CHART_DATA } from '../data/mockData';

export const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch {
      // In case dashboard endpoint is loading or fallback
      const [loansRes, complaintsRes] = await Promise.allSettled([
        api.get('/admin/loans'),
        api.get('/admin/complaints'),
      ]);
      const loans = loansRes.status === 'fulfilled' ? loansRes.value.data : [];
      const complaints = complaintsRes.status === 'fulfilled' ? complaintsRes.value.data : [];
      const pendingLoans = loans.filter((l) => (l.status || '').toUpperCase() === 'PENDING').length;
      const pendingComplaints = complaints.filter(
        (c) => (c.status || '').toUpperCase() !== 'RESOLVED' && (c.status || '').toUpperCase() !== 'CLOSED'
      ).length;

      return {
        ...INITIAL_ADMIN_STATS,
        pendingLoansCount: pendingLoans,
        pendingComplaintsCount: pendingComplaints,
      };
    }
  },

  getAllCustomers: async () => {
    const response = await api.get('/admin/customers');
    return response.data;
  },

  blockCustomer: async (customerId, reason = 'Administrative / Security Hold') => {
    const response = await api.put(`/admin/customers/${customerId}/status`, {
      enabled: false,
      reason,
    });
    return response.data;
  },

  unblockCustomer: async (customerId) => {
    const response = await api.put(`/admin/customers/${customerId}/status`, {
      enabled: true,
    });
    return response.data;
  },

  addCustomer: async (customerData) => {
    const response = await api.post('/admin/customers', customerData);
    return response.data;
  },

  getAllAccounts: async () => {
    const response = await api.get('/admin/accounts');
    return response.data;
  },

  getAllTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  },

  // REAL admin loan fetching
  getAllLoans: async () => {
    const response = await api.get('/admin/loans');
    return response.data;
  },

  // Update loan status using backend endpoint (approved boolean)
  updateLoanStatus: async (loanId, newStatus, adminRemarks = '') => {
    const approved =
      newStatus === 'Approved' || newStatus === 'APPROVED' || newStatus === true;
    const response = await api.put(`/admin/loans/${loanId}/decision`, { approved });
    return response.data;
  },

  // REAL admin complaint fetching
  getAllComplaints: async () => {
    const response = await api.get('/admin/complaints');
    return response.data;
  },

  // Update complaint status using backend endpoint
  updateComplaintStatus: async (complaintId, newStatus, responseText = '') => {
    // Map status string to Complaint.ComplaintStatus enum (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
    let statusEnum = 'IN_PROGRESS';
    const norm = (newStatus || '').toUpperCase().replace(/[\s-]/g, '_');
    if (norm.includes('OPEN') || norm.includes('SUBMITTED')) {
      statusEnum = 'OPEN';
    } else if (norm.includes('RESOLV')) {
      statusEnum = 'RESOLVED';
    } else if (norm.includes('CLOSE')) {
      statusEnum = 'CLOSED';
    } else {
      statusEnum = 'IN_PROGRESS';
    }

    const response = await api.put(`/admin/complaints/${complaintId}/status`, {
      status: statusEnum,
    });
    return response.data;
  },

  getMonthlyChartData: () => INITIAL_MONTHLY_CHART_DATA,

  getReportsData: async () => {
    return {
      monthlyTurnover: [
        { month: 'Jun 2026', deposits: 42500000, withdrawals: 38200000, netReserve: 4300000 },
        { month: 'Jul 2026', deposits: 48900000, withdrawals: 41000000, netReserve: 7900000 },
        { month: 'Aug 2026', deposits: 51200000, withdrawals: 43500000, netReserve: 7700000 },
        { month: 'Sep 2026', deposits: 56000000, withdrawals: 49000000, netReserve: 7000000 },
        { month: 'Oct 2026', deposits: 61800000, withdrawals: 52100000, netReserve: 9700000 },
        { month: 'Nov 2026', deposits: 67400000, withdrawals: 54900000, netReserve: 12500000 },
      ],
      loanDisbursementSummary: [
        { category: 'Personal Loans', disbursedCount: 84, totalAmount: 18900000, defaultRate: '1.2%' },
        { category: 'Education Loans', disbursedCount: 42, totalAmount: 15400000, defaultRate: '0.4%' },
        { category: 'Home Loans', disbursedCount: 110, totalAmount: 78500000, defaultRate: '0.6%' },
        { category: 'Vehicle Loans', disbursedCount: 65, totalAmount: 14200000, defaultRate: '0.9%' },
      ],
    };
  },
};
