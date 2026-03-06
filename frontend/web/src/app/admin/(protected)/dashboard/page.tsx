import ActivePromotions from '@/src/components/admin/dashboard/ActivePromotions';
import CustomerInsights from '@/src/components/admin/dashboard/CustomerInsights';
import QuickActionCard from '@/src/components/admin/dashboard/QuickActionCard';
import SalesChart from '@/src/components/admin/dashboard/SalesChart';
import StatCard from '@/src/components/admin/dashboard/StatCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-4">
        <p className="text-text-secondary text-[0.95rem]">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
        <Link
          href={'/admin/products/add'}
          className="bg-black text-white border-none py-3 px-6 rounded-3xl font-semibold cursor-pointer text-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg max-md:w-full md:w-auto flex justify-center"
        >
          + New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          link="/admin/discounts/add"
          title="Create Discount Code"
          subtitle="Set up percentage or fixed amount discounts"
          gradient="linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)"
        />
        <QuickActionCard
          link=""
          title="Email Campaign"
          subtitle="Send newsletters and promotional emails"
          gradient="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
        />
        <QuickActionCard
          link=""
          title="Announcement Banner"
          subtitle="Display site-wide promotional messages"
          gradient="linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" // Greenish
        />
        <QuickActionCard
          link=""
          title="Bundle Offers"
          subtitle="Create product bundles with special pricing"
          gradient="linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)" // Purpleish
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Sales"
              value="$54,890"
              trend={12.5}
              trendLabel="This month"
            />
            <StatCard
              title="Orders"
              value="1,429"
              trend={8.2}
              trendLabel="This month"
            />
            <StatCard
              title="Average Order Value"
              value="$38.42"
              trend={3.1}
              trendLabel="This month"
            />
            <StatCard
              title="Returning Customers"
              value="68%"
              trend={2.4}
              trendLabel="This month"
            />
            <StatCard
              title="Cart Abandonment"
              value="23.8%"
              trend={-1.8}
              trendLabel="This month"
            />
            <StatCard
              title="Product Views"
              value="45,210"
              trend={15.3}
              trendLabel="This month"
            />
          </div>

          <div className="flex-1">
            <SalesChart />
          </div>
        </div>

        <div className="flex flex-col gap-6 max-xl:grid max-xl:grid-cols-1 md:max-xl:grid-cols-2">
          <CustomerInsights />
          <ActivePromotions />
        </div>
      </div>
    </div>
  );
}
