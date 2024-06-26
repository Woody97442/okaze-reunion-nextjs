"use client";

import { Separator } from "@/components/ui/separator";
import LoaderOkaze from "@/components/utils/server/loader";
import CardCategory from "@/components/category/client/card-category";
import { Post } from "@prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

interface Props {
  categoryName: string;
  currentPage: number;
  posts: Post[];
  totalPages: number;
  setCurrentPage: (page: number) => void;
  minPrice: number;
  maxPrice: number;
}

const RightColumn: React.FC<Props> = ({
  categoryName,
  currentPage,
  posts,
  totalPages,
  setCurrentPage,
  minPrice,
  maxPrice,
}) => {
  const previousPage = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (
    page: number,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  if (!posts) {
    return <LoaderOkaze />;
  }

  return (
    <>
      <div className="space-y-4 my-2">
        <h2 className="text-2xl text-black drop-shadow-md">{categoryName}</h2>
      </div>
      <Separator />
      <div className="h-full justify-between flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts
            .filter((post) => {
              if (minPrice !== 0 && post.price < minPrice) {
                return false;
              }
              if (maxPrice !== 0 && post.price > maxPrice) {
                return false;
              }
              return true;
            })
            .map((post) => (
              <div
                key={post.id}
                className="space-y-4 my-2">
                <CardCategory post={post} />
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
            {currentPage - 1 > 0 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => goToPage(currentPage - 1, e)}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => goToPage(currentPage, e)}>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {currentPage + 1 <= totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => goToPage(currentPage + 1, e)}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={nextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default RightColumn;
