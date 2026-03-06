'use client';

import { Lock, Smartphone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Lock size={20} className="text-gray-400" />
          Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ShieldCheck size={20} className="text-gray-400" />
          Two-Factor Authentication
        </h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Authenticator App
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Use an authenticator app to generate one time codes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactor(!twoFactor)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center ${twoFactor ? 'bg-black' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block w-4 h-4 transform transition duration-200 ease-in-out bg-white rounded-full ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
