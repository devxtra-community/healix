import Container from "./ Container";

const HeroText = () => {
  return (
    <section className="text-center mt-10 mb-0">
      <Container>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
          Pure Nutrition for <br />
          Your Wellness Journey
        </h1>

        <p className="text-gray-500 text-md md:text-xg mb-10 max-w-xl mx-auto">
          Clean, targeted formulas that fuel your gut,
          <br className="hidden md:block" />
          mind, and energy every day.
        </p>

        {/* Search */}
        <div className="flex items-center bg-white border border-gray-200 p-2 pl-6 rounded-full shadow-sm max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search your product"
            className="flex-grow outline-none text-gray-600 bg-transparent"
          />
          <button className="bg-[#00DC58] hover:bg-[#00c950] text-white px-8 py-3 rounded-full font-semibold">
            Search
          </button>
        </div>
      </Container>
    </section>
  );
};

export default HeroText;