/**
 * Complaint Service
 * Manages grievance submissions and complaint tracking.
 * Connected directly to Spring Boot backend APIs.
 */
import api from './api';

export const COMPLAINT_CATEGORIES = [
  'Transaction Failure',
  'Debit / ATM Card Issue',
  'Net Banking / Login Issue',
  'Unauthorized Charges / Fraud',
  'Loan Processing Delay',
  'Account & KYC Updation',
  'Branch Service / Staff Grievance',
];

export const mapComplaintResponse = (c) => {
  let category = 'Banking Services';
  let cleanSubject = c.subject || '';
  const match = cleanSubject.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    category = match[1];
    cleanSubject = match[2];
  }

  const rawStatus = (c.status || 'OPEN').toUpperCase();
  let displayStatus = 'Submitted';
  if (rawStatus === 'IN_PROGRESS') displayStatus = 'In Progress';
  else if (rawStatus === 'RESOLVED') displayStatus = 'Resolved';
  else if (rawStatus === 'CLOSED') displayStatus = 'Closed';

  return {
    id: `CMP-${c.id}`,
    numericId: c.id,
    subject: cleanSubject || c.subject,
    rawSubject: c.subject,
    category,
    description: c.description,
    submittedDate: c.createdAt,
    status: displayStatus,
    rawStatus: c.status,
    adminResponse:
      rawStatus === 'RESOLVED'
        ? 'Your grievance has been successfully addressed and resolved by the operations committee.'
        : rawStatus === 'IN_PROGRESS'
        ? 'Case assigned to an officer and is currently under active investigation.'
        : 'Your complaint has been acknowledged by the BankSphere Helpdesk team and is queued for evaluation.',
    resolvedDate: rawStatus === 'RESOLVED' ? c.updatedAt : null,
  };
};

export const complaintService = {
  getCategories: () => COMPLAINT_CATEGORIES,

  getComplaints: async () => {
    try {
      const response = await api.get('/complaints/my-complaints');
      return (response.data || []).map(mapComplaintResponse);
    } catch (err) {
      console.warn('Could not load complaints from server', err.message);
      return [];
    }
  },

  submitComplaint: async (complaintData) => {
    const { category, subject, description } = complaintData;

    if (!category) throw new Error('Please select a complaint category');
    if (!subject || subject.trim().length < 5) throw new Error('Subject must be at least 5 characters');
    if (!description || description.trim().length < 10) {
      throw new Error('Please provide a detailed description (minimum 10 characters)');
    }

    const payload = {
      subject: `[${category}] ${subject.trim()}`,
      description: description.trim(),
    };

    const response = await api.post('/complaints', payload);
    return mapComplaintResponse(response.data);
  },
};
