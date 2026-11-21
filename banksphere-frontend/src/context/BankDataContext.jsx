import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { beneficiaryService } from '../services/beneficiaryService';
import { loanService } from '../services/loanService';
import { complaintService, mapComplaintResponse } from '../services/complaintService';
import { notificationService } from '../services/notificationService';
import { adminService } from '../services/adminService';

const BankDataContext = createContext(null);

export const BankDataProvider = ({ children }) => {
  const { isAuthenticated, role } = useAuth();

  // Core state – initialize with empty collections, NOT mock storage
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loans, setLoans] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Admin loan state
  const [adminLoans, setAdminLoans] = useState([]);
  const [adminLoansLoading, setAdminLoansLoading] = useState(false);
  const [adminLoansError, setAdminLoansError] = useState(null);

  const fetchAdminLoans = useCallback(async () => {
    setAdminLoansLoading(true);
    setAdminLoansError(null);
    try {
      const data = await adminService.getAllLoans();
      setAdminLoans(data || []);
    } catch (e) {
      console.error('Failed to fetch admin loans', e);
      setAdminLoansError(e);
    } finally {
      setAdminLoansLoading(false);
    }
  }, []);

  // Fetch all live data based on role
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) {
      setAccounts([]);
      setTransactions([]);
      setBeneficiaries([]);
      setLoans([]);
      setComplaints([]);
      setNotifications([]);
      setCustomers([]);
      setAdminLoans([]);
      return;
    }

    setLoading(true);
    try {
      if (role === 'ADMIN') {
        const [loansRes, compRes, custRes, accRes, txnRes] = await Promise.allSettled([
          adminService.getAllLoans(),
          adminService.getAllComplaints(),
          adminService.getAllCustomers(),
          adminService.getAllAccounts(),
          adminService.getAllTransactions(),
        ]);

        if (loansRes.status === 'fulfilled') {
          setAdminLoans(loansRes.value || []);
          setLoans(loansRes.value || []);
        }
        if (compRes.status === 'fulfilled') {
          setComplaints((compRes.value || []).map(mapComplaintResponse));
        }
        if (custRes.status === 'fulfilled') {
          setCustomers(custRes.value || []);
        }
        if (accRes.status === 'fulfilled') {
          setAccounts(accRes.value || []);
        }
        if (txnRes.status === 'fulfilled') {
          setTransactions(
            (txnRes.value || []).map((t) => ({
              id: t.transactionReference || `TXN-${t.id}`,
              date: t.transactionDate,
              accountNumber: t.senderAccountNumber,
              description: t.description || `Transfer to ${t.receiverAccountNumber}`,
              type: 'Debit',
              category: 'Transfer',
              amount: Number(t.amount || 0),
              status: (t.status || 'SUCCESS').toUpperCase() === 'SUCCESS' ? 'Successful' : t.status,
              referenceNo: t.transactionReference,
              beneficiaryName: t.receiverName || t.receiverAccountNumber,
              senderName: t.senderName,
            }))
          );
        }
      } else {
        // CUSTOMER role
        const [accRes, txnRes, benRes, loanRes, compRes, notifRes] = await Promise.allSettled([
          accountService.getAccounts(),
          transactionService.getTransactions(),
          beneficiaryService.getBeneficiaries(),
          loanService.getUserLoans(),
          complaintService.getComplaints(),
          notificationService.getNotifications(),
        ]);

        if (accRes.status === 'fulfilled') setAccounts(accRes.value || []);
        if (txnRes.status === 'fulfilled') setTransactions(txnRes.value || []);
        if (benRes.status === 'fulfilled') setBeneficiaries(benRes.value || []);
        if (loanRes.status === 'fulfilled') setLoans(loanRes.value || []);
        if (compRes.status === 'fulfilled') setComplaints(compRes.value || []);
        if (notifRes.status === 'fulfilled') setNotifications(notifRes.value || []);
      }
    } catch (err) {
      console.warn('Error refreshing banking data', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  // Initial fetch on mount or session change
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0] || null;
  const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Transfer Money
  const transferMoney = async (transferData) => {
    setLoading(true);
    try {
      const result = await transactionService.transferMoney(transferData);
      await refreshData();
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Deposit Money
  const depositMoney = async (accountNumber, amount, remarks) => {
    setLoading(true);
    try {
      const result = await accountService.deposit(accountNumber, amount, remarks);
      await refreshData();
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Withdraw Money
  const withdrawMoney = async (accountNumber, amount, remarks) => {
    setLoading(true);
    try {
      const result = await accountService.withdraw(accountNumber, amount, remarks);
      await refreshData();
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Beneficiary Management
  const addBeneficiary = async (data) => {
    const newBen = await beneficiaryService.addBeneficiary(data);
    await refreshData();
    return newBen;
  };

  const updateBeneficiary = async (id, data) => {
    const updated = await beneficiaryService.updateBeneficiary(id, data);
    await refreshData();
    return updated;
  };

  const deleteBeneficiary = async (id) => {
    await beneficiaryService.deleteBeneficiary(id);
    await refreshData();
  };

  // Loan Management (customer side)
  const applyForLoan = async (loanData) => {
    const newLoan = await loanService.applyForLoan(loanData);
    await refreshData();
    return newLoan;
  };

  // Complaints
  const submitComplaint = async (complaintData) => {
    const newComplaint = await complaintService.submitComplaint(complaintData);
    await refreshData();
    return newComplaint;
  };

  // Notifications
  const markNotificationRead = async (notifId) => {
    await notificationService.markAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotification = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  // ADMIN ACTIONS (loans, customers, complaints)
  const adminApproveLoan = async (loanId, remarks = 'Approved by Credit Committee') => {
    const updated = await adminService.updateLoanStatus(loanId, 'Approved', remarks);
    await fetchAdminLoans();
    await refreshData();
    return updated;
  };

  const adminRejectLoan = async (loanId, reason) => {
    const updated = await adminService.updateLoanStatus(loanId, 'Rejected', reason);
    await fetchAdminLoans();
    await refreshData();
    return updated;
  };

  const adminBlockCustomer = async (customerId, reason) => {
    const updated = await adminService.blockCustomer(customerId, reason);
    await refreshData();
    return updated;
  };

  const adminUnblockCustomer = async (customerId) => {
    const updated = await adminService.unblockCustomer(customerId);
    await refreshData();
    return updated;
  };

  const adminAddCustomer = async (customerData) => {
    const updated = await adminService.addCustomer(customerData);
    await refreshData();
    return updated;
  };

  const adminUpdateComplaint = async (complaintId, newStatus, responseText) => {
    const id = String(complaintId).replace(/\D/g, '') || complaintId;
    const updated = await adminService.updateComplaintStatus(id, newStatus, responseText);
    await refreshData();
    return updated;
  };

  const value = {
    accounts,
    primaryAccount,
    totalBalance,
    transactions,
    beneficiaries,
    loans,
    complaints,
    notifications,
    unreadNotificationCount,
    customers,
    loading,
    refreshData,
    transferMoney,
    depositMoney,
    withdrawMoney,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    applyForLoan,
    submitComplaint,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    // Admin loan state + actions
    adminLoans,
    adminLoansLoading,
    adminLoansError,
    fetchAdminLoans,
    adminApproveLoan,
    adminRejectLoan,
    // Other admin utilities
    adminBlockCustomer,
    adminUnblockCustomer,
    adminAddCustomer,
    adminUpdateComplaint,
    adminService,
  };

  return <BankDataContext.Provider value={value}>{children}</BankDataContext.Provider>;
};

export const useBankData = () => {
  const context = useContext(BankDataContext);
  if (!context) {
    throw new Error('useBankData must be used within a BankDataProvider');
  }
  return context;
};
