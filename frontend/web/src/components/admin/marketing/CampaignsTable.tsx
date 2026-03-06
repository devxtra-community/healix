'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  BarChart2,
  Edit,
} from 'lucide-react';

const initialCampaigns = [
  {
    id: 'CMP-001',
    name: 'Summer Sale 2024',
    platform: 'Google Ads',
    status: 'Active',
    budget: '$5,000',
    spent: '$2,340',
    clicks: '12.5K',
    roi: '3.2x',
  },
  {
    id: 'CMP-002',
    name: 'New Arrivals Promo',
    platform: 'Facebook',
    status: 'Paused',
    budget: '$3,000',
    spent: '$1,200',
    clicks: '8.2K',
    roi: '2.8x',
  },
  {
    id: 'CMP-003',
    name: 'Influencer Collab',
    platform: 'Instagram',
    status: 'Active',
    budget: '$8,000',
    spent: '$6,500',
    clicks: '45.2K',
    roi: '5.4x',
  },
  {
    id: 'CMP-004',
    name: 'Email Newsletter',
    platform: 'Email',
    status: 'Completed',
    budget: '$500',
    spent: '$480',
    clicks: '3.1K',
    roi: '4.1x',
  },
  {
    id: 'CMP-005',
    name: 'Retargeting Ad',
    platform: 'Google Ads',
    status: 'Active',
    budget: '$2,000',
    spent: '$850',
    clicks: '4.5K',
    roi: '3.8x',
  },
];

export default function CampaignsTable() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id: string, currentStatus: string) => {
    setCampaigns(
      campaigns.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: currentStatus === 'Active' ? 'Paused' : 'Active',
          };
        }
        return c;
      }),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-600';
      case 'Paused':
        return 'bg-amber-100 text-amber-600';
      case 'Completed':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Google Ads':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Facebook':
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Instagram':
        return 'text-pink-600 bg-pink-50 border-pink-100';
      case 'Email':
        return 'text-purple-600 bg-purple-50 border-purple-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer font-medium text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Budget / Spent
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Results
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCampaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </div>
                  <div className="text-xs text-gray-500">{campaign.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getPlatformColor(campaign.platform)}`}
                  >
                    {campaign.platform}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-gray-900">
                      {campaign.spent}
                    </span>
                    <span className="text-xs text-gray-500">
                      of {campaign.budget}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <BarChart2 size={12} />
                      {campaign.roi} ROI
                    </div>
                    <span className="text-xs text-gray-500">
                      {campaign.clicks} Clicks
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/marketing/${campaign.id}`}
                      className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      title={campaign.status === 'Active' ? 'Pause' : 'Resume'}
                      onClick={() => toggleStatus(campaign.id, campaign.status)}
                    >
                      {campaign.status === 'Active' ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">1-5</span> of{' '}
          <span className="font-medium text-gray-900">5</span> campaigns
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            disabled
          >
            Previous
          </button>
          <button
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
