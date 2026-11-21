/**
 * Loan Service
 * Manages loan catalog, EMI calculations, and customer loan applications.
 * Connected directly to Spring Boot backend APIs.
 */
import api from './api';
import { INITIAL_LOAN_PRODUCTS } from '../data/mockData';

export const loanService = {
  getLoanProducts: () => INITIAL_LOAN_PRODUCTS,

  getUserLoans: async () => {
    const response = await api.get('/loans/my-loans');
    return response.data.map(loanService.mapLoanResponse);
  },

  calculateEMI: (principal, annualInterestRate, tenureMonths) => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(annualInterestRate);
    const N = parseInt(tenureMonths, 10);

    if (isNaN(P) || isNaN(annualRate) || isNaN(N) || P <= 0 || annualRate <= 0 || N <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const r = annualRate / 12 / 100; // monthly interest rate
    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  },

  applyForLoan: async (applicationData) => {
    const { loanType, amount, durationMonths, purpose } = applicationData;

    const numAmount = parseFloat(amount);
    const numTenure = parseInt(durationMonths, 10);

    if (!loanType) throw new Error('Please select a loan type');
    if (isNaN(numAmount) || numAmount < 1000) {
      throw new Error('Minimum loan application amount is ₹1,000');
    }
    if (isNaN(numTenure) || numTenure < 6 || numTenure > 360) {
      throw new Error('Loan tenure must be between 6 and 360 months');
    }

    const cleanPurpose = purpose && purpose.trim().length >= 3 ? purpose.trim() : `${loanType} Application`;

    const payload = {
      loanAmount: numAmount,
      tenureMonths: numTenure,
      purpose: cleanPurpose,
    };

    const response = await api.post('/loans', payload);
    return loanService.mapLoanResponse(response.data);
  },

  mapLoanResponse: (loan) => {
    const amount = Number(loan.loanAmount ?? loan.amount ?? 0);
    const tenure = Number(loan.tenureMonths ?? loan.durationMonths ?? 12);
    const rate = Number(loan.interestRate ?? 10.5);
    const { emi } = loanService.calculateEMI(amount, rate, tenure);

    return {
      id: loan.id,
      loanId: loan.id,
      loanType: loan.purpose || 'Personal Loan',
      amount,
      loanAmount: amount,
      interestRate: rate,
      durationMonths: tenure,
      tenureMonths: tenure,
      monthlyEmi: emi,
      purpose: loan.purpose,
      status: loan.status,
      applicationDate: loan.applicationDate,
      appliedDate: loan.applicationDate ? new Date(loan.applicationDate).toLocaleDateString('en-IN') : 'Recent',
      adminRemarks: loan.adminRemarks || '',
    };
  },
};
