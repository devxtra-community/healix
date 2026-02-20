const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[1280px] mx-auto px-6 w-full">
      {children}
    </div>
  );
};

export default Container;