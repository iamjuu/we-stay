"use client";

import Image from "next/image";
import clickIcon from "@/content/icons/clickicon.svg";
import homeIcon from "@/content/icons/home.svg";
import zigzagIcon from "@/content/icons/zigzag.svg";

type StepFooterProps = {
  currentStep: number;
  totalSteps?: number;
  variant?: "default" | "step2" | "step3" | "step5" | "step6";
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
      height={Math.round((size * 37) / 45)}
      viewBox="0 0 45 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.0347 25.9051C19.9732 26.8437 21.1559 27.2849 22.5825 27.2286C24.0092 27.1722 25.0416 26.656 25.6799 25.6799L38.2946 6.75786L19.3725 19.3725C18.3964 20.0483 17.8614 21.0714 17.7676 22.4417C17.6737 23.8121 18.0961 24.9666 19.0347 25.9051ZM6.98313 36.0419C6.15717 36.0419 5.39691 35.8636 4.70235 35.5069C4.00779 35.1503 3.45402 34.6153 3.04104 33.902C2.0649 32.1374 1.31403 30.3071 0.788417 28.4112C0.262806 26.5152 0 24.5536 0 22.5262C0 19.4101 0.591313 16.4817 1.77394 13.741C2.95657 11.0003 4.56156 8.61628 6.58892 6.58892C8.61628 4.56156 11.0003 2.95657 13.741 1.77394C16.4817 0.591313 19.4101 0 22.5262 0C25.6048 0 28.4957 0.581927 31.1988 1.74578C33.902 2.90964 36.2672 4.49586 38.2946 6.50444C40.3219 8.51303 41.9363 10.8595 43.1377 13.5439C44.3391 16.2283 44.9586 19.1097 44.9961 22.1883C45.0337 24.2532 44.799 26.2712 44.2922 28.2422C43.7853 30.2133 43.0063 32.0999 41.9551 33.902C41.5421 34.6153 40.9883 35.1503 40.2938 35.5069C39.5992 35.8636 38.8389 36.0419 38.013 36.0419H6.98313Z"
        fill="white"
      />
    </svg>
  );
}

const ACTIVE_OUTER_PX = 100;
const ACTIVE_INNER_PX = Math.round((70 / 85) * ACTIVE_OUTER_PX);
const SECOND_CIRCLE_PX = 70;
const STEP2_ACTIVE_PX = 120;

/** Above backdrop fills (z-0), below nodes (z-10) so the track shows through the circles, not over the icons. */
const WIZARD_TRACK_CONNECTOR =
  "pointer-events-none absolute left-[35px] right-[35px] top-1/2 z-[1] h-px -translate-y-1/2 bg-teal-400/30";

function WizardThreeDotBackdrops() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-between"
      aria-hidden
    >
      <div
        className="shrink-0 rounded-full"
        style={{
          width: SECOND_CIRCLE_PX,
          height: SECOND_CIRCLE_PX,
          backgroundColor: "#4DB6AC33",
        }}
      />
      <div
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: STEP2_ACTIVE_PX,
          height: STEP2_ACTIVE_PX,
          backgroundColor: "#579da440",
        }}
      />
      <div
        className="shrink-0 rounded-full"
        style={{
          width: SECOND_CIRCLE_PX,
          height: SECOND_CIRCLE_PX,
          backgroundColor: "#4DB6AC33",
        }}
      />
    </div>
  );
}

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
        <div className="relative flex w-full items-center justify-between">
          <WizardThreeDotBackdrops />
          <div className={WIZARD_TRACK_CONNECTOR} aria-hidden />

          <NavCircleWrap onClick={onBack} label="Go to previous step">
            <div
              className="relative flex shrink-0 items-center justify-center rounded-full bg-transparent"
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
            >
              <span className="relative z-[11] flex items-center justify-center">
              <svg
                width="28"
                height="30"
                viewBox="0 0 28 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M14.7368 29.4737V24.9421L22.8789 16.8368C23.1 16.6158 23.3456 16.4561 23.6158 16.3579C23.886 16.2596 24.1561 16.2105 24.4263 16.2105C24.7211 16.2105 25.0035 16.2658 25.2737 16.3763C25.5439 16.4868 25.7895 16.6526 26.0105 16.8737L27.3737 18.2368C27.5702 18.4579 27.7237 18.7035 27.8342 18.9737C27.9447 19.2439 28 19.514 28 19.7842C28 20.0544 27.9509 20.3307 27.8526 20.6132C27.7544 20.8956 27.5947 21.1474 27.3737 21.3684L19.2684 29.4737H14.7368ZM25.7895 19.7842L24.4263 18.4211L25.7895 19.7842ZM16.9474 27.2632H18.3474L22.8053 22.7684L22.1421 22.0684L21.4421 21.4053L16.9474 25.8632V27.2632ZM2.94737 29.4737C2.13684 29.4737 1.44298 29.1851 0.865789 28.6079C0.288596 28.0307 0 27.3368 0 26.5263V2.94737C0 2.13684 0.288596 1.44298 0.865789 0.865789C1.44298 0.288596 2.13684 0 2.94737 0H14.7368L23.5789 8.8421V13.2632H20.6316V10.3158H13.2632V2.94737H2.94737V26.5263H11.7895V29.4737H2.94737ZM22.1421 22.0684L21.4421 21.4053L22.8053 22.7684L22.1421 22.0684Z"
                  fill="white"
                />
              </svg>
              </span>
            </div>
          </NavCircleWrap>

          <div
            className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-transparent"
            style={{
              width: STEP2_ACTIVE_PX,
              height: STEP2_ACTIVE_PX,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ backgroundColor: "#4DB6AC" }}
            />
            <div className="relative z-[11] flex items-center justify-center">
              <svg
                width="45"
                height="37"
                viewBox="0 0 45 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.0347 25.9051C19.9732 26.8437 21.1559 27.2849 22.5825 27.2286C24.0092 27.1722 25.0416 26.656 25.6799 25.6799L38.2946 6.75786L19.3725 19.3725C18.3964 20.0483 17.8614 21.0714 17.7676 22.4417C17.6737 23.8121 18.0961 24.9666 19.0347 25.9051ZM6.98313 36.0419C6.15717 36.0419 5.39691 35.8636 4.70235 35.5069C4.00779 35.1503 3.45402 34.6153 3.04104 33.902C2.0649 32.1374 1.31403 30.3071 0.788417 28.4112C0.262806 26.5152 0 24.5536 0 22.5262C0 19.4101 0.591313 16.4817 1.77394 13.741C2.95657 11.0003 4.56156 8.61628 6.58892 6.58892C8.61628 4.56156 11.0003 2.95657 13.741 1.77394C16.4817 0.591313 19.4101 0 22.5262 0C25.6048 0 28.4957 0.581927 31.1988 1.74578C33.902 2.90964 36.2672 4.49586 38.2946 6.50444C40.3219 8.51303 41.9363 10.8595 43.1377 13.5439C44.3391 16.2283 44.9586 19.1097 44.9961 22.1883C45.0337 24.2532 44.799 26.2712 44.2922 28.2422C43.7853 30.2133 43.0063 32.0999 41.9551 33.902C41.5421 34.6153 40.9883 35.1503 40.2938 35.5069C39.5992 35.8636 38.8389 36.0419 38.013 36.0419H6.98313Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <NavCircleWrap
            onClick={onForward}
            disabled={fwdDisabled}
            label="Go to next step"
          >
            <div
              className="relative flex shrink-0 items-center justify-center rounded-full bg-transparent"
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
            >
              <span className="relative z-[11] flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M14.9049 24.5854C12.4463 24.4573 10.372 23.5098 8.68171 21.7427C6.99146 19.9756 6.14634 17.85 6.14634 15.3659C6.14634 12.8049 7.04268 10.628 8.83537 8.83537C10.628 7.04268 12.8049 6.14634 15.3659 6.14634C17.85 6.14634 19.9756 6.99146 21.7427 8.68171C23.5098 10.372 24.4573 12.4463 24.5854 14.9049L21.3585 13.9445C21.0256 12.5616 20.3085 11.4284 19.2073 10.5448C18.1061 9.66128 16.8256 9.21951 15.3659 9.21951C13.6756 9.21951 12.2287 9.82134 11.025 11.025C9.82134 12.2287 9.21951 13.6756 9.21951 15.3659C9.21951 16.8256 9.66128 18.1061 10.5448 19.2073C11.4284 20.3085 12.5616 21.0256 13.9445 21.3585L14.9049 24.5854ZM16.7488 30.6549C16.5183 30.7061 16.2878 30.7317 16.0573 30.7317C15.8268 30.7317 15.5963 30.7317 15.3659 30.7317C13.2402 30.7317 11.2427 30.3284 9.37317 29.5216C7.50366 28.7149 5.87744 27.6201 4.49451 26.2372C3.11159 24.8543 2.01677 23.228 1.21006 21.3585C0.403354 19.489 0 17.4915 0 15.3659C0 13.2402 0.403354 11.2427 1.21006 9.37317C2.01677 7.50366 3.11159 5.87744 4.49451 4.49451C5.87744 3.11159 7.50366 2.01677 9.37317 1.21006C11.2427 0.403354 13.2402 0 15.3659 0C17.4915 0 19.489 0.403354 21.3585 1.21006C23.228 2.01677 24.8543 3.11159 26.2372 4.49451C27.6201 5.87744 28.7149 7.50366 29.5216 9.37317C30.3284 11.2427 30.7317 13.2402 30.7317 15.3659C30.7317 15.5963 30.7317 15.8268 30.7317 16.0573C30.7317 16.2878 30.7061 16.5183 30.6549 16.7488L27.6585 15.8268V15.3659C27.6585 11.9341 26.4677 9.02744 24.086 6.64573C21.7043 4.26402 18.7976 3.07317 15.3659 3.07317C11.9341 3.07317 9.02744 4.26402 6.64573 6.64573C4.26402 9.02744 3.07317 11.9341 3.07317 15.3659C3.07317 18.7976 4.26402 21.7043 6.64573 24.086C9.02744 26.4677 11.9341 27.6585 15.3659 27.6585C15.4427 27.6585 15.5195 27.6585 15.5963 27.6585C15.6732 27.6585 15.75 27.6585 15.8268 27.6585L16.7488 30.6549ZM28.4652 31.5L21.8963 24.9311L19.9756 30.7317L15.3659 15.3659L30.7317 19.9756L24.9311 21.8963L31.5 28.4652L28.4652 31.5Z"
                  fill="white"
                />
              </svg>
              </span>
            </div>
          </NavCircleWrap>

          <p className="pointer-events-none absolute left-[74%] top-1/2 z-[3] -translate-x-1/2 translate-y-[-15px] whitespace-nowrap text-xs tracking-wide text-white/50">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "step3") {
    return (
      <div className="w-full pt-2 pb-6">
        <div className="relative flex w-full items-center justify-between">
          <WizardThreeDotBackdrops />
          <div className={WIZARD_TRACK_CONNECTOR} aria-hidden />

          <NavCircleWrap onClick={onBack} label="Go to previous step">
            <div
              className="relative flex shrink-0 items-center justify-center rounded-full bg-transparent"
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
            >
              <span className="relative z-[11] flex items-center justify-center">
              <svg
                width="32"
                height="26"
                viewBox="0 0 32 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M13.3243 18.1336C13.9813 18.7906 14.8091 19.0994 15.8078 19.06C16.8064 19.0206 17.5291 18.6592 17.9759 17.9759L26.8062 4.7305L13.5608 13.5608C12.8775 14.0338 12.503 14.75 12.4373 15.7092C12.3716 16.6685 12.6672 17.4766 13.3243 18.1336ZM4.88819 25.2294C4.31002 25.2294 3.77783 25.1045 3.29164 24.8549C2.80545 24.6052 2.41781 24.2307 2.12873 23.7314C1.44543 22.4962 0.91982 21.215 0.551892 19.8878C0.183964 18.5607 0 17.1875 0 15.7684C0 13.5871 0.413919 11.5372 1.24176 9.61869C2.0696 7.70021 3.19309 6.03139 4.61224 4.61224C6.03139 3.19309 7.70021 2.0696 9.61869 1.24176C11.5372 0.413919 13.5871 0 15.7684C17.9234 0 19.947 0.407349 21.8392 1.22205C23.7314 2.03675 25.387 3.1471 26.8062 4.55311C28.2253 5.95912 29.3554 7.60166 30.1964 9.48072C31.0374 11.3598 31.471 13.3768 31.4973 15.5318C31.5236 16.9773 31.3593 18.3898 31.0045 19.7696C30.6497 21.1493 30.1044 22.4699 29.3686 23.7314C29.0795 24.2307 28.6918 24.6052 28.2056 24.8549C27.7194 25.1045 27.1873 25.2294 26.6091 25.2294H4.88819Z"
                  fill="white"
                />
              </svg>
              </span>
            </div>
          </NavCircleWrap>

          <div
            className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-transparent"
            style={{
              width: STEP2_ACTIVE_PX,
              height: STEP2_ACTIVE_PX,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ backgroundColor: "#4DB6AC" }}
            />
            <div className="relative z-[11] flex items-center justify-center">
              <svg
                width="45"
                height="37"
                viewBox="0 0 45 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.0347 25.9051C19.9732 26.8437 21.1559 27.2849 22.5825 27.2286C24.0092 27.1722 25.0416 26.656 25.6799 25.6799L38.2946 6.75786L19.3725 19.3725C18.3964 20.0483 17.8614 21.0714 17.7676 22.4417C17.6737 23.8121 18.0961 24.9666 19.0347 25.9051ZM6.98313 36.0419C6.15717 36.0419 5.39691 35.8636 4.70235 35.5069C4.00779 35.1503 3.45402 34.6153 3.04104 33.902C2.0649 32.1374 1.31403 30.3071 0.788417 28.4112C0.262806 26.5152 0 24.5536 0 22.5262C0 19.4101 0.591313 16.4817 1.77394 13.741C2.95657 11.0003 4.56156 8.61628 6.58892 6.58892C8.61628 4.56156 11.0003 2.95657 13.741 1.77394C16.4817 0.591313 19.4101 0 22.5262 0C25.6048 0 28.4957 0.581927 31.1988 1.74578C33.902 2.90964 36.2672 4.49586 38.2946 6.50444C40.3219 8.51303 41.9363 10.8595 43.1377 13.5439C44.3391 16.2283 44.9586 19.1097 44.9961 22.1883C45.0337 24.2532 44.799 26.2712 44.2922 28.2422C43.7853 30.2133 43.0063 32.0999 41.9551 33.902C41.5421 34.6153 40.9883 35.1503 40.2938 35.5069C39.5992 35.8636 38.8389 36.0419 38.013 36.0419H6.98313Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <NavCircleWrap
            onClick={onForward}
            disabled={fwdDisabled}
            label="Go to next step"
          >
            <div
              className="relative flex shrink-0 items-center justify-center rounded-full bg-transparent"
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
            >
              <span className="relative z-[11] flex items-center justify-center">
              <svg
                width="28"
                height="32"
                viewBox="0 0 28 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M0 31.5V10.5L14 0L28 10.5V31.5H17.5V19.25H10.5V31.5H0Z"
                  fill="white"
                />
              </svg>
              </span>
            </div>
          </NavCircleWrap>

          <p className="pointer-events-none absolute left-[74%] top-1/2 z-[3] -translate-x-1/2 translate-y-[-15px] whitespace-nowrap text-xs tracking-wide text-white/50">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "step5") {
    return (
      <div className="w-full pt-2 pb-6">
        <div className="relative flex w-full items-center justify-between">
          <WizardThreeDotBackdrops />
          <div className={WIZARD_TRACK_CONNECTOR} aria-hidden />

          <NavCircleWrap onClick={onBack} label="Go to previous step">
            <div
              className="relative flex shrink-0 items-center justify-center rounded-full bg-transparent"
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
            >
              <Image
                className="relative z-[11]"
                src={clickIcon}
                alt=""
                width={28}
                height={28}
                aria-hidden
              />
            </div>
          </NavCircleWrap>

          <div
            className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-transparent"
            style={{
              width: STEP2_ACTIVE_PX,
              height: STEP2_ACTIVE_PX,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ backgroundColor: "#4DB6AC" }}
            />
            <Image
              className="relative z-[11]"
              src={homeIcon}
              alt=""
              width={28}
              height={31.5}
              aria-hidden
            />
          </div>

          <NavCircleWrap
            onClick={onForward}
            disabled={fwdDisabled}
            label="Go to next step"
          >
            <div
              className="relative flex shrink-0 items-center justify-center rounded-full bg-transparent"
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
            >
              <Image
                className="relative z-[11]"
                src={zigzagIcon}
                alt=""
                width={28}
                height={28}
                aria-hidden
              />
            </div>
          </NavCircleWrap>

          <p
            className="pointer-events-none absolute top-1/2 z-[3] -translate-x-1/2 translate-y-[-15px] whitespace-nowrap text-xs tracking-wide text-slate-300"
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
        <div className="relative flex w-full items-center justify-between">
          <WizardThreeDotBackdrops />
          <div className={WIZARD_TRACK_CONNECTOR} aria-hidden />

          <NavCircleWrap onClick={onBack} label="Go to previous step">
            <div
              className="relative flex shrink-0 items-center justify-center rounded-full bg-transparent"
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
            >
              <Image
                className="relative z-[11]"
                src={homeIcon}
                alt=""
                width={28}
                height={31.5}
                aria-hidden
              />
            </div>
          </NavCircleWrap>

          <div
            className="relative z-10 flex shrink-0 items-center justify-center rounded-full bg-transparent"
            style={{
              width: STEP2_ACTIVE_PX,
              height: STEP2_ACTIVE_PX,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ backgroundColor: "#4DB6AC" }}
            />
            <Image
              className="relative z-[11]"
              src={zigzagIcon}
              alt=""
              width={28}
              height={28}
              aria-hidden
            />
          </div>

          <NavCircleWrap
            onClick={onForward}
            disabled={fwdDisabled}
            label="Go to next step"
          >
            <div
              className={`relative flex shrink-0 items-center justify-center rounded-full bg-transparent ${onForward ? "" : "opacity-0"}`}
              style={{
                width: SECOND_CIRCLE_PX,
                height: SECOND_CIRCLE_PX,
              }}
              aria-hidden={!onForward}
            />
          </NavCircleWrap>

          <p
            className="pointer-events-none absolute top-1/2 z-[3] -translate-x-1/2 translate-y-[-15px] whitespace-nowrap text-xs tracking-wide text-slate-300"
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

      <div
        className="flex min-w-0 flex-1 items-center"
        style={{ marginLeft: -firstIconOverlap }}
      >
        <NavCircleWrap onClick={onBack} label="Go to previous step">
          <div
            className="relative flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: ACTIVE_OUTER_PX,
              height: ACTIVE_OUTER_PX,
              backgroundColor: "#579da440",
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: ACTIVE_INNER_PX,
                height: ACTIVE_INNER_PX,
                backgroundColor: "#4DB6AC",
              }}
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
