import { DollarSign, TrendingDown } from 'lucide-react';

// ADU images for each card (2 options)
const aduImages = [
  'https://images.squarespace-cdn.com/content/v1/6910d35fca92b56af610d60e/769dc1d4-422d-4686-beb3-6e5cddbc814e/ADU.png', // 1 Bed / 1 Bath
  'https://images.squarespace-cdn.com/content/v1/6910d35fca92b56af610d60e/3435e4b5-caf1-4bfc-90dc-1b986d4ecc63/Screenshot+by+Snip+My+on+Jan+15%2C+2026+at+10.23.31%E2%80%AFAM.png', // 2 Bed / 1 Bath
];

interface RentalData {
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  estimate: number;
  min: number;
  max: number;
  comparableCount: number;
  lastUpdated: string;
}

interface RentAnalysisCardProps {
  zipCode: string;
  rentals: RentalData[];
  /** When set, shown as a note if a template size exceeds what the lot may allow */
  maxAduSqFt?: number | null;
}

interface AduOption {
  size: number;
  bedrooms: number;
  bathrooms: number;
  estimatedRent: number;
  stressTestRent: number;
  label?: string;
}

export default function RentAnalysisCard({
  zipCode,
  rentals,
  maxAduSqFt,
}: RentAnalysisCardProps) {
  // Use mock data if rentals are not available (for development/testing)
  const mockRentals: RentalData[] = [
    {
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'Single Family',
      estimate: 2200,
      min: 1800,
      max: 2600,
      comparableCount: 25,
      lastUpdated: new Date().toISOString(),
    },
    {
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'Single Family',
      estimate: 2800,
      min: 2400,
      max: 3200,
      comparableCount: 30,
      lastUpdated: new Date().toISOString(),
    },
  ];

  const usingLiveRentals = rentals && rentals.length > 0;
  const effectiveRentals = usingLiveRentals ? rentals : mockRentals;
  const effectiveZipCode = zipCode || '96706';

  if (!effectiveRentals || effectiveRentals.length === 0) {
    return null;
  }

  const comparableCount = Math.max(
    ...effectiveRentals.map(r => (typeof r.comparableCount === 'number' ? r.comparableCount : 0)),
    0
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateStressTestRent = (estimate: number) => Math.round(estimate * 0.75);

  const find1BedRent = effectiveRentals.find(r => r.bedrooms === 1);
  const find2BedRent = effectiveRentals.find(r => r.bedrooms === 2);

  const base1BedRent =
    find1BedRent?.estimate ??
    (find2BedRent?.estimate ? Math.round(find2BedRent.estimate * 0.85) : 2200);
  const base2BedRent =
    find2BedRent?.estimate ?? Math.round(base1BedRent * (find1BedRent ? 1.12 : 1.27));

  const templateSizes = [750, 1000] as const;
  const aduOptions: AduOption[] = [
    {
      size: templateSizes[0],
      bedrooms: 1,
      bathrooms: find1BedRent?.bathrooms ?? 1,
      estimatedRent: base1BedRent,
      stressTestRent: calculateStressTestRent(base1BedRent),
    },
    {
      size: templateSizes[1],
      bedrooms: 2,
      bathrooms: find2BedRent?.bathrooms ?? 1,
      estimatedRent: base2BedRent,
      stressTestRent: calculateStressTestRent(base2BedRent),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">ADU Investment Options</h2>
        <p className="text-sm text-white/60 mt-1">
          Rental estimates for ZIP {effectiveZipCode} based on{' '}
          {(comparableCount > 0 ? comparableCount : effectiveRentals[0]?.comparableCount) || 15}+
          comparable properties
          {!usingLiveRentals && (
            <span className="block mt-1 text-white/40 text-xs">
              Showing illustrative comparables until rent data loads for this ZIP.
            </span>
          )}
        </p>
        {maxAduSqFt != null && maxAduSqFt < 1000 && (
          <p className="text-xs text-amber-200/90 mt-2 max-w-md mx-auto">
            ADU size caps above apply to your lot (up to {maxAduSqFt.toLocaleString()} sq ft). Rent rows reflect
            market comps by bedroom count, not unit square footage.
          </p>
        )}
      </div>

      {/* Rental Cards Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        {aduOptions.map((option, index) => (
          <div
            key={index}
            className="bg-[#575757]/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                {/* Image - 20% bigger (72px, was 60px) */}
                <div className="h-[72px] w-[72px] rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={aduImages[index]}
                    alt={`${option.size} sq ft ADU`}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Square Footage */}
                <div className="text-right">
                  <span className="text-3xl font-bold text-white leading-none">{option.size}</span>
                  <p className="text-xs text-white/60 mt-0.5">sq ft</p>
                </div>
              </div>
            </div>

            {/* Horizontal Line Separator */}
            <div className="border-t border-white/20"></div>

            {/* Bed/Bath Section */}
            <div className="px-4 py-3 text-center">
              <p className="text-lg font-bold text-white">
                {option.bedrooms} Bed / {option.bathrooms} Bath
                {option.label && (
                  <span className="ml-2 text-xs bg-[#42B0A8]/20 text-[#42B0A8] px-2 py-0.5 rounded-full">
                    {option.label}
                  </span>
                )}
              </p>
            </div>

            {/* Another Horizontal Line Separator */}
            <div className="border-t border-white/20"></div>

            {/* Card Content */}
            <div className="px-4 py-4 space-y-3">
              {/* Estimated Rent */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#42B0A8]" />
                  <span className="text-sm text-white">Est. Rent</span>
                </div>
                <span className="text-lg font-bold text-[#42B0A8]">
                  {formatCurrency(option.estimatedRent)}/mo
                </span>
              </div>

              {/* Stress Test Section */}
              <div className="bg-[#707070] rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-[#ef4444]" />
                  <span className="text-xs font-medium text-white">Rent Stress Test</span>
                </div>
                <p className="text-xs text-white/70 mb-2">At 75% occupancy:</p>
                <p className="text-base font-semibold text-white">
                  {formatCurrency(option.stressTestRent)}/mo
                  <span className="text-xs text-white/60 font-normal ml-1">effective</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-white/50">
        <p>
          Rental estimates from comparable-market data (ZIP-level) • 75% occupancy stress test accounts for vacancy
          and maintenance
        </p>
      </div>
    </div>
  );
}
