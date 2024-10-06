"use client";
import { DeletePost } from "@/actions/admin/post";
import FindAdminContext from "@/lib/admin-context-provider";
import React, { useState, useTransition } from "react";
import { toast } from "../ui/use-toast";
import { Post } from "@/prisma/post/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FaTrashAlt } from "react-icons/fa";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const {
    setCurrentContent,
    setCurrentPost,
    setLoading,
    setTempUploadFiles,
    setAllPosts,
    allPosts,
    currentPost,
  } = FindAdminContext();
  const handleDeletePost = () => {
    setLoading(true);
    setCurrentPost(null);
    startTransition(() => {
      DeletePost(postId).then((data) => {
        if (data?.success) {
          toast({
            title: "Succès",
            description: data?.success,
          });
          if (currentPost && currentPost.id === postId) {
            setCurrentPost(null);
            setCurrentContent("posts");
            setTempUploadFiles([]);
          }
          setLoading(false);
          setOpenModal(false);
          if (allPosts) {
            const newPosts = allPosts.filter((post) => post.id !== postId);
            setAllPosts(newPosts as Post[]);
          } else {
            setAllPosts([]);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: data?.error,
          });
          setLoading(false);
          setOpenModal(false);
        }
      });
    });
  };

  return (
    <Dialog
      open={openModal}
      onOpenChange={setOpenModal}>
      <DialogTrigger className="flex justify-start">
        <div className="flex justify-center w-auto btn items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-4 py-2">
          <FaTrashAlt />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center text-xl font-bold">
            Voulez-vous vraiment supprimer cette annonce ?
          </DialogTitle>
          <Button
            variant={"destructive"}
            className="flex justify-center w-auto"
            disabled={isPending}
            onClick={handleDeletePost}>
            Confirmer la suppression
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
