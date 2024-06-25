"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import React from "react";
import Image from "next/image";

import { Post } from "@prisma/client";
import { FormatDate } from "@/lib/format-date";
import { FormatPrice } from "@/lib/format-price";
import { AddLotButton } from "@/components/category/client/add-lot-button";
import { AddFavoritesButton } from "@/components/category/client/add-favorites-button";

export default function CardCategory({ post }: { post: Post }) {
  return (
    <>
      <div className="h-auto flex rounded-md w-auto">
        <div className="p-1">
          <Card>
            <Link
              href={"/post/" + post.id}
              className="h-auto flex rounded-md w-auto hover:brightness-80 overflow-hidden rounded-b-none">
              <Image
                alt="Product image"
                className="aspect-video rounded-md rounded-b-none object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 "
                width="250"
                height="140"
                src="/images/posts/four.webp"
              />
            </Link>
            <CardHeader>
              <CardTitle> {post.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {FormatDate(new Date(post.createdAt))}
              </p>
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
