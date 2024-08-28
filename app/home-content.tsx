"use client";

import BannerH from "@/components/banner/banner-h";
import CustomCarousel from "@/components/home/custom-carousel";
import { Separator } from "@/components/ui/separator";
import { Post } from "@/prisma/post/types";
import Image from "next/image";

const HomeContent = ({ posts }: { posts: Post[] }) => {
  const newPosts = posts
    .filter((post) => post.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 20);

  const cheapPosts = posts
    .filter((post) => post.isActive)
    .sort((a, b) => a.price - b.price)
    .slice(0, 20);

  return (
    <>
      {/* Carousel de nouvelles annonces */}
      <div className="flex flex-row space-x-6 h-full w-full">
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
          <CustomCarousel
            title={"Les Nouvelles Annonces"}
            posts={newPosts}
          />
        </section>
      </div>

      {/* Banner */}
      <BannerH variant="1" />

      {/* La Zone */}
      <div className="flex flex-row space-x-6 h-full w-full">
        <section className="flex flex-row gap-y-4 w-full">
          <div className="flex justify-center items-center">
            <Image
              src="/images/broquante_2.jpg "
              width={630}
              height={420}
              className=" shadow-md rounded-sm w-full h-full object-cover"
              priority
              alt={"Logo de l'application Okaze"}
            />
          </div>
        </section>
        <section className="flex flex-row gap-y-4 bg-primary w-full py-4 px-8 shadow-md rounded-sm text-white">
          <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="text-3xl font-bold">Ou Nous Trouvé</h2>
            <p className="text-justify text-base">
              La zone où nous trouvons sont visibles sur la carte ci-contre.
            </p>
            <p className="text-justify text-base">
              Au Marché au puce Saint-Pierre 97410, La Réunion Zone industrielle
              N3
            </p>
            <h3 className="text-md font-bold">
              Lien vers la carte Google clic ci-dessous
            </h3>
            <a
              href="https://maps.app.goo.gl/mdaeNArJ1UwXx9XM8"
              className="text-justify text-base">
              <div className="flex justify-center items-center">
                <Image
                  src="/images/carte.png"
                  width={200}
                  height={200}
                  className=" object-cover"
                  priority
                  alt={"Logo de l'application Okaze"}
                />
              </div>
            </a>
          </div>
        </section>
      </div>

      {/* Carousel de nouvelles annonces */}
      <div className="flex flex-row space-x-6 h-full w-full">
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
          <CustomCarousel
            title={"Les Bonnes Affaires"}
            posts={cheapPosts}
          />
        </section>
      </div>

      {/* Section de presentation */}
      <div className="flex flex-row space-x-6 h-full w-full">
        <section className="flex flex-row gap-y-4 bg-primary w-full py-4 px-8 shadow-md rounded-sm text-white">
          <div className="flex flex-col justify-center items-center gap-4">
            <h2 className="text-3xl font-bold">Bienvenue sur OKAZE Réunion</h2>
            <p className="text-justify text-base">
              Votre destination en ligne pour dénicher des trésors d'occasion et
              redonner vie aux objets du passé.
            </p>
            <p className="text-justify text-base">
              Plongez dans un univers où chaque objet raconte une histoire, où
              chaque trouvaille est une découverte passionnante.
            </p>
            <p className="text-justify text-base">
              Que vous soyez à la recherche d'un meuble pour votre salon, d'un
              objet de décoration pour embellir votre intérieur, d'un vêtement
              vintage pour compléter votre garde-robe ou simplement d'un article
              pratique pour une utilisation quotidienne, OKAZE Réunion est votre
              destination incontournable.
            </p>
            <p className="text-justify text-base">
              Parcourez nos différentes catégories, explorez nos trésors cachés
              et laissez-vous inspirer par l'histoire et le charme de chaque
              objet.
            </p>
          </div>
        </section>
        <section className="flex flex-row gap-y-4 w-full">
          <div className="flex justify-center items-center">
            <Image
              src="/images/broquante_1.jpg "
              width={630}
              height={420}
              className=" shadow-md rounded-sm w-full h-full object-cover"
              priority
              alt={"Logo de l'application Okaze"}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeContent;
