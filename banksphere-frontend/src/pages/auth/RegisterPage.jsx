import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import FormInput from '../../components/forms/FormInput';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPhone } from '../../utils/validators';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    dob: '',
    occupation: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Full name must be at least 3 characters';
    }
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.password || formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.address.trim() || formData.address.trim().length < 10) {
      errs.address = 'Please provide a complete postal address';
    }
    if (!formData.dob) {
      errs.dob = 'Date of birth is required for KYC compliance';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    try {
      await register(formData);
      setSuccessMessage('Registration successful! Setting up your banking dashboard...');
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Open an Online Account</h2>
        <p className="text-sm text-slate-500 mt-1">
          Complete the quick registration form to open your digital savings account
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <FormInput
          label="Full Legal Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          icon={User}
          error={errors.fullName}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rahul@example.com"
            icon={Mail}
            error={errors.email}
            required
          />
          <FormInput
            label="Mobile Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile"
            icon={Phone}
            error={errors.phone}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            icon={Calendar}
            error={errors.dob}
            required
          />
          <FormInput
            label="Occupation (Optional)"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
          />
        </div>

        <FormInput
          label="Residential Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Flat / House No, Street, City, State, PIN"
          icon={MapPin}
          error={errors.address}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            icon={Lock}
            error={errors.password}
            required
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-type password"
            icon={Lock}
            error={errors.confirmPassword}
            required
          />
        </div>

        <div className="p-3 bg-blue-50/60 rounded-lg text-xs text-blue-900 border border-blue-100 leading-relaxed">
          <strong>Account Note:</strong> Submitting will create your digital savings account securely in the BankSphere banking database.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating Account...' : 'Submit Registration'}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
          Sign In here
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
