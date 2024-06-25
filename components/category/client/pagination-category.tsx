"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { getTotalPagesByCategory } from "@/data/post";

import { useEffect, useState } from "react";

const PaginationCategory = ({ categoryId }: { categoryId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Nombre de posts par page

  useEffect(() => {
    // Effect pour charger le nombre total de pages initialement
    const fetchTotalPages = async () => {
      const total = await getTotalPagesByCategory(categoryId, pageSize);
      setTotalPages(total);
    };
    fetchTotalPages();
  }, [categoryId]); // Effect dépendant de l'ID de catégorie

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

  return (
    <>
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
    </>
  );
};

export default PaginationCategory;
