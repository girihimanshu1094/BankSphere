/**
 * Account Service
 * Provides methods for fetching accounts, balances, and real deposits/withdrawals.
 * Connected directly to Spring Boot REST API.
 */
import api from './api';

const mapAccountResponse = (data) => {
  if (!data) return null;
  const isSavings = (data.accountType || '').toUpperCase() === 'SAVINGS';
  return {
    id: `ACC-${data.accountNumber}`,
    accountNumber: data.accountNumber,
    accountType: isSavings ? 'Savings Account' : `${data.accountType} Account`,
    balance: Number(data.balance || 0),
    status: (data.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'Active' : data.status,
    isPrimary: true,
    branch: 'Connaught Place, New Delhi',
    ifscCode: 'BSPH0001042',
    openingDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN') : 'Recent',
    nominee: 'Registered Nominee',
    debitCard: {
      cardNumber: '4532 8921 7734 5120',
      cvv: '824',
      expiry: '08/29',
      cardHolder: 'ACCOUNT HOLDER',
      cardType: 'Visa Platinum International',
      status: 'Active',
      dailyLimit: 50000,
    },
  };
};

export const accountService = {
  getAccounts: async () => {
    try {
      const response = await api.get('/accounts/my-account');
      const account = mapAccountResponse(response.data);
      return account ? [account] : [];
    } catch (err) {
      console.warn('Could not load accounts from server', err.message);
      return [];
    }
  },

  getPrimaryAccount: async () => {
    const accounts = await accountService.getAccounts();
    return accounts[0] || null;
  },

  deposit: async (accountNumber, amount, remarks = 'Cash Deposit') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Please enter a valid deposit amount');
    }

    const response = await api.post('/accounts/deposit', {
      amount: numAmount,
      description: remarks || 'Cash Deposit',
    });

    const updated = mapAccountResponse(response.data);
    return { success: true, updatedAccount: updated };
  },

  withdraw: async (accountNumber, amount, remarks = 'ATM / Cash Withdrawal') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Please enter a valid withdrawal amount');
    }

    const response = await api.post('/accounts/withdraw', {
      amount: numAmount,
      description: remarks || 'Cash Withdrawal',
    });

    const updated = mapAccountResponse(response.data);
    return { success: true, updatedAccount: updated };
  },
};
