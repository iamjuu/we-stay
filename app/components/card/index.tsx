import { RotateCcw, Building2, Home } from "lucide-react";

const steps = [
  {
    title: "Click",
    desc: "Check your property and understand your options.",
    icon: <RotateCcw size={18} className="text-white" />,
  },
  {
    title: "Build",
    desc: "Choose the right path, financing, and trusted team.",
    icon: <Building2 size={18} className="text-white" />,
  },
  {
    title: "Stay",
    desc: "Create long-term income or more space for life.",
    icon: <Home size={18} className="text-white" />,
  },
];

interface StepCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}
function StepCard({ title, desc, icon }: StepCardProps) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #0C1B2A 80%, #A2B8CE 280%)",
      }}
      className="rounded-2xl  border border-[#33506E] p-6 shadow-[5px_10px_20px_rgba(0,0,0,0.10)] backdrop-blur-xl"
    >
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10">
        {icon}
      </div>

      <h3
        style={{ fontFamily: "DM Sans" }}
        className="card-title font-[600] text-white"
      >
        {title}
      </h3>
      <p
        style={{ fontFamily: "DM Sans" }}
        className="card-paragraph font-[400] text-[#CECECE]"
      >
        {desc}
      </p>
    </div>
  );
}

export default function WeStaySection() {
  return (
    <section className="w-full bg-[#0C1B2A] py-[136px] w-full px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-[50px] max-w-7xl  px-20">
        <h2
          style={{ fontFamily: "DM Sans" }}
          className="section-heading text-center font-[500] text-white"
        >
          That&apos;s where <span className="text-white">WeStay</span>{" "}
          <span className="text-white/50">comes in.</span>
        </h2>

        <div className=" grid grid-cols-1 gap-[20px] sm:grid-cols-3">
          {steps.map((item, index) => (
            <StepCard
              key={index}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
