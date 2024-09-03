import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export default async function Footer() {
  const session = await auth();
  return (
    <footer className="footer p-8 text-white bg-secondary">
      <div className=" w-full container flex flex-col items-center md:items-baseline space-y-8">
        <aside className="w-full flex justify-center md:justify-start">
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
        <nav className="gap-6 w-full flex flex-col md:flex-row justify-between items-center">
          <Link
            className="link link-hover text-lg font-Lato"
            href="/general-conditions">
            Conditions générales
          </Link>
          <Link
            className="link link-hover text-lg font-Lato"
            href="/privacy-and-cookies">
            Vie privée / cookies
          </Link>
          <Link
            className="link link-hover text-lg font-Lato"
            href="/credits-ref">
            Attributions et crédits
          </Link>
          <Link
            className="link link-hover text-lg font-Lato"
            href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
