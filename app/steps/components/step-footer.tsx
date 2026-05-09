"use client";

import Image from "next/image";
import clickIcon from "@/content/icons/clickicon.svg";
import homeIcon from "@/content/icons/home.svg";
import zigzagIcon from "@/content/icons/zigzag.svg";

type StepFooterProps = {
  currentStep: number;
  totalSteps?: number;
  variant?: "default" | "step2" | "step5" | "step6";
  /** Left round control — previous step (always enabled when provided). */
  onBack?: () => void;
  /** Right round control — next step only if `canGoForward` (completed that leg before). */
  onForward?: () => void;
  canGoForward?: boolean;
};

function NavCircleWrap({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="relative z-10 shrink-0 cursor-pointer border-0 bg-transparent p-0 transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
      >
        {children}
      </button>
    );
  }
  return <div className="relative z-10 shrink-0">{children}</div>;
}

function FileIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={(size * 43) / 40}
      viewBox="0 0 40 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.0526 42.1053V35.6316L32.6842 24.0526C33 23.7368 33.3509 23.5088 33.7368 23.3684C34.1228 23.2281 34.5088 23.1579 34.8947 23.1579C35.3158 23.1579 35.7193 23.2368 36.1053 23.3947C36.4912 23.5526 36.8421 23.7895 37.1579 24.1053L39.1053 26.0526C39.386 26.3684 39.6053 26.7193 39.7632 27.1053C39.9211 27.4912 40 27.8772 40 28.2632C40 28.6491 39.9298 29.0439 39.7895 29.4474C39.6491 29.8509 39.4211 30.2105 39.1053 30.5263L27.5263 42.1053H21.0526ZM36.8421 28.2632L34.8947 26.3158L36.8421 28.2632ZM24.2105 38.9474H26.2105L32.5789 32.5263L31.6316 31.5263L30.6316 30.5789L24.2105 36.9474V38.9474ZM4.21053 42.1053C3.05263 42.1053 2.0614 41.693 1.23684 40.8684C0.412281 40.0439 0 39.0526 0 37.8947V4.21053C0 3.05263 0.412281 2.0614 1.23684 1.23684C2.0614 0.412281 3.05263 0 4.21053 0H21.0526L33.6842 12.6316V18.9474H29.4737V14.7368H18.9474V4.21053H4.21053V37.8947H16.8421V42.1053H4.21053ZM31.6316 31.5263L30.6316 30.5789L32.5789 32.5263L31.6316 31.5263Z"
        fill="white"
      />
    </svg>
  );
}

function TimeIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={(size * 26) / 32}
      viewBox="0 0 32 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3243 18.1336C13.9813 18.7906 14.8091 19.0994 15.8078 19.06C16.8064 19.0206 17.5291 18.6592 17.9759 17.9759L26.8062 4.7305L13.5608 13.5608C12.8775 14.0338 12.503 14.75 12.4373 15.7092C12.3716 16.6685 12.6672 17.4766 13.3243 18.1336ZM4.88819 25.2294C4.31002 25.2294 3.77783 25.1045 3.29164 24.8549C2.80545 24.6052 2.41781 24.2307 2.12873 23.7314C1.44543 22.4962 0.91982 21.215 0.551892 19.8878C0.183964 18.5607 0 17.1875 0 15.7684C0 13.5871 0.413919 11.5372 1.24176 9.61869C2.0696 7.70021 3.19309 6.03139 4.61224 4.61224C6.03139 3.19309 7.70021 2.0696 9.61869 1.24176C11.5372 0.413919 13.5871 0 15.7684C17.9234 0 19.947 0.407349 21.8392 1.22205C23.7314 2.03675 25.387 3.1471 26.8062 4.55311C28.2253 5.95912 29.3554 7.60166 30.1964 9.48072C31.0374 11.3598 31.471 13.3768 31.4973 15.5318C31.5236 16.9773 31.3593 18.3898 31.0045 19.7696C30.6497 21.1493 30.1044 22.4699 29.3686 23.7314C29.0795 24.2307 28.6918 24.6052 28.2056 24.8549C27.7194 25.1045 27.1873 25.2294 26.6091 25.2294H4.88819Z"
        fill="white"
      />
    </svg>
  );
}

const ACTIVE_OUTER_PX = 100;
const ACTIVE_INNER_PX = Math.round((70 / 85) * ACTIVE_OUTER_PX);
const SECOND_CIRCLE_PX = 70;
const STEP2_ACTIVE_PX = 120;

export function StepFooter({
  currentStep,
  totalSteps = 7,
  variant = "default",
  onBack,
  onForward,
  canGoForward = false,
}: StepFooterProps) {
  const isDone = currentStep >= totalSteps;
  const firstIconOverlap = ACTIVE_OUTER_PX / 2;
  const fwdDisabled = !canGoForward;

  if (variant === "step2") {
    return (
      <div className="w-full pt-2 pb-6">
        <div className="relative flex items-center justify-between">
          <div className="pointer-events-none absolute left-[35px] right-[35px] top-1/2 h-px -translate-y-1/2 bg-teal-400/30" />

          <NavCircleWrap onClick={onBack} label="Go to previous step">
            <div
              className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
              style={{ width: SECOND_CIRCLE_PX, height: SECOND_CIRCLE_PX, backgroundColor: "#4DB6AC33" }}
            >
              <TimeIcon size={28} />
            </div>
          </NavCircleWrap>

          <div
            className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
            style={{ width: STEP2_ACTIVE_PX, height: STEP2_ACTIVE_PX, backgroundColor: "#579da440" }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 92, height: 92, backgroundColor: "#4DB6AC" }}
            >
              <Image src={clickIcon} alt="" width={40} height={40} aria-hidden />
            </div>
          </div>

          <NavCircleWrap
            onClick={onForward}
            disabled={fwdDisabled}
            label="Go to next step"
          >
            <div
              className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
              style={{ width: SECOND_CIRCLE_PX, height: SECOND_CIRCLE_PX, backgroundColor: "#4DB6AC33" }}
            >
              <Image src={homeIcon} alt="" width={28} height={31.5} className="brightness-0 invert" aria-hidden />
            </div>
          </NavCircleWrap>

          <p className="pointer-events-none absolute left-[74%] top-1/2 -translate-x-1/2 -translate-y-[15px] whitespace-nowrap text-xs tracking-wide text-slate-300">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "step5") {
    return (
      <div className="w-full pt-2 pb-6">
        <div className="relative flex items-center justify-between">
          <div className="pointer-events-none absolute left-[35px] right-[35px] top-1/2 h-px -translate-y-1/2 bg-teal-400/30" />

          <NavCircleWrap onClick={onBack} label="Go to previous step">
            <div
              className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
              style={{ width: SECOND_CIRCLE_PX, height: SECOND_CIRCLE_PX, backgroundColor: "#4DB6AC33" }}
            >
              <Image src={clickIcon} alt="" width={28} height={28} aria-hidden />
            </div>
          </NavCircleWrap>

          <div
            className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
            style={{ width: STEP2_ACTIVE_PX, height: STEP2_ACTIVE_PX, backgroundColor: "#579da440" }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 92, height: 92, backgroundColor: "#4DB6AC" }}
            >
              <Image src={homeIcon} alt="" width={28} height={31.5} aria-hidden />
            </div>
          </div>

          <NavCircleWrap
            onClick={onForward}
            disabled={fwdDisabled}
            label="Go to next step"
          >
            <div
              className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
              style={{ width: SECOND_CIRCLE_PX, height: SECOND_CIRCLE_PX, backgroundColor: "#4DB6AC33" }}
            >
              <Image src={zigzagIcon} alt="" width={28} height={28} aria-hidden />
            </div>
          </NavCircleWrap>

          <p
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 translate-y-[-15px] whitespace-nowrap text-xs tracking-wide text-slate-300"
            style={{ left: "calc(75% - 18px)" }}
          >
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "step6") {
    return (
      <div className="w-full pt-2 pb-6">
        <div className="relative flex items-center justify-between">
          <div className="pointer-events-none absolute left-[35px] right-[35px] top-1/2 h-px -translate-y-1/2 bg-teal-400/30" />

          <NavCircleWrap onClick={onBack} label="Go to previous step">
            <div
              className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
              style={{ width: SECOND_CIRCLE_PX, height: SECOND_CIRCLE_PX, backgroundColor: "#4DB6AC33" }}
            >
              <Image src={homeIcon} alt="" width={28} height={31.5} aria-hidden />
            </div>
          </NavCircleWrap>

          <div
            className="relative z-10 flex shrink-0 items-center justify-center rounded-full"
            style={{ width: STEP2_ACTIVE_PX, height: STEP2_ACTIVE_PX, backgroundColor: "#579da440" }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 92, height: 92, backgroundColor: "#4DB6AC" }}
            >
              <Image src={zigzagIcon} alt="" width={28} height={28} aria-hidden />
            </div>
          </div>

          <NavCircleWrap
            onClick={onForward}
            disabled={fwdDisabled}
            label="Go to next step"
          >
            <div
              className={`relative z-10 flex shrink-0 items-center justify-center rounded-full ${onForward ? "" : "opacity-0"}`}
              style={{ width: SECOND_CIRCLE_PX, height: SECOND_CIRCLE_PX, backgroundColor: "#4DB6AC33" }}
              aria-hidden={!onForward}
            />
          </NavCircleWrap>

          <p
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 translate-y-[-15px] whitespace-nowrap text-xs tracking-wide text-slate-300"
            style={{ left: "calc(75% - 18px)" }}
          >
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-0 pt-2 pb-6">
      <div className="w-1/2 shrink-0" aria-hidden />

      <div className="flex min-w-0 flex-1 items-center" style={{ marginLeft: -firstIconOverlap }}>
        <NavCircleWrap onClick={onBack} label="Go to previous step">
          <div
            className="relative flex shrink-0 items-center justify-center rounded-full"
            style={{ width: ACTIVE_OUTER_PX, height: ACTIVE_OUTER_PX, backgroundColor: "#579da440" }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: ACTIVE_INNER_PX, height: ACTIVE_INNER_PX, backgroundColor: "#4DB6AC" }}
            >
              <FileIcon size={38} />
            </div>
          </div>
        </NavCircleWrap>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-3">
          <p className="whitespace-nowrap text-xs tracking-wide text-slate-400">
            Step {currentStep} of {totalSteps}
          </p>
          <div className="h-px w-full bg-white/10">
            <div
              className="h-full bg-teal-400/50 transition-all duration-500"
              style={{ width: isDone ? "100%" : "0%" }}
            />
          </div>
        </div>

        <NavCircleWrap
          onClick={onForward}
          disabled={fwdDisabled}
          label="Go to next step"
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: SECOND_CIRCLE_PX,
              height: SECOND_CIRCLE_PX,
              backgroundColor: "#4DB6AC33",
              borderRadius: "50%",
            }}
          >
            <TimeIcon size={28} />
          </div>
        </NavCircleWrap>
      </div>
    </div>
  );
}
