"use client";

import { DataTableCategory } from "@/components/table/data-table-categories";
import { DataTablePost } from "@/components/table/data-table-post";
import { DataTableUser } from "@/components/table/data-table-user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FindAdminContext from "@/lib/admin-context-provider";
import NewPost from "@/components/admin/new-post";
import {
  columnsCategory,
  columnsPost,
  columnsUser,
} from "@/components/table/columns";
import EditPost from "@/components/admin/edit-post";
import DeletePostButton from "@/components/admin/delete-post-button";

const DashboardContent = () => {
  const {
    currentContent,
    setCurrentContent,
    allPosts,
    allUsers,
    allCategories,
    setCurrentPost,
    currentPost,
  } = FindAdminContext();

  const renderButton = (
    content: string,
    label: string,
    variant: "default" | "secondary"
  ) => (
    <div className="flex w-full items-center space-x-2">
      <Button
        className="w-full text-white"
        variant={variant}
        onClick={() => {
          if (content === "new-post") {
            setCurrentPost(null);
            setCurrentContent(content);
          } else {
            setCurrentContent(content);
          }
        }}>
        {label}
      </Button>
    </div>
  );

  const renderTitle = () => {
    switch (currentContent) {
      case "posts":
        return (
          <h2 className="text-2xl text-black drop-shadow-md">
            List de tout les Annonces
          </h2>
        );
      case "users":
        return (
          <h2 className="text-2xl text-black drop-shadow-md">
            List de tout les Utilisateurs
          </h2>
        );
      case "categories":
        return (
          <h2 className="text-2xl text-black drop-shadow-md">
            List de tout les Catégories
          </h2>
        );
      case "new-post":
        return (
          <h2 className="text-2xl text-black drop-shadow-md">
            Créer une Nouvelle Annonce
          </h2>
        );
      case "edit-post":
        return (
          <div className="flex w-full justify-between items-center space-x-2">
            <h2 className="text-2xl text-black drop-shadow-md">
              Modifier L'annonce {currentPost?.title}
            </h2>
            {currentPost && currentPost.id && (
              <DeletePostButton postId={currentPost.id} />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (currentContent) {
      case "posts":
        return (
          <DataTablePost
            columns={columnsPost}
            data={allPosts as any}
          />
        );
      case "users":
        return (
          <DataTableUser
            columns={columnsUser}
            data={allUsers as any}
          />
        );
      case "categories":
        return (
          <DataTableCategory
            columns={columnsCategory}
            data={allCategories as any}
          />
        );
      case "new-post":
        return <NewPost />;

      case "edit-post":
        return <EditPost />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row space-x-6 h-full w-full">
      <aside className="flex flex-col gap-y-4 bg-white w-1/1 py-4 px-8 shadow-md rounded-sm">
        <div className="space-y-4 my-2">
          <h2 className="text-2xl text-black drop-shadow-md">Sélection</h2>
          <Separator />
          {renderButton("posts", "Annonces", "secondary")}
          {renderButton("categories", "Catégories", "secondary")}
          {renderButton("users", "Utilisateurs", "secondary")}
          <Separator />
          {renderButton("new-post", "Créer une Nouvelle Annonce", "default")}
        </div>
      </aside>
      <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
        <div className="space-y-4 my-2">{renderTitle()}</div>
        <Separator />
        <div>{renderContent()}</div>
      </section>
    </div>
  );
};

export default DashboardContent;