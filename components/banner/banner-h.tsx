import Image from "next/image";

const BannerH = ({ variant }: { variant: string }) => {
  switch (variant) {
    case "1":
      return (
        <div className="space-y-4 my-2 flex justify-center mx-[250px]">
          <Image
            src="/images/banner/banner_h_1.jpg"
            className="object-cover w-full rounded-md shadow-md"
            width={1400}
            height={350}
            alt={"Bannier publicitaire 1"}
          />
        </div>
      );

    case "2":
      return (
        <div className="space-y-4 my-2 flex justify-center mx-[250px]">
          <Image
            src="/images/banner/bannier_rassurance.jpg"
            className="object-cover w-full rounded-md shadow-md"
            width={1400}
            height={350}
            alt={"Bannier rassurance"}
          />
        </div>
      );

    default:
      return <div></div>;
  }
};

export default BannerH;
