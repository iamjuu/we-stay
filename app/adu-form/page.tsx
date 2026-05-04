"use client";

import React from "react";
import Navbar from "../components/navbar/navbar";
import Step1 from "../steps/step1";
import Step2 from "../steps/step2";
import Step3 from "../steps/step3";
import Step4 from "../steps/step4";

export default function AduFormPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    step1: null,
    step2: null,
    step3: null,
  });

  const handleStep1Next = (data: any) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: any) => {
    setFormData((prev) => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleStep3Next = (data: any) => {
    setFormData((prev) => ({ ...prev, step3: data }));
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

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
                      currentStep >= step
                        ? "bg-[#4DB6AC] text-white"
                        : "bg-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.5)]"
                    }`}
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {step}
                  </div>
                  <span
                    className={`mt-2 text-[12px] sm:text-[14px] ${
                      currentStep >= step ? "text-[#4DB6AC]" : "text-[rgba(255,255,255,0.5)]"
                    }`}
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    Step {step}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-[2px] mx-2 transition-all duration-300 ${
                      currentStep > step
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
        <div className="w-full">
          {currentStep === 1 && <Step1 onNext={handleStep1Next} />}
          {currentStep === 2 && <Step2 onNext={handleStep2Next} onBack={handleBack} />}
          {currentStep === 3 && <Step3 onNext={handleStep3Next} onBack={handleBack} />}
          {currentStep === 4 && <Step4 onBack={handleBack} formData={formData} />}
        </div>
      </div>
    </div>
  );
}
