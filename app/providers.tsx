'use client';

import type { ReactNode } from 'react';
import { JourneyMongoHydrator } from '@/app/components/journey-mongo-hydrator';
import { BuildPathProvider } from '@/app/context/build-path-session';
import { EligibilitySessionProvider } from '@/app/context/eligibility-session';
import { JourneyProgressProvider } from '@/app/context/journey-progress';
import { ReportContactProvider } from '@/app/context/report-contact';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EligibilitySessionProvider>
      <JourneyProgressProvider>
        <ReportContactProvider>
          <BuildPathProvider>
            <JourneyMongoHydrator />
            {children}
          </BuildPathProvider>
        </ReportContactProvider>
      </JourneyProgressProvider>
    </EligibilitySessionProvider>
  );
}
