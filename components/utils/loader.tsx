import Image from "next/image";
import { PuffLoader } from "react-spinners";

const LoaderOkaze = () => {
  return (
    <div className="flex justify-center items-center h-full flex-col text-center space-y-6">
      <Image
        src="/images/logo/okaze-logo.png"
        alt="logo de l'application Okaze Réunion"
        className="h-[90px]"
        width={170}
        height={90}
      />
      <PuffLoader
        color="#2D8653"
        size={64}
      />
      <p className={"text-2xl text-black "}>Chargement</p>
    </div>
  );
};

export default LoaderOkaze;
