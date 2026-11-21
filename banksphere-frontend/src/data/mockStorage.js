/**
 * LocalStorage sync manager for BankSphere
 * Enables realistic persistent state across sessions and between Customer and Admin roles.
 */
import {
  INITIAL_USER,
  INITIAL_ADMIN,
  INITIAL_ACCOUNTS,
  INITIAL_BENEFICIARIES,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_LOANS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ALL_CUSTOMERS,
} from './mockData';

const STORAGE_KEYS = {
  USER: 'banksphere_user',
  ACCOUNTS: 'banksphere_accounts',
  BENEFICIARIES: 'banksphere_beneficiaries',
  TRANSACTIONS: 'banksphere_transactions',
  LOANS: 'banksphere_loans',
  COMPLAINTS: 'banksphere_complaints',
  NOTIFICATIONS: 'banksphere_notifications',
  CUSTOMERS: 'banksphere_all_customers',
  AUTH: 'banksphere_current_auth',
};

const getOrInit = (key, initialValue) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return initialValue;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
};

export const mockStorage = {
  getUser: () => getOrInit(STORAGE_KEYS.USER, INITIAL_USER),
  saveUser: (user) => setItem(STORAGE_KEYS.USER, user),

  getAccounts: () => getOrInit(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS),
  saveAccounts: (accounts) => setItem(STORAGE_KEYS.ACCOUNTS, accounts),

  getBeneficiaries: () => getOrInit(STORAGE_KEYS.BENEFICIARIES, INITIAL_BENEFICIARIES),
  saveBeneficiaries: (bens) => setItem(STORAGE_KEYS.BENEFICIARIES, bens),

  getTransactions: () => getOrInit(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  saveTransactions: (txns) => setItem(STORAGE_KEYS.TRANSACTIONS, txns),

  getLoans: () => getOrInit(STORAGE_KEYS.LOANS, INITIAL_USER_LOANS),
  saveLoans: (loans) => setItem(STORAGE_KEYS.LOANS, loans),

  getComplaints: () => getOrInit(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS),
  saveComplaints: (complaints) => setItem(STORAGE_KEYS.COMPLAINTS, complaints),

  getNotifications: () => getOrInit(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (notifs) => setItem(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getCustomers: () => getOrInit(STORAGE_KEYS.CUSTOMERS, INITIAL_ALL_CUSTOMERS),
  saveCustomers: (customers) => setItem(STORAGE_KEYS.CUSTOMERS, customers),

  getAuth: () => {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
      return auth ? JSON.parse(auth) : null;
    } catch {
      return null;
    }
  },
  saveAuth: (auth) => {
    if (auth) {
      setItem(STORAGE_KEYS.AUTH, auth);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  },

  resetAllData: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  },
};
