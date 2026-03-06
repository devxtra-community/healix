import Hero from '@/src/components/store/Hero';
import CategorySection from '@/src/components/store/CategorySection';
import ProductSection from '@/src/components/store/ProductSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CategorySection />
      <ProductSection />
    </main>
  );
}
