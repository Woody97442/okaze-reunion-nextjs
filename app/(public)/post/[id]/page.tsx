import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LoaderOkaze from "@/components/utils/loader";

import { getPostById, getPosts } from "@/data/post";
import { FormatDate } from "@/lib/format-date";
import { FormatPrice } from "@/lib/format-price";
import { TraductionState } from "@/lib/traduction-state";
import { Post } from "@/prisma/post/types";

import Image from "next/image";
import { AddLotButton } from "@/components/post/add-lot-button";
import { SendMessageButton } from "@/components/post/send-message-button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddFavoriteButton } from "@/components/post/add-favorite-button";
import CustomCarousel from "@/components/home/custom-carousel";
import { auth } from "@/auth";
import { getUserById } from "@/data/user";
import BannerH from "@/components/banner/banner-h";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  params: {
    id: string;
  };
}

export default async function PostId({ params: { id } }: Props) {
  const post: Post | null = await getPostById(id);
  const allPosts = await getPosts();

  const session = await auth();
  const user = await getUserById(session?.user.id as string);

  if (!allPosts) return <LoaderOkaze />;
  if (!post) return <LoaderOkaze />;

  const postInCategory = allPosts
    .filter((p) => p.categories[0].id === post.categories[0].id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  // Filtrer les posts avec des titres similaires
  const similarPosts = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        p.isActive &&
        p.title.toLowerCase().includes(post.title.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  return (
    <main className="flex flex-col py-8 space-y-6 container mt-[17rem] md:mt-10">
      <div className="flex flex-col md:flex-row space-y-6 md:space-x-6 h-full w-full">
        <aside className="flex flex-row gap-x-4 bg-white w-full py-4 md:px-10 shadow-md rounded-sm justify-center">
          <ScrollArea className="w-full md:w-[800px] whitespace-nowrap">
            <div className="flex space-x-4 w-max p-4 pb-6">
              {post.images.length > 0 ? (
                post.images.map((picture, index) => (
                  <Dialog key={index}>
                    <DialogTrigger>
                      <Image
                        key={picture.id}
                        alt={picture.alt}
                        width="250"
                        height="250"
                        className="object-cover rounded-md md:aspect-square"
                        src={picture.src}
                      />
                    </DialogTrigger>
                    <DialogContent className="bg-transparent border-none p-0 text-white">
                      <DialogTitle className="text-xl text-white">
                        {post.title}
                      </DialogTitle>
                      <Image
                        key={index}
                        alt={post.title}
                        width="800"
                        height="800"
                        className=" rounded-md object-cover"
                        src={picture.src || "/images/image_not_found_2.jpg"}
                      />
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <Image
                  alt={post.title}
                  width="300"
                  height="300"
                  className="object-cover rounded-md md:aspect-square "
                  src="/images/image_not_found_2.jpg"
                />
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </aside>
        <section className="flex flex-col gap-y-4 w-full md:w-1/2 bg-white p-4 md:px-10 shadow-md rounded-sm">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="flex justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              {FormatDate(new Date(post.createdAt))}
            </p>
            <Badge
              variant="secondary"
              className="text-xs text-white">
              {TraductionState(post.state)}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between">
            <p className="text-sm">Prix : {FormatPrice(post.price)} €</p>
            <div className="flex gap-x-4">
              <AddFavoriteButton post={post} />
              <AddLotButton postId={post.id} />
            </div>
          </div>
          <Separator />
          <SendMessageButton id={post.id} />
          {user && user.role === "ADMIN" && (
            <div className="flex gap-x-4 items-center flex-row">
              <p className="text-md font-semibold">Code de Référence : </p>
              <span className="font-semibold bg-primary py-1 px-2 rounded-md text-white">
                {post.icode}
              </span>
            </div>
          )}
          {/* <BookButton id={post.id} /> */}
        </section>
      </div>
      <section className="flex flex-col gap-y-4 w-full bg-white py-4 p-4 md:px-10 shadow-md rounded-sm">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <h3 className="text-1xl font-semibold">
          Prix : {FormatPrice(post.price)} €
        </h3>
        <p>{post.description}</p>
        <Separator />
        <h3 className="text-2xl font-semibold">Critères</h3>
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 md:items-baseline">
          <div className="flex flex-col md:flex-row items-baseline gap-y-4 md:gap-x-4">
            <h4 className="text-xl font-semibold">État : </h4>
            <p className="bg-primary py-1 px-4 rounded-md text-white font-semibold">
              {TraductionState(post.state)}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-baseline gap-y-4 md:gap-x-4">
            <h4 className="text-xl font-semibold">Catégories : </h4>
            <p className="bg-primary py-1 px-4 rounded-md text-white font-semibold">
              {post.categories.map((category) => category.name).join(", ")}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-baseline gap-y-4 md:gap-x-4">
            <h4 className="text-xl font-semibold">attributs : </h4>
            <p className="bg-primary py-1 px-4 rounded-md text-white font-semibold">
              {post.attributs.map((attribut) => attribut.name).join(", ")}
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-y-4 w-full bg-white py-4 p-4 md:px-10 shadow-md rounded-sm">
        {similarPosts.length > 0 ? (
          <CustomCarousel
            posts={similarPosts}
            title="Vous aimeriez aussi"
          />
        ) : (
          <CustomCarousel
            posts={postInCategory}
            title="Dans la même catégorie"
          />
        )}
      </section>
      <BannerH variant="2" />
    </main>
  );
}
