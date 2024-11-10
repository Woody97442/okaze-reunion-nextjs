"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";

import { FormatPrice } from "@/lib/format-price";
import { AddLotButton } from "@/components/post/add-lot-button";
import { Post } from "@/prisma/post/types";
import { Badge } from "@/components/ui/badge";
import { TraductionState } from "@/lib/traduction-state";
import { AddFavoriteButton } from "./add-favorite-button";

export default function CardPost({ post }: { post: Post }) {
  const coverImage = post.coverImageIndex;
  return (
    <Card className="h-[350px] justify-between flex flex-col">
      <Link
        href={"/post/" + post.title.replace(/ /g, "-")}
        className="h-auto flex rounded-md w-auto hover:brightness-80 overflow-hidden rounded-b-none relative">
        {post.images[coverImage] ? (
          <Image
            alt={post.images[coverImage].alt}
            className=" w-full rounded-md rounded-b-none object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 "
            width="250"
            height="140"
            src={post.images[coverImage].src}
          />
        ) : (
          <Image
            alt="image not found"
            className=" w-full rounded-md rounded-b-none object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 "
            width="250"
            height="140"
            src="/images/image_not_found.png"
          />
        )}
        <div className="flex justify-between p-2 absolute top-0 right-0">
          <Badge
            variant="secondary"
            className="text-xs text-white w-fit">
            {TraductionState(post.state)}
          </Badge>
        </div>
      </Link>
      <CardHeader className="p-4">
        <CardTitle className="inline-block w-[180px] ">
          <span className="line-clamp-1">{post.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <p className="text-sm space-x-2">
            <span>Prix :</span>
            <span className="font-bold text-xl">
              {FormatPrice(post.price)} €
            </span>
          </p>
          <div className="flex gap-x-4">
            <AddFavoriteButton post={post} />
            <AddLotButton postId={post.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
