import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Beaker, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
            Nutrition Rooted in{' '}
            <span className="text-green-600">Science & Nature</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Healix was created to bring clean, effective, and science-backed
            nutrition into everyday life. We combine natural ingredients with
            modern research to support your wellness journey.
          </p>

          <Link
            href="/store"
            className="inline-block mt-8 bg-green-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-green-700 transition"
          >
            Explore Products
          </Link>
        </div>

        <div className="relative w-full h-[420px] rounded-[28px] overflow-hidden bg-green-50">
          <Image
            src="/about/hero.jpg"
            alt="Healix supplements"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-[#F3F7F4] py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We believe wellness should be simple, transparent, and accessible.
            Every Healix formula is designed with integrity and purpose.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-14">
            <ValueCard
              icon={<Leaf className="w-7 h-7" />}
              title="Clean Ingredients"
              text="No artificial additives or harmful fillers."
            />
            <ValueCard
              icon={<Beaker className="w-7 h-7" />}
              title="Science-Backed"
              text="Formulated using modern nutrition research."
            />
            <ValueCard
              icon={<ShieldCheck className="w-7 h-7" />}
              title="Transparent & Safe"
              text="Lab tested and responsibly sourced."
            />
          </div>
        </div>
      </section>

      {/* WHY HEALIX */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-[420px] rounded-[28px] overflow-hidden bg-green-50">
          <Image
            src="/about/ingredients.jpg"
            alt="Natural ingredients"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Why Healix</h2>
          <ul className="mt-6 space-y-4 text-gray-600 text-lg">
            <li>✓ Clinically studied nutrients</li>
            <li>✓ Natural, plant-based sources</li>
            <li>✓ No artificial preservatives</li>
            <li>✓ Sustainable ingredient sourcing</li>
          </ul>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="bg-[#F3F7F4] py-20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
            <Image
              src="/about/founder.jpg"
              alt="Founder"
              fill
              className="object-cover"
            />
          </div>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">
            Our Story
          </h3>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Healix began with a simple goal: create nutrition people can trust.
            After years of studying health science and plant-based nutrition, we
            developed formulas that support gut health, immunity, energy, and
            overall wellbeing.
          </p>
        </div>
      </section>

      {/* TRUST */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          Trusted Quality
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-gray-600">
          <TrustBadge text="GMP Certified" />
          <TrustBadge text="Non-GMO" />
          <TrustBadge text="Lab Tested" />
          <TrustBadge text="Vegan Friendly" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-20 text-center text-white">
        <h2 className="text-3xl font-semibold">
          Start Your Wellness Journey Today
        </h2>

        <Link
          href="/store"
          className="inline-block mt-8 bg-white text-green-700 px-8 py-4 rounded-2xl font-medium hover:bg-gray-100 transition"
        >
          Shop Healix
        </Link>
      </section>
    </main>
  );
}

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}

function TrustBadge({ text }: { text: string }) {
  return <div className="bg-[#F3F7F4] rounded-xl py-6 font-medium">{text}</div>;
}
