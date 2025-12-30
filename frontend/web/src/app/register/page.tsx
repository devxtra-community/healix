'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/axios';
// Optional: Import a spinner icon if you have one, or use CSS
import { CgSpinner } from 'react-icons/cg';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Don't clear error immediately to prevent jumping, or clear it if you prefer
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      router.push('/login');
    } catch (err: any) {
      console.error('Register Error:', err);

      const rawMessage = err?.response?.data?.message || '';

      if (
        rawMessage.includes('duplicate key') ||
        rawMessage.includes('E11000')
      ) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(rawMessage || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:4001/api/v1/auth/google';
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/pomegranate-oatmeal.png"
          alt="Background"
          fill
          priority
          className="object-cover blur-[2px] opacity-100"
        />
      </div>

      <div className="relative z-10 mx-4 flex w-full max-w-6xl min-h-[650px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left Side Image */}
        <div className="relative hidden w-1/2 m-6 overflow-hidden lg:block rounded-2xl">
          <Image
            src="/images/pomegranate-oatmeal.png"
            alt="Register illustration"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Create your Healix account
            </h1>
            <p className="text-gray-600">Register to continue</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          <div className="min-h-[24px] mb-4">
            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 animate-pulse">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 text-black px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 text-black px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 text-black px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 font-semibold text-white shadow-md hover:from-green-700 hover:to-green-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <CgSpinner className="animate-spin text-xl" />
                  <span>Processing...</span>
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-semibold text-green-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
