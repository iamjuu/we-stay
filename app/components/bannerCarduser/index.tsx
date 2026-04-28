import Image from "next/image";

const avatars = [
  {
    src: "/assets/banner-card-user/avatar-1.png",
    alt: "Customer avatar 1",
  },
  {
    src: "/assets/banner-card-user/avatar-2.png",
    alt: "Customer avatar 2",
  },
  {
    src: "/assets/banner-card-user/avatar-3.png",
    alt: "Customer avatar 3",
  },
  {
    src: "/assets/banner-card-user/avatar-4.png",
    alt: "Customer avatar 4",
  },
];

export default function BannerCardUser() {
  return (
    <div className="inline-flex w-fit items-center gap-2.5 rounded-full border-[7px] border-white bg-[#F3FFFE] p-[15px]">
      <div
        aria-label="Trusted customers"
        className="flex items-center"
        role="img"
      >
        {avatars.map((avatar, index) => (
          <Image
            key={avatar.src}
            alt={avatar.alt}
            className={`h-[30px] w-[30px] rounded-full object-cover ${
              index === 0 ? "" : "-ml-[15px]"
            }`}
            src={avatar.src}
            width={30}
            height={30}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 grid-rows-1 items-start">
        <Image
          alt="Five star rating"
          className="col-start-1 row-start-1 h-[14.82px] w-[78.07px]"
          src="/assets/banner-card-user/stars.png"
          width={79}
          height={15}
        />
        <p
          className="col-start-1 row-start-1 ml-[2px] mt-[11.81px] text-[12px] font-light leading-[26px] text-[#3D3D3D]"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Trusted by 5.000+ Customers
        </p>
      </div>
    </div>
  );
}
