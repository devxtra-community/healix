export default function OrdersPage() {
  const orders = [
    { id: '#1234', date: '12 Feb 2026', total: '₹1200', status: 'Delivered' },
    { id: '#1235', date: '10 Feb 2026', total: '₹800', status: 'Shipped' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <p className="font-medium">{o.id}</p>
              <p className="text-sm text-gray-500">{o.date}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold">{o.total}</p>
              <p className="text-sm text-green-600">{o.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
