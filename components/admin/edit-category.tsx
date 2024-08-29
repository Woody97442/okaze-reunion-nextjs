"use client";

import FindAdminContext from "@/lib/admin-context-provider";
import LoaderOkaze from "../utils/loader";
import CategoryForm from "./category-form";

export default function EditCategory() {
  const { loading, currentCategory, setCurrentContent } = FindAdminContext();

  if (!currentCategory) {
    setCurrentContent("categories");
    return null;
  }

  return (
    <div className="space-y-4 my-2">
      {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black bg-opacity-70 fixed z-50 top-0 left-0">
          <LoaderOkaze variant="light" />
        </div>
      )}
      <CategoryForm />
    </div>
  );
}
