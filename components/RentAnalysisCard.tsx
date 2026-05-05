import Image from 'next/image';

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

/** ADU photos — /public/images (750 sq ft + 1000 sq ft cards) */
const aduImages = ['/images/housepicture.png', '/images/Picture.png'];

export default function RentAnalysisCard({
  zipCode,
  rentals,
  maxAduSqFt,
}: RentAnalysisCardProps) {
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
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="font-dm-sans text-xl font-bold text-white">ADU Investment Options</h2>
        <p className="mt-1 font-dm-sans text-sm text-white/60">
          Rental estimates for ZIP {effectiveZipCode} based on{' '}
          {(comparableCount > 0 ? comparableCount : effectiveRentals[0]?.comparableCount) || 15}+ comparable
          properties
          {!usingLiveRentals && (
            <span className="mt-1 block text-xs text-white/45">
              Showing illustrative comparables until rent data loads for this ZIP.
            </span>
          )}
        </p>
        {maxAduSqFt != null && maxAduSqFt < 1000 && (
          <p className="mx-auto mt-2 max-w-md font-dm-sans text-xs text-amber-200/90">
            ADU size caps above apply to your lot (up to {maxAduSqFt.toLocaleString()} sq ft). Rent rows reflect market
            comps by bedroom count, not unit square footage.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {aduOptions.map((option, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/12 bg-[#2d2d32] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          >
            {/* Hero image + teal sq ft badge (design match) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
              <Image
                src={aduImages[index] ?? aduImages[0]}
                alt={`${option.size} sq ft ADU option`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 420px"
                priority={index === 0}
              />
              <div className="absolute bottom-3 right-3 rounded-full bg-[#42B0A8] px-3 py-1.5 font-dm-sans text-sm font-semibold text-white shadow-md ring-2 ring-black/20">
                {option.size} sq ft
              </div>
            </div>

            {/* Bed/bath + Est. Rent — single row */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3.5">
              <span className="font-dm-sans text-base font-bold text-white">
                {option.bedrooms} Bed / {option.bathrooms} Bath
                {option.label ? (
                  <span className="ml-2 align-middle font-dm-sans text-xs font-normal text-[#42B0A8]">
                    {option.label}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-right font-dm-sans text-base font-bold text-white">
                Est. Rent {formatCurrency(option.estimatedRent)}
                /mo
              </span>
            </div>

            {/* Rent stress test — nested panel */}
            <div className="border-t border-white/10 px-4 pb-4 pt-3">
              <div className="rounded-xl bg-[#45454b] px-4 py-3.5">
                <p className="font-dm-sans text-xs font-medium text-white/55">Rent Stress Test</p>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-dm-sans text-sm text-white/70">At 75% occupancy:</span>
                  <span className="font-dm-sans text-base font-bold tabular-nums text-white">
                    {formatCurrency(option.stressTestRent)}/mo{' '}
                    <span className="text-sm font-normal text-white/55">effective</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center font-dm-sans text-xs leading-relaxed text-white/45">
        Rental estimates from comparable-market data (ZIP-level) • 75% occupancy stress test accounts for vacancy and
        maintenance
      </div>
    </div>
  );
}
