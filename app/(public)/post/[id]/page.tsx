import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LoaderOkaze from "@/components/utils/loader";

import { getPostById } from "@/data/post";
import { FormatDate } from "@/lib/format-date";
import { FormatPrice } from "@/lib/format-price";
import { TraductionState } from "@/lib/traduction-state";
import { Post } from "@/prisma/post/types";

import Image from "next/image";
import { AddLotButton } from "@/components/post/add-lot-button";
import { SendMessageButton } from "@/components/post/send-message-button";
import { BookButton } from "@/components/post/book-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddFavoriteButton } from "@/components/post/add-favorite-button";

interface Props {
  params: {
    id: string;
  };
}

export default async function PostId({ params: { id } }: Props) {
  const post: Post | null = await getPostById(id);

  if (!post) return <LoaderOkaze />;

  return (
    <main className="flex flex-col py-8 space-y-6 container">
      <div className="flex flex-row space-x-6  h-full w-full">
        <aside className="flex flex-row gap-x-4 bg-white w-full py-4 px-10 shadow-md rounded-sm justify-center">
          {post.images.length > 0 ? (
            post.images.map((picture, index) => (
              <Dialog>
                <DialogTrigger>
                  <Image
                    key={picture.id}
                    alt={picture.alt}
                    width="300"
                    height="300"
                    className="object-cover rounded-md aspect-square"
                    src={picture.src}
                  />
                </DialogTrigger>
                <DialogContent className="bg-transparent border-none p-0">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-white">
                      {post.title}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
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
              className="object-cover rounded-md aspect-square "
              src="/images/image_not_found_2.jpg"
            />
          )}
        </aside>
        <section className="flex flex-col gap-y-4 w-1/2 bg-white py-4 px-10 shadow-md rounded-sm">
          <h1>{post.title}</h1>
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
          <BookButton id={post.id} />
        </section>
      </div>
      <section className="flex flex-col gap-y-4 w-full bg-white py-4 px-10 shadow-md rounded-sm">
        <h1>Description</h1>
        <p>{post.description}</p>
      </section>
    </main>
  );
}
