import FindAdminContext from "@/lib/admin-context-provider";
import { Post } from "@/prisma/post/types";
import React from "react";

export default function EditPost({ post }: { post: Post }) {
  const { setAllPosts } = FindAdminContext();

  console.log(post);
  return <div>EditPost {post.id}</div>;
}
