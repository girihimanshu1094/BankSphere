/**
 * Common validation utilities for banking forms
 */

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPhone = (phone) => {
  // 10 digits Indian mobile format
  const re = /^[6-9]\d{9}$/;
  return re.test(String(phone).replace(/\D/g, ''));
};

export const isValidIFSC = (ifsc) => {
  // Standard format: 4 letters, 0, 6 alphanumeric
  const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return re.test(String(ifsc).toUpperCase().trim());
};

export const isValidAccountNumber = (accNo) => {
  const str = String(accNo).trim();
  return /^\d{9,18}$/.test(str);
};

export const validateAmount = (amount, availableBalance) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return 'Please enter a valid numeric amount';
  if (num <= 0) return 'Amount must be greater than zero';
  if (availableBalance !== undefined && num > availableBalance) {
    return 'Transfer amount cannot exceed available balance';
  }
  return null;
};
