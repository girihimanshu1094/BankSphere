import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import FormInput from '../../components/forms/FormInput';
import { isValidEmail } from '../../utils/validators';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      setError('Please provide a valid registered email address');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Reset Link Dispatched</h3>
          <p className="text-xs text-slate-600">
            A password recovery link has been generated for{' '}
            <span className="font-semibold text-slate-900">{email}</span>. Please check your inbox.
          </p>
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Registered Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. customer@banksphere.com"
            icon={Mail}
            error={error}
            required
          />

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Send Reset Instructions
          </button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
