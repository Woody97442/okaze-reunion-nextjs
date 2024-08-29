"use client";

import Link from "next/link";
import Image from "next/image";

const CreditsRefContent = () => {
  return (
    <>
      <div className="flex flex-row space-x-6 h-full w-full">
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
          <h2 className="text-2xl text-black drop-shadow-md font-bold">
            Attributions et credits
          </h2>
          <ul className="text-black mt-4 flex flex-col gap-y-3">
            <li className="flex flex-row gap-x-4 items-center">
              <Image
                alt={
                  "Image de freepik Assortiment d'objets du marché d'antiquité"
                }
                className="rounded-md shadow-md"
                width="150"
                height="150"
                src={"/images/broquante_1.jpg"}
              />
              <Link
                className="text-secondary cursor-pointer hover:underline"
                rel="noopener noreferrer"
                target="_blank"
                href="https://fr.freepik.com/photos-gratuite/assortiment-objets-du-marche-antiquites_13844220.htm#fromView=search&page=1&position=3&uuid=29847d9c-11d5-48df-b38b-97beb2549d9c">
                Image de freepik Assortiment d'objets du marché d'antiquités
              </Link>
            </li>
            <li className="flex flex-row gap-x-4 items-center">
              <Image
                alt={
                  "Image de freepik Scène avec des articles divers vendus à une vente de cour pour des bonnes affaires."
                }
                className="rounded-md shadow-md"
                width="150"
                height="150"
                src={"/images/broquante_2.jpg"}
              />
              <Link
                className="text-secondary cursor-pointer hover:underline"
                href="https://fr.freepik.com/photos-gratuite/scene-articles-divers-vendus-vente-cour-pour-bonnes-affaires_138697340.htm#fromView=search&page=1&position=12&uuid=29847d9c-11d5-48df-b38b-97beb2549d9c"
                target="_blank"
                rel="noopener noreferrer">
                Image de freepik Scène avec des articles divers vendus à une
                vente de cour pour des bonnes affaires.
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default CreditsRefContent;
