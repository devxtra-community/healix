'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  image?: string;
  price?: number;
}
const S3_BASE = 'https://healix-product-images.s3.ap-south-1.amazonaws.com/';

function resolveImage(src?: string | null) {
  if (!src) return '/placeholder.png';
  if (src.startsWith('http')) return src;
  return `${S3_BASE}${src}`;
}
const Hero = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [show, setShow] = useState(false);

  // 🔎 live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/v1/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setResults(data);
        setShow(true);
      } catch (e) {
        console.error(e);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <section className="px-4 max-w-7xl mx-auto mb-16 relative">
      <div className="bg-[#F0FFF4] rounded-[2.5rem] p-8 md:p-16 min-h-[480px] flex items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            Order your <br /> Daily Nutritions
          </h1>

          <div className="flex bg-white rounded-full p-2 max-w-md relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your product"
              className="flex-grow px-4 outline-none text-sm"
            />

            <button className="bg-[#00DC58] text-white px-6 py-3 rounded-full text-sm font-semibold">
              Search
            </button>

            {/* 🔽 suggestions dropdown */}
            {show && results.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 max-h-80 overflow-y-auto z-50">
                {results.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/product/${p.id}`;
                    }}
                  >
                    <img
                      src={resolveImage(p.image) || '/placeholder.png'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded"
                    />

                    <div className="text-sm font-medium">{p.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
