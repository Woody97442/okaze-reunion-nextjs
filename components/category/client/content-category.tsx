"use client";

import { Category, Post } from "@prisma/client";
import RightColumn from "@/components/category/client/right-column";
import LeftColumn from "@/components/category/client/left-column";
import { FetchData } from "@/lib/fetch-data";
import { useEffect, useState } from "react";

interface Props {
  category: Category;
}

export default function ContentCategory({ category }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [orderBy, setOrderBy] = useState("recent");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const pageSize = 5;

  const fetchPosts = async () => {
    const url = new URL(
      `/api/posts/byCategory/paginated`,
      window.location.origin
    );
    url.searchParams.append("categoryId", category.id);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("pageSize", pageSize.toString());
    url.searchParams.append("orderBy", orderBy);
    const data = await FetchData(url.toString());

    setPosts(data.posts);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchPosts();
  }, [category.id, currentPage, orderBy, minPrice, maxPrice]);

  return (
    <div className="flex flex-row space-x-6 mx-[250px] h-full ">
      <aside className="flex flex-col gap-y-4 bg-white w-1/3 py-4 px-12 shadow-md rounded-sm">
        <LeftColumn
          setOrderBy={setOrderBy}
          setMaxPrice={setMaxPrice}
          setMinPrice={setMinPrice}
          min={minPrice}
          max={maxPrice}
        />
      </aside>
      <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-12 shadow-md rounded-sm">
        <RightColumn
          categoryName={category.name}
          currentPage={currentPage}
          posts={posts}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </section>
    </div>
  );
}
