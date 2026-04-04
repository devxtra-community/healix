import Container from './Container';
import ProductCard from './ProductCard';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const MasonryGrid = () => {
  return (
    <section>
      <Container>
        <div className="max-w-[1300px] mx-auto">

          {/* ---------------- MOBILE ---------------- */}
          <div className="grid grid-cols-2 gap-4 md:hidden py-7">
            <div className='gap-5 flex flex-col'>
                          <ProductCard imageSrc="/images/red.png" heightClass="h-[160px]" title="Red" />
                                      <ProductCard imageSrc="/phone/blue.png" heightClass="h-[250px]" title="Blue" bgColor ="bg-[#78d6f3]/92" />


            </div>
            <div className='gap-5 flex flex-col'>
              <ProductCard imageSrc="/phone/green.png" heightClass="h-[250px]" title="Green" />
            <ProductCard imageSrc="/images/lemon.png" heightClass="h-[160px]" title="Lemon" />

            </div>
            
            <Link
              href="/store"
              className="col-span-2 bg-gray-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              Explore Products
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>


          {/* ---------------- TABLET ---------------- */}
          <div className="hidden md:grid lg:hidden grid-cols-3 p-7 gap-5 items-end">

            <ProductCard imageSrc="/images/orange.png" heightClass="h-[260px]" title="Orange" />

            <ProductCard imageSrc="/phone/green.png" heightClass="h-[320px]" title="Green" />

            <ProductCard imageSrc="/images/blue.png" heightClass="h-[260px]" title="Blue" />

            <ProductCard imageSrc="/images/red.png" heightClass="h-[180px]" title="Red" />

            <Link
              href="/store"
              className="bg-gray-900 text-white py-5 rounded-2xl flex items-center justify-center gap-2"
            >
              Explore Products
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <ProductCard imageSrc="/images/lemon.png" heightClass="h-[180px]" title="Lemon" />

          </div>


          {/* ---------------- DESKTOP ---------------- */}
          <div className="hidden lg:grid grid-cols-5 gap-6 items-end">

            <div className="flex flex-col gap-6">
              <ProductCard imageSrc="/images/orange.png" heightClass="h-[340px]" title="Orange" />
              <ProductCard imageSrc="/images/lemon.png" heightClass="h-[120px]" title="Lemon" />
            </div>

            <div className="flex flex-col gap-6">
              <ProductCard imageSrc="/images/greenboost.png" heightClass="h-[380px]" title="Green" />
            </div>

            <div className="flex flex-col gap-6 items-center">
              <ProductCard imageSrc="/images/red.png" heightClass="h-[200px]" title="Red" />

              <Link
                href="/store"
                className="w-full bg-gray-900 text-white py-6 rounded-2xl flex items-center justify-center gap-2"
              >
                Explore Products
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <ProductCard imageSrc="/images/blue.png" heightClass="h-[380px]" title="Blue" />
            </div>

            <div className="flex flex-col gap-6">
              <ProductCard imageSrc="/images/apple.png" heightClass="h-[340px]" title="Apple" />
              <ProductCard imageSrc="/images/watermelon.png" heightClass="h-[120px]" title="Watermelon" />
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
};

export default MasonryGrid;