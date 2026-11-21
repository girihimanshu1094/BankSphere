/**
 * Beneficiary Service
 * Manages beneficiary CRUD operations and validations.
 * Connected directly to Spring Boot backend APIs.
 */
import api from './api';
import { isValidAccountNumber } from '../utils/validators';

const mapBeneficiaryResponse = (b) => ({
  id: b.id,
  name: b.beneficiaryName,
  beneficiaryName: b.beneficiaryName,
  nickname: b.nickname || (b.beneficiaryName ? b.beneficiaryName.split(' ')[0] : 'Payee'),
  accountNumber: b.accountNumber,
  bankName: 'BankSphere Inter-Bank',
  ifscCode: 'BSPH0001042',
  addedOn: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : 'Recent',
  status: 'Verified',
});

export const beneficiaryService = {
  getBeneficiaries: async () => {
    try {
      const response = await api.get('/beneficiaries');
      return (response.data || []).map(mapBeneficiaryResponse);
    } catch (err) {
      console.warn('Could not load beneficiaries from server', err.message);
      return [];
    }
  },

  addBeneficiary: async (data) => {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Please enter a valid beneficiary name');
    }
    if (!isValidAccountNumber(data.accountNumber)) {
      throw new Error('Account number must be between 9 and 18 numeric digits');
    }
    if (data.confirmAccountNumber && data.accountNumber !== data.confirmAccountNumber) {
      throw new Error('Account numbers do not match');
    }

    const payload = {
      beneficiaryName: data.name.trim(),
      accountNumber: data.accountNumber.trim(),
      nickname: data.nickname ? data.nickname.trim() : data.name.trim().split(' ')[0],
    };

    const response = await api.post('/beneficiaries', payload);
    return mapBeneficiaryResponse(response.data);
  },

  updateBeneficiary: async (id, updatedData) => {
    const payload = {
      beneficiaryName: updatedData.name || '',
      accountNumber: updatedData.accountNumber || '',
      nickname: updatedData.nickname || updatedData.name || '',
    };
    const response = await api.put(`/beneficiaries/${id}`, payload);
    return mapBeneficiaryResponse(response.data);
  },

  deleteBeneficiary: async (id) => {
    await api.delete(`/beneficiaries/${id}`);
    return { success: true };
  },
};
