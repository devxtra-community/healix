'use client';

import { Mail, ShoppingBag, Truck, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function NotificationSettings() {
  const [emailNotifs, setEmailNotifs] = useState({
    orders: true,
    shipping: true,
    alerts: false,
    news: true,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Mail size={20} className="text-gray-400" />
          Email Notifications
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  New Orders
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Receive emails when a new order is placed.
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setEmailNotifs({ ...emailNotifs, orders: !emailNotifs.orders })
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center ${emailNotifs.orders ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block w-4 h-4 transform transition duration-200 ease-in-out bg-white rounded-full ${emailNotifs.orders ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Shipping Updates
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Receive emails about order shipping status.
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setEmailNotifs({
                  ...emailNotifs,
                  shipping: !emailNotifs.shipping,
                })
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center ${emailNotifs.shipping ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block w-4 h-4 transform transition duration-200 ease-in-out bg-white rounded-full ${emailNotifs.shipping ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Security Alerts
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Receive emails about suspicious activity.
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setEmailNotifs({ ...emailNotifs, alerts: !emailNotifs.alerts })
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center ${emailNotifs.alerts ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block w-4 h-4 transform transition duration-200 ease-in-out bg-white rounded-full ${emailNotifs.alerts ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:translate-y-[-1px] shadow-lg shadow-black/5 transition-all">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
