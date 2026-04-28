const logoSrc = "https://www.figma.com/api/mcp/asset/1b3313eb-8167-4153-afb7-10d72e0a192a";

const navItems = ["About", "Design Your ADU", "How It Works"];

const Navbar = () => {
  return (
    <nav className="w-full px-4 py-4 sm:px-6 lg:px-8">
      <div
        className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 rounded-[34px] border-b border-r border-[#bdbdbd] bg-[rgba(255,255,255,0.3)] px-5 py-4 shadow-[0px_3px_10px_0px_rgba(0,0,0,0.05),0px_3px_10px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px] sm:rounded-[40px] sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:rounded-[50px] lg:px-[42px] lg:py-[10px]"
        data-node-id="11:7024"
        data-name="Nav Bar"
      >
        <div
          className="relative h-[60px] w-[108px] shrink-0 sm:h-[70px] sm:w-[124px] lg:h-[78px] lg:w-[139px]"
          data-node-id="10:7005"
          data-name="WeStay Logo 1"
        >
          <img
            alt="WeStay logo"
            className="h-full w-full object-contain"
            src={logoSrc}
          />
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center text-[16px] font-normal leading-none text-black sm:text-[18px] lg:gap-[50px]"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
          data-node-id="11:7027"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="whitespace-nowrap transition-opacity duration-200 hover:opacity-70"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="#"
          className="flex h-[46px] shrink-0 items-center justify-center self-center rounded-[25px] bg-[#ff6b5c] px-6 text-[14px] font-semibold leading-[14px] text-white transition-colors duration-200 hover:bg-[#f45c4d] lg:self-auto"
          style={{ fontFamily: '"DM Sans", sans-serif', fontVariationSettings: "'opsz' 14" }}
          data-node-id="11:8158"
          data-name="Book a call CTA"
        >
          Book A Call
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
