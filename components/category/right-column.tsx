"use client";

import { CategoryWithPosts } from "@/prisma/types/category";

import Image from "next/image";
import { BsHeart, BsBoxSeam } from "react-icons/bs";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoaderOkaze from "@/components/utils/loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { useState } from "react";

const RightColumn = ({ props }: { props?: CategoryWithPosts }) => {
  if (!props) return null;
  const { posts, name } = props;

  const [currentPage, setCurrentPage] = useState(1);

  if (!posts || posts.length === 0) return <LoaderOkaze />;

  //TODO: Implementation of get posts by category

  //TODO: Implementation pagination

  const nextPage = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    console.log("next page");
  };
  const previousPage = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    console.log("previous page");
  };

  const goToPage = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    console.log("go to page");
  };

  return (
    <>
      <div className="space-y-4 my-2">
        <h2 className={"text-2xl text-black drop-shadow-md "}>{name}</h2>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="space-y-4 my-2">
            <Card>
              <Image
                alt="Product image"
                className="aspect-video w-full rounded-md rounded-b-none object-cover"
                height={300}
                src="/images/posts/four.webp"
                width={300}
              />
              <CardHeader>
                <CardTitle>Meubles et électroménager</CardTitle>
                <p className="text-sm text-muted-foreground">11/05/2024</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <p className="text-sm">Prix : 1 500 €</p>
                  <div className="flex gap-x-4">
                    <BsHeart className="w-6 h-6" />
                    <BsBoxSeam className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={previousPage}
            />
          </PaginationItem>
          {currentPage - 1 !== 0 && (
            <PaginationItem>{currentPage - 1}</PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={goToPage}>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>{currentPage + 1}</PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={nextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default RightColumn;
