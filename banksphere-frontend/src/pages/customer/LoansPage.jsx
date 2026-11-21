import React, { useState } from 'react';
import {
  BadgePercent,
  Calculator,
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import StatusBadge from '../../components/common/StatusBadge';
import { useBankData } from '../../context/BankDataContext';
import { loanService } from '../../services/loanService';
import { formatCurrency } from '../../utils/formatters';

const LoansPage = () => {
  const { loans, applyForLoan, loading } = useBankData();
  const loanProducts = loanService.getLoanProducts();

  // Tab State
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'applications', 'calculator'

  // Application Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    loanType: 'Personal Loan',
    amount: '300000',
    durationMonths: '24',
    employmentStatus: 'Salaried (Private / MNC)',
    monthlyIncome: '75000',
    purpose: '',
  });

  const [formError, setFormError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  // EMI Calculator State
  const [calcPrincipal, setCalcPrincipal] = useState(500000);
  const [calcRate, setCalcRate] = useState(8.5);
  const [calcTenure, setCalcTenure] = useState(36);

  const emiResult = loanService.calculateEMI(calcPrincipal, calcRate, calcTenure);

  const handleOpenApply = (product) => {
    setSelectedProduct(product);
    setFormData({
      loanType: product.name,
      amount: String(Math.min(product.minAmount * 2, 500000)),
      durationMonths: String(Math.min(product.minTenureMonths * 2, 36)),
      employmentStatus: 'Salaried (Private / MNC)',
      monthlyIncome: '75000',
      purpose: '',
    });
    setFormError('');
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const result = await applyForLoan(formData);
      setApplicationSuccess(result);
      setApplyModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Application failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Loans & Financial Services</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore customized lending solutions, compute monthly EMIs, and track application sanctions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Available Loan Products
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Applications
          {loans.length > 0 && (
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {loans.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive EMI Calculator</span>
        </button>
      </div>

      {/* TAB 1: AVAILABLE PRODUCTS */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loanProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{prod.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Fixed / Floating Competitive Rate</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-blue-700">
                      {prod.interestRate}%
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">p.a. onwards</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 bg-slate-50/60 rounded-lg px-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Maximum Sanction</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(prod.maxAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tenure Flexibility</span>
                    <span className="font-semibold text-slate-900">
                      {prod.minTenureMonths / 12} to {prod.maxTenureMonths / 12} Years
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
                    Product Features
                  </span>
                  {prod.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">Processing Fee: {prod.processingFee}</span>
                <button
                  onClick={() => handleOpenApply(prod)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Apply Online
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MY LOAN APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loans.length > 0 ? (
            loans.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <BadgePercent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{app.loanType}</h3>
                      <p className="text-xs text-slate-400 font-mono">Ref: {app.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Applied: {app.appliedDate}</span>
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Requested Principal</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(app.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Monthly EMI</span>
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      {formatCurrency(app.monthlyEmi)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Interest Rate</span>
                    <span className="font-semibold text-slate-800">{app.interestRate}% p.a.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Repayment Tenure</span>
                    <span className="font-semibold text-slate-800">{app.durationMonths} Months</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Purpose: </span>
                  {app.purpose}
                </div>

                {app.adminRemarks && (
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-700">
                    <span className="font-semibold text-blue-900 block mb-0.5">
                      Bank Evaluation / Remarks:
                    </span>
                    {app.adminRemarks}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <FileCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">No active applications</h3>
              <p className="text-xs text-slate-400 mt-1">
                Select a product from the Loan Products tab and submit your online request.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EMI CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">EMI & Interest Estimator</h3>

            {/* Principal Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Loan Amount (Principal)
                </label>
                <span className="text-base font-bold font-mono text-blue-700">
                  {formatCurrency(calcPrincipal)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="25000"
                value={calcPrincipal}
                onChange={(e) => setCalcPrincipal(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹50,000</span>
                <span>₹50,00,000</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Interest Rate (% p.a.)
                </label>
                <span className="text-base font-bold font-mono text-blue-700">{calcRate}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="18"
                step="0.25"
                value={calcRate}
                onChange={(e) => setCalcRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>6.0%</span>
                <span>18.0%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Loan Tenure (Months)
                </label>
                <span className="text-base font-bold font-mono text-blue-700">
                  {calcTenure} Months ({(calcTenure / 12).toFixed(1)} Yrs)
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="240"
                step="6"
                value={calcTenure}
                onChange={(e) => setCalcTenure(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>6 Months</span>
                <span>20 Years (240 Mo)</span>
              </div>
            </div>
          </div>

          {/* EMI Calculation Summary Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Monthly Repayment</span>
              <div className="text-3xl font-bold font-mono text-blue-400 mt-1">
                {formatCurrency(emiResult.emi)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Estimated Equated Monthly Installment</p>

              <div className="mt-6 space-y-3 border-t border-slate-800 pt-4 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Principal Amount</span>
                  <span className="font-mono font-semibold">{formatCurrency(calcPrincipal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Interest Payable</span>
                  <span className="font-mono font-semibold text-amber-400">
                    {formatCurrency(emiResult.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Total Repayment Amount</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCurrency(emiResult.totalPayment)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  setActiveTab('products');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Apply for Loan at this Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${formData.loanType}`}
        subtitle="Submit digital application for quick credit appraisal"
        size="md"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <FormSelect
            label="Selected Product"
            value={formData.loanType}
            onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
            options={loanProducts.map((p) => p.name)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Requested Amount (INR)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g. 500000"
              min="10000"
              required
            />
            <FormSelect
              label="Repayment Duration"
              value={formData.durationMonths}
              onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
              options={[
                { value: '12', label: '12 Months (1 Year)' },
                { value: '24', label: '24 Months (2 Years)' },
                { value: '36', label: '36 Months (3 Years)' },
                { value: '48', label: '48 Months (4 Years)' },
                { value: '60', label: '60 Months (5 Years)' },
                { value: '120', label: '120 Months (10 Years)' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormSelect
              label="Employment Category"
              value={formData.employmentStatus}
              onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
              options={[
                'Salaried (Private / MNC)',
                'Salaried (Govt / PSU)',
                'Self-Employed Professional (CA, Doctor, Tech)',
                'Business Owner / Entrepreneur',
                'Student (with Co-borrower)',
              ]}
              required
            />
            <FormInput
              label="Net Monthly Income (INR)"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              placeholder="e.g. 85000"
              required
            />
          </div>

          <FormInput
            label="Purpose of Loan"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="e.g. Higher education tuition / Home remodeling"
            required
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="flex-1 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Success Notification Modal */}
      {applicationSuccess && (
        <Modal
          isOpen={!!applicationSuccess}
          onClose={() => setApplicationSuccess(null)}
          title="Application Dispatched"
          size="sm"
        >
          <div className="text-center py-2 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Application Registered</h4>
            <p className="text-xs text-slate-600">
              Your application for <span className="font-semibold">{applicationSuccess.loanType}</span> ({formatCurrency(applicationSuccess.amount)}) has been recorded with reference{' '}
              <span className="font-mono font-bold text-slate-900">{applicationSuccess.id}</span>.
            </p>
            <p className="text-[11px] text-slate-400">
              You can log in as Admin to approve or reject this request to see live synchronization!
            </p>
            <button
              onClick={() => {
                setApplicationSuccess(null);
                setActiveTab('applications');
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
            >
              View in My Applications
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoansPage;
