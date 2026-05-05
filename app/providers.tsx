'use client';

import type { ReactNode } from 'react';
import { BuildPathProvider } from '@/app/context/build-path-session';
import { EligibilitySessionProvider } from '@/app/context/eligibility-session';
import { ReportContactProvider } from '@/app/context/report-contact';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EligibilitySessionProvider>
      <ReportContactProvider>
        <BuildPathProvider>{children}</BuildPathProvider>
      </ReportContactProvider>
    </EligibilitySessionProvider>
  );
}
