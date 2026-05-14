"use client";

import Navbar from "@/app/components/navbar/navbar";
import { useEffect, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StepsInput } from "../components/steps-input";
import { StepFooter } from "../components/step-footer";
import { useReportContact } from "@/app/context/report-contact";
import { useJourneyProgress, useWizardRouteGuard } from "@/app/context/journey-progress";
import { flowIndexFromPath, nextWizardPath, prevWizardPath } from "@/lib/wizard-flow";

export default function ReportForm() {
  const router = useRouter();
  const pathname = usePathname();
  const flowIdx = flowIndexFromPath(pathname) ?? 0;
  const { maxNavIndex, recordFlowComplete } = useJourneyProgress();
  useWizardRouteGuard(flowIdx);
  const { contact, hydrated, setContact } = useReportContact();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !contact) return;
    startTransition(() => {
      setForm({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
      });
    });
  }, [hydrated, contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const isComplete = Boolean(
    form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.trim() &&
      form.phone.trim()
  );

  const handleSubmit = async () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setContact({
        firstName,
        lastName,
        email,
        phone,
        savedAt: Date.now(),
      });
      await new Promise((r) => setTimeout(r, 400));
      await recordFlowComplete(0, {
        contact: { firstName, lastName, email, phone },
      });
      router.push("/steps/step-2");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534]">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="h-[400px] w-[500px] rounded-full bg-teal-400/10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pb-2 pt-24 sm:px-6 sm:pt-32">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 py-6 sm:py-8">
            <h1 className="text-center font-dm-sans text-2xl font-bold tracking-tight text-white">
              Your Report Is Being Prepared
            </h1>

            <p className="max-w-3xl text-balance px-2 text-center font-dm-sans text-sm leading-snug text-white/70 sm:text-base md:text-lg">
              Enter your details to unlock your ADU eligibility score and next steps
            </p>

            <div className="w-full max-w-xl space-y-3">
              <div className="flex gap-3">
                <StepsInput
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <StepsInput
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              <StepsInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />

              <StepsInput
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {error ? (
              <p className="w-full max-w-xl text-center font-dm-sans text-sm text-red-300">{error}</p>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-[#162534]/95 px-4 pt-3 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3">
            <button
              type="button"
              disabled={loading || !isComplete}
              onClick={() => void handleSubmit()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-400 py-4 text-sm font-semibold tracking-wide text-slate-900 shadow-lg shadow-teal-400/20 transition-all duration-200 hover:bg-teal-300 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Preparing…
                </>
              ) : (
                <>
                  Reveal My Score
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            <StepFooter
              currentStep={2}
              totalSteps={7}
              variant="step2"
              onBack={() => router.push(prevWizardPath(flowIdx))}
              onForward={() => {
                const n = nextWizardPath(flowIdx);
                if (n) router.push(n);
              }}
              canGoForward={maxNavIndex > flowIdx}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
