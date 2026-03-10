'use client';

import { useUserAuth } from '@/src/hooks/useUserAuth';

const ProfilePage = () => {
  const { user } = useUserAuth();
  console.log(user);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border p-8 flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
            {user?.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-gray-500">Member since February 2026</p>
            <span className="mt-2 inline-block px-3 pyan-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase">
              Active Customer
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="bg-white p-6 rounded-xl border">
            <h4 className="font-bold mb-4 text-gray-700 border-b pb-2">
              Account Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Email Address</label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone Number</label>
                <p className="font-medium">+91 9876543210</p>
              </div>
            </div>
          </div>

          {/* Stats Card (Matches your Dashboard style) */}
          <div className="bg-white p-6 rounded-xl border">
            <h4 className="font-bold mb-4 text-gray-700 border-b pb-2">
              Activity Overview
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Reviews Left</p>
                <p className="text-2xl font-bold">14</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
