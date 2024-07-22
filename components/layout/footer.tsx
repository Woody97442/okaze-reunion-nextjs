import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export default async function Footer() {
  const session = await auth();
  return (
    <footer className="footer p-8 text-white bg-secondary">
      <div className=" w-full container flex flex-row items-baseline">
        <aside className="w-full">
          <Link
            aria-label="logo de l'application Okaze Réunion"
            href="/">
            <Image
              src="/images/logo/okaze-logo-white.png"
              alt="logo de l'application Okaze Réunion"
              className="w-auto h-[90px]"
              width={200}
              height={90}
            />
          </Link>
        </aside>
        <nav className="gap-6 w-full flex flex-col md:flex-row justify-between">
          <Link
            className="link link-hover text-lg font-Lato"
            href="/">
            Politique de Confidentialité
          </Link>
          <Link
            className="link link-hover text-lg font-Lato"
            href="/">
            Termes et Conditions
          </Link>
          <Link
            className="link link-hover text-lg font-Lato"
            href="/">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
