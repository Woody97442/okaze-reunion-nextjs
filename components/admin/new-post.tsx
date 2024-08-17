"use client";

import { Separator } from "../ui/separator";

import FindAdminContext from "@/lib/admin-context-provider";
import LoaderOkaze from "../utils/loader";
import ScrollAreaPost from "./scroll-area-post";
import PostForm from "./post-form";

export default function NewPost() {
  const { loading } = FindAdminContext();

  return (
    <div className="space-y-4 my-2">
      {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black bg-opacity-70 fixed z-50 top-0 left-0">
          <LoaderOkaze variant="light" />
        </div>
      )}
      <ScrollAreaPost />
      <Separator />
      <PostForm />
    </div>
  );
}
