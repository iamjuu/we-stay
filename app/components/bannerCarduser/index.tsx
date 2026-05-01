import Image from "next/image";
import {
  BannerCardUserAvatar1,
  BannerCardUserAvatar2,
  BannerCardUserAvatar3,
  BannerCardUserAvatar4,
  BannerCardUserStars,
} from "@/content";

const avatars = [
  {
    src: BannerCardUserAvatar1,
    alt: "Customer avatar 1",
  },
  {
    src: BannerCardUserAvatar2,
    alt: "Customer avatar 2",
  },
  {
    src: BannerCardUserAvatar3,
    alt: "Customer avatar 3",
  },
  {
    src: BannerCardUserAvatar4,
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
            key={avatar.alt}
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
          src={BannerCardUserStars}
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
