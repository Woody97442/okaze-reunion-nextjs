"use client";
import { useSearchParams } from "next/navigation";

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const idCategory = searchParams.get("id");

  return (
    <>
      {idCategory ? (
        <div>category {idCategory}</div>
      ) : (
        <div>pas de category choisie</div>
      )}
    </>
  );
};

export default CategoriesPage;
