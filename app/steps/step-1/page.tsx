"use client";

import Navbar from "@/app/components/navbar/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepsInput } from "../components/steps-input";
import { StepsSubmitBtn } from "../components/steps-submit-btn";
import { StepFooter } from "../components/step-footer";

export default function ReportForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push("/steps/step-2");
  };

  return (
    <div className="min-h-screen flex  bg-gradient-to-br from-[#1a2a3a] via-[#1e3448] to-[#162534] px-4">
     
     <div className=" w-full">
      <Navbar/>

     
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[120px]" />
      </div>

      {/* Outer max-width container */}
      <div className="relative w-full   max-w-7xl mx-auto">
        
        {/* Centered inner card — constrained to ~440px for form readability */}
        <div className="w-full max-w-[550px] mx-auto flex flex-col items-center gap-6 py-10">
          
          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="steps-heading !text-white whitespace-nowrap">
              Your Report Is Being Prepared
            </h1>
            <p className=" steps-subheading  !text-[#F5F7FA] text-sm leading-relaxed ">
              Enter your details to unlock your ADU eligibility score and next steps
            </p>
          </div>

          {/* Fields */}
          <div className="w-full space-y-3">
            
            {/* First + Last row */}
            <div className="flex gap-3">
              <StepsInput type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
              <StepsInput type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
            </div>

            <StepsInput type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />

            <StepsInput type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
          </div>

          <StepsSubmitBtn onClick={handleSubmit} loading={loading} />

          <StepFooter currentStep={1} />

        </div>
      </div>
    
      </div>

        </div>

  );
}