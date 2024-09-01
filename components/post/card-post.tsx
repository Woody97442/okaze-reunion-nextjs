"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";

import { FormatDate } from "@/lib/format-date";
import { FormatPrice } from "@/lib/format-price";
import { AddLotButton } from "@/components/post/add-lot-button";
import { Post } from "@/prisma/post/types";
import { Badge } from "@/components/ui/badge";
import { TraductionState } from "@/lib/traduction-state";
import { AddFavoriteButton } from "./add-favorite-button";

export default function CardPost({ post }: { post: Post }) {
  //TODO: Ajouter le choix de l'image de cover
  const coverImage = 0;

  return (
    <Card className="h-[350px] justify-between flex flex-col">
      <Link
        href={"/post/" + post.id}
        className="h-auto flex rounded-md w-auto hover:brightness-80 overflow-hidden rounded-b-none">
        {post.images[coverImage] ? (
          <Image
            alt={post.images[coverImage].alt}
            className="aspect-video w-full rounded-md rounded-b-none object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 "
            width="250"
            height="140"
            src={post.images[coverImage].src}
          />
        ) : (
          <Image
            alt="image not found"
            className="aspect-video w-full rounded-md rounded-b-none object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 "
            width="250"
            height="140"
            src="/images/image_not_found.png"
          />
        )}
      </Link>
      <CardHeader>
        <CardTitle className="inline-block w-[180px] ">
          <span className="line-clamp-1">{post.title}</span>
        </CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-sm ">
            Prix :{" "}
            <span className="font-bold text-md">
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
