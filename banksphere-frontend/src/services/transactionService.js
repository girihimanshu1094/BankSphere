/**
 * Transaction Service
 * Manages money transfers, transaction history retrieval, search/filter, and statement generation.
 * Connected directly to Spring Boot backend APIs.
 */
import api from './api';

const mapTransactionResponse = (txn) => {
  const isCredit = (txn.type || '').toUpperCase() === 'RECEIVED';
  return {
    id: txn.transactionReference,
    date: txn.transactionDate,
    description:
      txn.description ||
      (isCredit ? `Received from ${txn.otherAccountNumber}` : `Transfer to ${txn.otherAccountNumber}`),
    type: isCredit ? 'Credit' : 'Debit',
    category: 'Transfer',
    amount: Number(txn.amount || 0),
    status: (txn.status || 'SUCCESS').toUpperCase() === 'SUCCESS' ? 'Successful' : txn.status,
    referenceNo: txn.transactionReference,
    beneficiaryName: txn.otherAccountNumber || 'Direct Clearing',
    beneficiaryAccount: txn.otherAccountNumber,
    accountNumber: txn.otherAccountNumber,
  };
};

export const transactionService = {
  getTransactions: async (filters = {}) => {
    try {
      const response = await api.get('/transactions/history');
      let txns = (response.data || []).map(mapTransactionResponse);

      if (filters.search) {
        const q = filters.search.toLowerCase();
        txns = txns.filter(
          (t) =>
            t.description.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q) ||
            (t.beneficiaryName && t.beneficiaryName.toLowerCase().includes(q)) ||
            (t.referenceNo && t.referenceNo.toLowerCase().includes(q))
        );
      }

      if (filters.type && filters.type !== 'All') {
        txns = txns.filter((t) => t.type.toLowerCase() === filters.type.toLowerCase());
      }

      if (filters.status && filters.status !== 'All') {
        txns = txns.filter((t) => t.status.toLowerCase() === filters.status.toLowerCase());
      }

      if (filters.startDate) {
        const start = new Date(filters.startDate).getTime();
        txns = txns.filter((t) => new Date(t.date).getTime() >= start);
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        txns = txns.filter((t) => new Date(t.date).getTime() <= end.getTime());
      }

      return txns;
    } catch (err) {
      console.warn('Could not load transaction history from server', err.message);
      return [];
    }
  },

  transferMoney: async ({
    sourceAccountNumber,
    beneficiaryName,
    beneficiaryAccountNumber,
    bankName = 'BankSphere Inter-Bank',
    ifscCode = 'BSPH0001042',
    amount,
    remarks = 'Fund Transfer',
    transferType = 'IMPS',
  }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Please enter a valid amount greater than zero');
    }

    if (!beneficiaryAccountNumber || !beneficiaryAccountNumber.trim()) {
      throw new Error('Receiver account number is required');
    }

    const payload = {
      receiverAccountNumber: beneficiaryAccountNumber.trim(),
      amount: numAmount,
      description: remarks ? `${transferType}: ${remarks}` : `${transferType} to ${beneficiaryName || beneficiaryAccountNumber}`,
    };

    const response = await api.post('/transfers', payload);
    const data = response.data;

    const newTxn = {
      id: data.transactionReference,
      accountNumber: data.senderAccountNumber || sourceAccountNumber,
      date: data.transactionDate || new Date().toISOString(),
      description: payload.description,
      type: 'Debit',
      category: 'Transfer',
      amount: Number(data.amount),
      status: (data.status || 'SUCCESS').toUpperCase() === 'SUCCESS' ? 'Successful' : data.status,
      referenceNo: data.transactionReference,
      beneficiaryName: beneficiaryName || data.receiverAccountNumber,
      beneficiaryAccount: data.receiverAccountNumber,
      bankName,
      ifscCode,
      remarks,
    };

    return {
      success: true,
      transaction: newTxn,
      remainingBalance: Number(data.remainingBalance),
    };
  },

  downloadStatementCSV: (transactions, filename = 'BankSphere_Account_Statement.csv') => {
    const headers = [
      'Transaction ID',
      'Date & Time',
      'Description',
      'Type',
      'Category',
      'Amount (INR)',
      'Status',
      'Reference Number',
      'Beneficiary',
    ];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${new Date(t.date).toLocaleString('en-IN')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category || ''}"`,
      `"${t.amount}"`,
      `"${t.status}"`,
      `"${t.referenceNo || ''}"`,
      `"${(t.beneficiaryName || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
