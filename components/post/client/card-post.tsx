"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import React from "react";
import Image from "next/image";

import { FormatDate } from "@/lib/format-date";
import { FormatPrice } from "@/lib/format-price";
import { AddLotButton } from "@/components/post/client/add-lot-button";
import { Post } from "@/prisma/post/types";
import { Badge } from "@/components/ui/badge";
import { TraductionState } from "@/lib/traduction-state";
import { AddFavoritesButton } from "@/components/post/client/add-favorites-button";
import { Lot } from "@prisma/client";

export default function CardPost({ post, lots }: { post: Post; lots: Lot[] }) {
  //TODO: Ajouter le choix de l'image de cover
  const coverImage = 1;

  return (
    <>
      <div className="h-auto flex rounded-md w-auto">
        <div className="p-1">
          <Card>
            <Link
              href={"/post/" + post.id}
              className="h-auto flex rounded-md w-auto hover:brightness-80 overflow-hidden rounded-b-none">
              {post.images[coverImage] ? (
                <Image
                  alt={post.images[coverImage].alt}
                  className="aspect-video w-full rounded-md rounded-b-none object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 "
                  width="250"
                  height="140"
                  src={
                    post.images[coverImage].src +
                    post.images[coverImage].extension
                  }
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
              <CardTitle> {post.title}</CardTitle>
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
                <p className="text-sm">Prix : {FormatPrice(post.price)} €</p>
                <div className="flex gap-x-4">
                  <AddFavoritesButton post={post} />
                  <AddLotButton
                    postId={post.id}
                    lots={lots}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
