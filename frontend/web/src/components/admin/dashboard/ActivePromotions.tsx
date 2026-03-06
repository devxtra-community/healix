const promotions = [
  {
    title: 'Holiday Sale',
    code: '234 used',
    status: 'Active',
    color: 'green',
    desc: 'Discount Code',
  },
  {
    title: 'New Customer Welcome',
    code: '89% open rate',
    status: 'Running',
    color: 'green',
    desc: 'Email Campaign',
  },
];

export default function ActivePromotions() {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] flex flex-col">
      <h3 className="text-base font-semibold text-gray-900 mb-6">
        Active Promotions
      </h3>
      <div className="flex flex-col gap-5">
        {promotions.map((promo) => (
          <div
            key={promo.title}
            className="flex justify-between items-center pb-4 border-b border-gray-100 last:pb-0 last:border-b-0"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold text-gray-700">
                {promo.title}
              </div>
              <div className="text-xs text-gray-400">
                {promo.desc}:{' '}
                <span className="text-gray-500 font-medium">{promo.code}</span>
              </div>
            </div>
            <div className="bg-green-100 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-xl">
              {promo.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
