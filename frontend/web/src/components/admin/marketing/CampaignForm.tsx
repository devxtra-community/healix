'use client';

import { useState, useEffect } from 'react';
import {
  Megaphone,
  Calendar,
  DollarSign,
  Target,
  BarChart2,
} from 'lucide-react';

interface CampaignFormProps {
  initialData?: {
    name: string;
    platform: string;
    status: string;
    budget: string;
    startDate: string;
    endDate: string;
    targetAudience: string;
  };
}

export default function CampaignForm({ initialData }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'Google Ads',
    status: 'Active',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Info */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Megaphone size={20} className="text-gray-400" />
            Campaign Details
          </h2>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Name
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Sale 2024"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Platform
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                >
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Email">Email</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Total Budget
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <DollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Target Audience
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-gray-400">
                  <Target size={18} />
                </div>
                <textarea
                  placeholder="Describe your target audience..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            Campaign Duration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Status & Summary */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <div className="flex flex-col gap-4">
            <select
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <BarChart2 size={16} className="text-gray-500" />
                Estimated Reach
              </h4>
              <p className="text-sm text-gray-500">
                Based on your budget and audience, you could reach{' '}
                <span className="text-gray-900 font-medium">15k - 25k</span>{' '}
                people.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
