"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import React from "react";
import Image from "next/image";

import { FormatDate } from "@/lib/format-date";
import { FormatPrice } from "@/lib/format-price";
import { AddLotButton } from "@/components/category/client/add-lot-button";
import { AddFavoritesButton } from "@/components/category/client/add-favorites-button";
import { Post } from "@/prisma/post/types";
import { Badge } from "@/components/ui/badge";
import { TraductionState } from "@/lib/traduction-state";

export default function CardPost({ post }: { post: Post }) {
  return (
    <>
      <div className="h-auto flex rounded-md w-auto">
        <div className="p-1">
          <Card>
            <Link
              href={"/post/" + post.id}
              className="h-auto flex rounded-md w-auto hover:brightness-80 overflow-hidden rounded-b-none">
              {post.image ? (
                <Image
                  alt={post.title}
                  className="aspect-video w-full rounded-md rounded-b-none object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 "
                  width="250"
                  height="140"
                  src={post.image}
                />
              ) : (
                <Image
                  alt={post.title}
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
              <div className="flex justify-between">
                <p className="text-sm">Prix : {FormatPrice(post.price)} €</p>
                <div className="flex gap-x-4">
                  <AddFavoritesButton id={post.id} />
                  <AddLotButton id={post.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
