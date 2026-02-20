import Container from "./ Container";
import ProductCard from "./ProductCard";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
const MasonryGrid = () => {
  return (
    <section >
      <Container>
        {/* center the grid visually */}
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-end">
            
            {/* Col 1 */}
            <div className="flex flex-col gap-6">
              <ProductCard imageSrc="/images/orange.png" heightClass="h-[340px]" title="Orange" />
              <ProductCard imageSrc="/images/lemon.png" heightClass="h-[120px]" title="Lemon" />
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-6">
              <ProductCard imageSrc="/images/greenboost.png" heightClass="h-[380px]" title="Green" />
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-6 items-center">
              <ProductCard imageSrc="/images/red.png" heightClass="h-[200px]" title="Red" />

            
<Link
  href="/store"
  className="w-full bg-gray-900 text-white py-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition"
>
  <span>Explore Products</span>
  <ArrowUpRight className="w-4 h-4" />
</Link>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col gap-6">
              <ProductCard imageSrc="/images/blue.png" heightClass="h-[380px]" title="Blue" />
            </div>

            {/* Col 5 */}
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