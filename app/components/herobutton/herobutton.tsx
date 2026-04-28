type HeroButtonProps = {
  placeholder?: string;
  buttonLabel?: string;
};

const HeroButton = ({
  placeholder = "Enter your O'ahu, Hawai'i address",
  buttonLabel = "Check Eligibility",
}: HeroButtonProps) => {
  return (
    <div
className="flex w-full max-w-[570px] flex-col gap-3 rounded-full bg-black/50 backdrop-blur-2xl p-2 shadow-[0px_3px_10px_0px_rgba(0,0,0,0.15)] sm:flex-row sm:items-center sm:gap-4 sm:pl-5"      data-node-id="11:8243"
    >
      <input
        type="text"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-center text-[22px] font-light leading-[1.2] text-[#adadad] outline-none placeholder:text-[#adadad] sm:px-0 sm:py-0 sm:text-left"
        style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
        aria-label="Address"
      />
      <button
        type="button"
        className="font-dm-sans flex h-[55px] shrink-0 items-center justify-center rounded-[30px] bg-[#ff6b5c] px-6 text-[14px] font-semibold leading-[14px] text-white transition-colors duration-200 hover:bg-[#f45c4d]"
        data-node-id="11:8246"
        data-name="Check eligibility CTA"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default HeroButton;
