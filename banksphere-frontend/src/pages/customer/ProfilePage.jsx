import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import FormInput from '../../components/forms/FormInput';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPhone } from '../../utils/validators';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'security'

  // Personal Info Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    occupation: user?.occupation || 'Account Holder',
    dob: user?.dob || '1995-01-01',
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Security Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess('');

    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !isValidEmail(formData.email)) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || !isValidPhone(formData.phone)) errs.phone = 'Valid phone is required';
    if (!formData.address.trim()) errs.address = 'Residential address is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      setSaveSuccess('Profile information updated successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordSuccess('Password security updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Account Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, KYC status, and security credentials
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center shadow-xs">
            {formData.name
              ? formData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
              : 'BS'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{formData.name}</h2>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                KYC VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer ID: <span className="font-mono font-medium text-slate-700">{user?.customerId || 'BSPH-CUST-8492'}</span>
            </p>
            <p className="text-xs text-slate-400">Occupation: {formData.occupation}</p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-500 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <p>
            PAN Card: <span className="font-mono font-bold text-slate-800">{user?.panNumber || 'ABCPS1234F'}</span>
          </p>
          <p className="mt-0.5">
            Aadhaar: <span className="font-mono font-bold text-slate-800">{user?.aadhaarNumber || '•••• •••• 9812'}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'personal'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* TAB 1: PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {saveSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {errors.server && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {errors.server}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                error={errors.name}
                required
              />
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                error={errors.email}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Registered Mobile"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                error={errors.phone}
                required
              />
              <FormInput
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                icon={Calendar}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Current Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                icon={Briefcase}
              />
              <FormInput
                label="Customer Identifier"
                value={user?.customerId || 'BSPH-CUST-8492'}
                disabled
                helperText="Permanent bank-assigned customer ID"
              />
            </div>

            <FormInput
              label="Communication Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              icon={MapPin}
              error={errors.address}
              required
            />

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">Update Net Banking Password</h3>
          <p className="text-xs text-slate-500 mb-5">
            Passwords must be at least 6 characters long and changed periodically
          </p>

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <FormInput
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
            />

            <FormInput
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Minimum 6 characters"
              required
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              placeholder="Re-type new password"
              required
            />

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
