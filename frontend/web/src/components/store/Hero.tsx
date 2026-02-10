'use client';

const Hero = () => {
  return (
    <section className="px-4 max-w-7xl mx-auto mb-16">
      <div className="bg-[#F0FFF4] rounded-[2.5rem] p-8 md:p-16 min-h-[480px] flex items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            Order your <br /> Daily Nutritions
          </h1>

          <div className="flex bg-white rounded-full p-2 max-w-md">
            <input
              placeholder="Search your product"
              className="flex-grow px-4 outline-none text-sm"
            />
            <button className="bg-[#00DC58] text-white px-6 py-3 rounded-full text-sm font-semibold">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
