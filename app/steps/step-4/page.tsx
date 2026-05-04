"use client";

import React from "react";
import Navbar from "../../components/navbar/navbar";
import { useRouter } from "next/navigation";

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#4DB6AC"/>
    <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Step4Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    step1: null,
    step2: null,
    step3: null,
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const step1Data = localStorage.getItem("step1Data");
      const step2Data = localStorage.getItem("step2Data");
      const step3Data = localStorage.getItem("step3Data");

      setFormData({
        step1: step1Data ? JSON.parse(step1Data) : null,
        step2: step2Data ? JSON.parse(step2Data) : null,
        step3: step3Data ? JSON.parse(step3Data) : null,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    console.log("Form submitted:", formData);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("step1Data");
      localStorage.removeItem("step2Data");
      localStorage.removeItem("step3Data");
    }
  };

  const handleBack = () => {
    router.push("/steps/step-3");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0C1B2A] via-[#1a2f42] to-[#0C1B2A]">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-[35px] items-center p-6 sm:p-[45px] relative rounded-[40px] w-full max-w-[640px] mx-auto text-center">
            <div className="flex flex-col items-center gap-[24px]">
              <CheckIcon />
              <div className="flex flex-col gap-[12px]">
                <h1 
                  className="font-semibold text-[28px] sm:text-[36px] text-white leading-tight"
                  style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
                >
                  Thank You!
                </h1>
                <p 
                  className="text-[18px] sm:text-[22px] text-[#F5F7FA] leading-[28px]"
                  style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
                >
                  Your report is being prepared.<br />We'll contact you shortly with your ADU eligibility results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C1B2A] via-[#1a2f42] to-[#0C1B2A]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="max-w-[640px] mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-[18px] transition-all duration-300 ${
                      4 >= step
                        ? "bg-[#4DB6AC] text-white"
                        : "bg-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.5)]"
                    }`}
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {step}
                  </div>
                  <span
                    className={`mt-2 text-[12px] sm:text-[14px] ${
                      4 >= step ? "text-[#4DB6AC]" : "text-[rgba(255,255,255,0.5)]"
                    }`}
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    Step {step}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-[2px] mx-2 transition-all duration-300 ${
                      4 > step
                        ? "bg-[#4DB6AC]"
                        : "bg-[rgba(255,255,255,0.2)]"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-[35px] items-center p-6 sm:p-[45px] relative rounded-[40px] w-full max-w-[640px] mx-auto">
          <div className="relative w-full">
            <div className="flex flex-col gap-[12px] items-center justify-center text-center">
              <h1 
                className="font-semibold text-[28px] sm:text-[36px] text-white leading-tight"
                style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
              >
                Review Your Information
              </h1>
              <p 
                className="text-[18px] sm:text-[22px] text-[#F5F7FA] leading-[28px]"
                style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
              >
                Please confirm all details are correct
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="flex flex-col gap-[20px] items-start w-full">
              {formData.step1 && (
                <div className="bg-[rgba(255,255,255,0.1)] rounded-[11px] p-[24px] w-full">
                  <h3 
                    className="text-[#4DB6AC] text-[18px] font-semibold mb-4"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
                  >
                    Personal Information
                  </h3>
                  <div className="space-y-3 text-white">
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">Name:</span> {formData.step1.firstName} {formData.step1.lastName}
                    </p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">Email:</span> {formData.step1.email}
                    </p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">Phone:</span> {formData.step1.phone}
                    </p>
                  </div>
                </div>
              )}

              {formData.step2 && (
                <div className="bg-[rgba(255,255,255,0.1)] rounded-[11px] p-[24px] w-full">
                  <h3 
                    className="text-[#4DB6AC] text-[18px] font-semibold mb-4"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
                  >
                    Property Location
                  </h3>
                  <div className="space-y-3 text-white">
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">Address:</span> {formData.step2.address}
                    </p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">City, State:</span> {formData.step2.city}, {formData.step2.state}
                    </p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">ZIP:</span> {formData.step2.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {formData.step3 && (
                <div className="bg-[rgba(255,255,255,0.1)] rounded-[11px] p-[24px] w-full">
                  <h3 
                    className="text-[#4DB6AC] text-[18px] font-semibold mb-4"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
                  >
                    Property Details
                  </h3>
                  <div className="space-y-3 text-white">
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">Type:</span> {formData.step3.propertyType}
                    </p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      <span className="text-[#F5F7FA] opacity-70">Lot Size:</span> {formData.step3.lotSize}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-[15px] w-full mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="bg-[rgba(255,255,255,0.2)] drop-shadow-[0px_3px_5px_rgba(0,0,0,0.03)] flex gap-[9px] h-[64px] items-center justify-center rounded-full w-1/3 hover:bg-[rgba(255,255,255,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span 
                    className="font-semibold text-[18px] text-white"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
                  >
                    Back
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#4DB6AC] drop-shadow-[0px_3px_5px_rgba(0,0,0,0.03)] flex gap-[9px] h-[64px] items-center justify-center rounded-full w-2/3 hover:bg-[#45a89e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span 
                    className="font-semibold text-[18px] text-white"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
