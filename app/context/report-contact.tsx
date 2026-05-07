'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'westay-report-contact';

export type ReportContactSnapshot = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  savedAt: number;
};

type ReportContactContextValue = {
  contact: ReportContactSnapshot | null;
  hydrated: boolean;
  setContact: (next: ReportContactSnapshot | null) => void;
  clearContact: () => void;
};

const ReportContactContext = createContext<ReportContactContextValue | null>(null);

function loadStored(): ReportContactSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReportContactSnapshot;
    if (
      parsed &&
      typeof parsed.firstName === 'string' &&
      typeof parsed.lastName === 'string' &&
      typeof parsed.email === 'string' &&
      typeof parsed.phone === 'string' &&
      typeof parsed.savedAt === 'number'
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function ReportContactProvider({ children }: { children: ReactNode }) {
  const [contact, setContactState] = useState<ReportContactSnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContactState(loadStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (contact) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(contact));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [contact]);

  const setContact = useCallback((next: ReportContactSnapshot | null) => {
    setContactState(next);
  }, []);

  const clearContact = useCallback(() => {
    setContactState(null);
  }, []);

  const value = useMemo(
    () => ({
      contact,
      hydrated,
      setContact,
      clearContact,
    }),
    [contact, hydrated, setContact, clearContact]
  );

  return <ReportContactContext.Provider value={value}>{children}</ReportContactContext.Provider>;
}

export function useReportContact(): ReportContactContextValue {
  const ctx = useContext(ReportContactContext);
  if (!ctx) {
    throw new Error('useReportContact must be used within ReportContactProvider');
  }
  return ctx;
}
