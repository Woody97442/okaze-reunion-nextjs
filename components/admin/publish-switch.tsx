"use client";
import React, { useTransition } from "react";
import { Switch } from "../ui/switch";
import { ActivePost } from "@/actions/admin/post";
import FindAdminContext from "@/lib/admin-context-provider";
import { toast } from "../ui/use-toast";
import { Post } from "@/prisma/post/types";

export default function PublishSwitch({
  isActive,
  idPost,
}: {
  isActive: boolean;
  idPost: string;
}) {
  const { allPosts, setAllPosts, setLoading, currentPost, setCurrentPost } =
    FindAdminContext();
  const [isPending, startTransition] = useTransition();
  const handlePublish = async () => {
    setLoading(true);
    startTransition(() => {
      ActivePost(idPost).then((data) => {
        if (data?.success) {
          toast({
            title: "Succès",
            description: data?.success,
          });
          setLoading(false);
          setAllPosts(
            allPosts?.map((post) => {
              if (post.id === data?.post?.id) {
                return data?.post as Post;
              }
              return post;
            }) || []
          );
          if (currentPost) setCurrentPost(data?.post as Post);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
          setLoading(false);
        }
      });
    });
  };

  return (
    <div className="flex w-full justify-center">
      <Switch
        checked={isActive}
        onCheckedChange={handlePublish}
      />
    </div>
  );
}
