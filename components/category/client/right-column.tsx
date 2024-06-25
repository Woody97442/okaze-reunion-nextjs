"use client";
import React, { useEffect, useState } from "react";
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
} from "../../ui/pagination";

interface Props {
  categoryName: string;
  categoryId: string;
}

const RightColumn: React.FC<Props> = ({ categoryName, categoryId }) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const fetchPosts = async () => {
    const url = new URL(
      `/api/posts/byCategory/paginated`,
      window.location.origin
    );
    url.searchParams.append("categoryId", categoryId);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("pageSize", pageSize.toString());
    const data = await fetchData(url.toString());
    setPosts(data);
  };

  const fetchTotalPages = async () => {
    const url = new URL(
      `/api/posts/byCategory/totalPages`,
      window.location.origin
    );
    url.searchParams.append("categoryId", categoryId);
    url.searchParams.append("pageSize", pageSize.toString());
    const data = await fetchData(url.toString());
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchPosts();
    fetchTotalPages();
  }, [categoryId, currentPage]);

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPage = (page: number) => {
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
          {posts.map((post) => (
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
                  onClick={() => goToPage(currentPage - 1)}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => goToPage(currentPage)}>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {currentPage + 1 <= totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => goToPage(currentPage + 1)}>
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
