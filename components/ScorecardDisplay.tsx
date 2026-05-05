import { FullEligibilityResult, EligibilityGate } from '@/lib/eligibility-gates';
import ScoreCircle from './ScoreCircle';
import RentAnalysisCard from './RentAnalysisCard';
import { AlertTriangle, CheckCircle, XCircle, Home, MapPin, Clock, Info } from 'lucide-react';
import type { RentalEstimateRow } from '@/lib/pipeline-api-mapper';

interface ScorecardDisplayProps {
  result: FullEligibilityResult;
  address: string;
  zipCode?: string | null;
  rentals?: RentalEstimateRow[] | null;
}

function getGateStyles(status: EligibilityGate['status']) {
  switch (status) {
    case 'pass':
      return {
        bg: 'bg-white/[0.04]',
        border: 'border-white/20',
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-400',
        titleColor: 'text-white',
        descColor: 'text-white/70',
      };
    case 'flag':
      return {
        bg: 'bg-amber-500/[0.07]',
        border: 'border-amber-500/60',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        titleColor: 'text-amber-100',
        descColor: 'text-amber-100/85',
      };
    case 'fail':
      return {
        bg: 'bg-red-500/[0.07]',
        border: 'border-red-500/55',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        titleColor: 'text-red-100',
        descColor: 'text-red-100/85',
      };
    case 'pending':
    default:
      return {
        bg: 'bg-white/[0.03]',
        border: 'border-white/15',
        iconBg: 'bg-white/10',
        iconColor: 'text-white/40',
        titleColor: 'text-white/50',
        descColor: 'text-white/40',
      };
  }
}

function GateIcon({ status }: { status: EligibilityGate['status'] }) {
  switch (status) {
    case 'pass':
      return <CheckCircle className="h-4 w-4" strokeWidth={2} />;
    case 'flag':
      return <AlertTriangle className="h-4 w-4" strokeWidth={2} />;
    case 'fail':
      return <XCircle className="h-4 w-4" strokeWidth={2} />;
    case 'pending':
      return <Clock className="h-4 w-4" strokeWidth={2} />;
    default:
      return null;
  }
}

function gateBadge(status: EligibilityGate['status']): { label: string; className: string } {
  switch (status) {
    case 'pass':
      return { label: 'Pass', className: 'text-emerald-400/95' };
    case 'flag':
      return { label: 'Needs review', className: 'text-amber-300' };
    case 'fail':
      return { label: 'Not eligible', className: 'text-red-300' };
    default:
      return { label: 'Pending', className: 'text-white/45' };
  }
}

export default function ScorecardDisplay({
  result,
  address,
  zipCode = null,
  rentals = null,
}: ScorecardDisplayProps) {
  const totalChecks = result.gates.length;
  const score =
    totalChecks > 0 ? Math.round((result.passCount / totalChecks) * 100) : 0;

  const statusLabel =
    result.status === 'ELIGIBLE'
      ? 'Pre-Qualified'
      : result.status === 'NEEDS_REVIEW'
        ? 'Needs Review'
        : 'Not Qualified';

  const issueCount = result.flagCount + result.failCount;

  return (
    <div className="rounded-2xl border border-white/20 bg-black/45 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Score */}
      <div className="px-5 sm:px-8 pt-8 pb-8 border-b border-white/10">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center tracking-tight">
          Property Eligibility Score
        </h2>
        <div className="mt-5 flex items-center justify-center gap-2 text-white/75 text-sm text-center">
          <MapPin className="h-4 w-4 shrink-0 text-[#42B0A8]" />
          <span>{address}</span>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <ScoreCircle score={score} status={statusLabel} />
          <div className="mt-5 text-center space-y-1">
            <p
              className={`text-lg font-semibold ${
                result.status === 'ELIGIBLE'
                  ? 'text-[#42B0A8]'
                  : result.status === 'NEEDS_REVIEW'
                    ? 'text-amber-200'
                    : 'text-red-300'
              }`}
            >
              {statusLabel}
            </p>
            <p className="text-sm text-white/55">for an ADU Build in Hawaii</p>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="px-5 sm:px-8 py-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">Requirements Review</h3>
          {issueCount > 0 ? (
            <span className="text-sm text-red-400 flex items-center gap-1.5 shrink-0">
              <AlertTriangle className="h-4 w-4" />
              {issueCount} issue{issueCount === 1 ? '' : 's'} found
            </span>
          ) : (
            <span className="text-sm text-emerald-400/90 flex items-center gap-1.5 shrink-0">
              <CheckCircle className="h-4 w-4" />
              All checks passed
            </span>
          )}
        </div>
        <p className="text-sm text-white/55 mt-2">
          Review the following requirements. Items marked with ✗ or ⚠ need attention.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {result.gates.map(gate => {
            const styles = getGateStyles(gate.status);
            const badge = gateBadge(gate.status);
            return (
              <div
                key={gate.id}
                className={`flex items-start gap-3 p-3.5 rounded-lg border ${styles.bg} ${styles.border}`}
              >
                <div
                  className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${styles.iconBg} ${styles.iconColor}`}
                >
                  <GateIcon status={gate.status} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-snug ${styles.titleColor}`}>{gate.name}</p>
                    <span className={`text-[10px] uppercase tracking-wide font-semibold shrink-0 ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${styles.descColor}`}>{gate.message}</p>
                  {gate.details ? (
                    <p className={`text-xs mt-1 leading-relaxed ${styles.descColor}`}>{gate.details}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Max ADU */}
      {result.aduSize ? (
        <div className="px-5 sm:px-8 py-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-lg bg-[#42B0A8]/20 flex items-center justify-center shrink-0">
              <Home className="h-5 w-5 text-[#42B0A8]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white/55">Maximum ADU Size</p>
              <p className="mt-1 text-lg sm:text-xl font-semibold text-white leading-tight">
                <span className="text-[#42B0A8]">{result.aduSize.maxAduSizeSqFt.toLocaleString()} sq ft</span>
                <span className="text-white/45 font-normal text-sm sm:text-base"> based on lot size</span>
              </p>
              {result.aduSize.primaryDwellingSizeSqFt != null && result.aduSize.primaryDwellingSizeSqFt > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-white/[0.06] border border-white/15">
                  <p className="text-sm text-white/75">
                    Primary dwelling:{' '}
                    <span className="font-medium text-white">
                      {result.aduSize.primaryDwellingSizeSqFt.toLocaleString()} sq ft
                    </span>
                  </p>
                  {result.aduSize.sizeNote ? (
                    <p className="text-xs text-white/50 mt-1">{result.aduSize.sizeNote}</p>
                  ) : null}
                </div>
              )}
              {!result.aduSize.isSizeVerified && (
                <div className="mt-3 p-3 rounded-lg border border-amber-500/45 bg-amber-500/[0.08]">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-100 leading-snug">
                      {result.aduSize.sizeNote || 'Primary dwelling size unknown — subject to verification'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Status strip */}
      {result.status === 'INELIGIBLE' && (
        <div className="px-5 sm:px-8 py-4 border-b border-white/10 bg-red-500/[0.08]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-100 font-medium">
              Additional verification required for failed requirements
            </p>
          </div>
        </div>
      )}
      {result.status === 'NEEDS_REVIEW' && (
        <div className="px-5 sm:px-8 py-4 border-b border-white/10 bg-amber-500/[0.08]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0" />
            <p className="text-sm text-amber-50 font-medium">
              Additional verification required for flagged requirements
            </p>
          </div>
        </div>
      )}
      {result.status === 'ELIGIBLE' && (
        <div className="px-5 sm:px-8 py-4 border-b border-white/10 bg-[#42B0A8]/[0.12]">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-[#42B0A8] shrink-0" />
            <p className="text-sm text-white font-medium">You&apos;re cleared to move to final verification</p>
          </div>
        </div>
      )}

      {/* Sources + DPP */}
      <div className="px-5 sm:px-8 py-5 border-b border-white/10 text-center space-y-2">
        <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed">
          Data sources: Google Maps API, Hawaii State GIS, Regrid, BWS, HART, Permit Portal.
        </p>
        <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed">
          This tool provides preliminary eligibility screening only. Always verify with the Honolulu Department of
          Planning and Permitting (DPP) for final eligibility determination.
        </p>
      </div>

      {/* Mission (matches marketing embed tone) */}
      <div className="px-5 sm:px-8 py-6 border-b border-white/10">
        <p className="text-sm sm:text-base text-white/85 leading-relaxed text-center font-serif italic">
          Our platform checks your property against verified zoning data, lot requirements, infrastructure records, and
          local regulations—in seconds. We give you a clear eligibility score, not vague maybes. And when you&apos;re
          ready to move forward, we connect you with vetted builders, financing options that make sense, and a team that
          walks with you from first click to finished unit.
        </p>
      </div>

      {/* Rent — same APIs, combined panel */}
      <div className="px-5 sm:px-8 py-8 bg-black/25">
        <RentAnalysisCard
          zipCode={zipCode || ''}
          rentals={rentals ?? []}
          maxAduSqFt={result.aduSize?.maxAduSizeSqFt ?? null}
        />
      </div>
    </div>
  );
}
