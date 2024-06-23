"use client";
import { Separator } from "@/components/ui/separator";
import { Post } from "@prisma/client";

const RightColumn = ({ post }: { post?: Post }) => {
  console.log(post);
  return (
    <>
      <div className="space-y-4 my-2">Poste de la category</div>
      <Separator />
    </>
  );
};

export default RightColumn;
