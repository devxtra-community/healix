export default function AddressesPage() {
  const addresses = [
    {
      id: 1,
      name: 'Jaseem',
      address: 'Kochi, Kerala, India',
      phone: '9876543210',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Addresses</h1>

      <div className="space-y-4">
        {addresses.map((a) => (
          <div key={a.id} className="bg-white p-4 rounded-xl shadow">
            <p className="font-medium">{a.name}</p>
            <p className="text-gray-600">{a.address}</p>
            <p className="text-gray-500">{a.phone}</p>

            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-gray-200 rounded">Edit</button>
              <button className="px-3 py-1 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 bg-black text-white px-4 py-2 rounded-lg">
        Add New Address
      </button>
    </div>
  );
}
