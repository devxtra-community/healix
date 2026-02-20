export default function WishlistPage() {
  const items = [
    { id: 1, name: 'Wireless Headphones', price: '₹2999' },
    { id: 2, name: 'Smart Watch', price: '₹1999' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Wishlist</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow">
            <div className="h-32 bg-gray-100 rounded-lg mb-3" />

            <p className="font-medium">{item.name}</p>
            <p className="text-gray-600">{item.price}</p>

            <button className="mt-3 w-full bg-black text-white py-2 rounded-lg">
              Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
