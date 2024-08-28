import Image from "next/image";

const Heros = () => {
  return (
    <div className="space-y-4 my-2 flex justify-center relative ">
      <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
      <Image
        src="/images/banner/herosBg.jpg"
        className="object-cover w-full max-h-[350px] rounded-md shadow-md"
        width={1400}
        height={350}
        priority
        alt={"Bannier avec une broquante en illustration"}
      />
      <div className="absolute ">
        <div className="flex justify-center">
          <Image
            src="/images/logo/okaze-logo-white.png "
            width={300}
            height={200}
            priority
            alt={"Logo de l'application Okaze"}
          />
        </div>
        <h1 className="text-3xl font-bold text-white font-Lato px-4 py-4 shadow-md w-auto text-center my-4 bg-primary rounded-md">
          L'ultime destination pour les chineurs !
        </h1>
      </div>
    </div>
  );
};

export default Heros;
