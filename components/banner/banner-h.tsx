import Image from "next/image";

const BannerH = ({ variant }: { variant: string }) => {
  switch (variant) {
    case "1":
      return (
        <>
          <div className="space-y-4 my-2  justify-center hidden md:flex">
            <Image
              src="/images/banner/banner_h_1.jpg"
              className="object-cover w-full rounded-md shadow-md"
              width={1400}
              height={350}
              priority
              alt={"Bannier publicitaire 1"}
            />
          </div>
          <div className="space-y-4 my-2 justify-center flex md:hidden">
            <Image
              src="/images/banner/banner_heros_v_1.png"
              className="object-cover w-full rounded-md shadow-md"
              width={355}
              height={575}
              priority
              alt={"Bannier publicitaire 1"}
            />
          </div>
        </>
      );

    case "2":
      return (
        <>
          <div className="space-y-4 my-2 justify-center hidden md:flex">
            <Image
              src="/images/banner/bannier_rassurance.jpg"
              className="object-cover w-full rounded-md shadow-md"
              width={1400}
              height={350}
              priority
              alt={"Bannier rassurance"}
            />
          </div>
          <div className="space-y-4 my-2 justify-center flex md:hidden">
            <Image
              src="/images/banner/bannier_rassurance_v.png"
              className="object-cover w-full rounded-md shadow-md"
              width={355}
              height={575}
              priority
              alt={"Bannier publicitaire 1"}
            />
          </div>
        </>
      );

    default:
      return <div></div>;
  }
};

export default BannerH;
