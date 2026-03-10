'use client';

import Link from 'next/link';
import { AxiosError } from 'axios';
import { CgSpinner } from 'react-icons/cg';
import { authService } from '@/src/services/auth.services';
import { useUserAuth } from '@/src/hooks/useUserAuth';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

interface ErrorResponse {
  message: string;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Not available';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export default function AccountPage() {
  const { user, logout } = useUserAuth();
  const [form, setForm] = useState({
    email: user?.email || '',
    otp: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await authService.forgotPasswordOtp(form.email);
      setMessage(data.message || 'OTP sent to your email.');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data?.message || 'Unable to send OTP right now.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await authService.resetPasswordWithOtp(form);
      setMessage(data.message || 'Password updated successfully.');
      setForm((prev) => ({
        ...prev,
        otp: '',
        newPassword: '',
      }));
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const securityChecklist = [
    {
      label: 'Account status',
      value: user?.isActive ? 'Active' : 'Review needed',
    },
    {
      label: 'Email verification',
      value: user?.emailVerified ? 'Verified' : 'Pending',
    },
    {
      label: 'Sign-in method',
      value: user?.provider === 'google' ? 'Google' : 'Email and password',
    },
  ];

  return (
    <div className="space-y-6 py-6">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-950 via-emerald-900 to-lime-800 p-6 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
          Account Center
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              {user?.name || 'Account'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100">
              Review your sign-in details, security status, and quick account
              actions in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Account details
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-2 font-medium text-gray-900">{user?.email}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="mt-2 font-medium text-gray-900">
                {user?.phone || 'Add from profile later'}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="mt-2 font-medium text-gray-900">
                {formatDate(user?.createdAt)}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Last login</p>
              <p className="mt-2 font-medium text-gray-900">
                {formatDate(user?.lastLogin)}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <h3 className="text-sm font-semibold text-emerald-900">
              Quick actions
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/orders"
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
              >
                View orders
              </Link>
              <Link
                href="/addresses"
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
              >
                Manage addresses
              </Link>
              <Link
                href="/profile"
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
              >
                Open profile
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Security overview
            </h2>
            <div className="mt-5 space-y-3">
              {securityChecklist.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleResetPassword}
            className="rounded-3xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Forgot password reset
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Send an OTP to your email and reset the password from this
                  page.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />

              <div className="flex gap-3">
                <input
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="flex-1 rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="rounded-2xl border border-emerald-700 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                >
                  Send OTP
                </button>
              </div>

              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New password"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="mt-4 min-h-[24px]">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-emerald-700">{message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <CgSpinner className="animate-spin text-lg" />
                  <span>Updating password...</span>
                </>
              ) : (
                'Reset password'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
