"use client";

import Navbar from "@/app/components/navbar/navbar";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StepsInput } from "../components/steps-input";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
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
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
    });
  }, [hydrated, contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

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
    setLoading(false);
    router.push("/steps/step-2");
  };

  return (
    <div className="relative min-h-screen bg-transparent px-4">
      <div className="relative w-full">
        <Navbar />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-teal-400/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 py-10">
            <div className="space-y-2 text-center mt-36">
              <h1 className="steps-heading whitespace-nowrap !text-[#1a2a3a]">
                Your Report Is Ready here
              </h1>
              <p className="steps-subheading text-sm leading-relaxed !text-slate-600">
                Enter your details to view your ADU eligibility score and next steps
              </p>
            </div>

            <div className="w-full space-y-3">
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

            {error && (
              <p className="w-full text-center font-dm-sans text-sm text-red-600">{error}</p>
            )}

            <StepsSubmitBtn
              onClick={handleSubmit}
              loading={loading}
              isComplete={Boolean(
                form.firstName.trim() && form.lastName.trim() &&
                form.email.trim() && form.phone.trim()
              )}
            />

            <StepFooter
              currentStep={2}
              totalSteps={7}
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
