import React from 'react';

const steps = [
  {
    title: 'Tell Us About Yourself',
    description:
      'Take a quick quiz about your habits, preferences, goals, and daily routine.',
    bgColor: 'bg-[#FAFFD1]',
    borderColor: 'border-[#E5ED9C]',
  },
  {
    title: 'We Analyze Your Inputs',
    description:
      'Our system studies your answers to identify the nutrients and ingredients your body may benefit from the most.',
    bgColor: 'bg-[#F0F0FF]',
    borderColor: 'border-[#D1D1FF]',
  },
  {
    title: 'Get Your Personalised Products',
    description:
      'You receive a personalized blend created specifically for your needs—nothing generic, nothing wasted.',
    bgColor: 'bg-[#D1FFEB]',
    borderColor: 'border-[#9CEDB5]',
  },
];

export default function Personalization() {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-semibold mb-6">
        Why Personalization Matters
      </h2>
      <p className="text-xl text-gray-700 leading-relaxed mb-12">
        Your body is unique. your nutrition should be too. Our personalized
        approach ensures you get the right ingredients, in the right amounts,
        made specifically for your goals and lifestyle.
      </p>

      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-xl border-2 ${step.bgColor} ${step.borderColor} text-left transition-transform hover:scale-[1.01]`}
          >
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
