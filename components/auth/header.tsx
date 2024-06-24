import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });
interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex flex-col items-center w-full gap-y-4 justify-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}>
        {label ? (
          label
        ) : (
          <Image
            src="/images/logo/okaze-logo.png"
            alt="logo de l'application Okaze Réunion"
            className="w-full h-[90px]"
            width={170}
            height={90}
          />
        )}
      </h1>
    </div>
  );
};
