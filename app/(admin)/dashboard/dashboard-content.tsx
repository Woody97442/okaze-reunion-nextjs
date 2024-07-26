"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Post } from "@/prisma/post/types";
import { User } from "@/prisma/user/types";
import { Category } from "@/prisma/category/types";
import { Image } from "@prisma/client";

import { useState } from "react";
import { DataTableCategory } from "@/components/table/data-table-categories";
import { DataTablePost } from "@/components/table/data-table-post";
import { DataTableUser } from "@/components/table/data-table-user";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FindAdminContext from "@/lib/admin-context-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaArrowsUpDown } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiMoreHorizontal } from "react-icons/fi";
import EditPost from "@/components/admin/edit-post";
import NewPost from "@/components/admin/new-post";

const DashboardContent = () => {
  const [currentPostEdit, setCurrentPostEdit] = useState<Post>();
  const {
    currentContent,
    setCurrentContent,
    allPosts,
    allUsers,
    allCategories,
  } = FindAdminContext();

  const handleEditPost = (value: string, post: Post) => {
    setCurrentContent(value);
    setCurrentPostEdit(post);
  };

  const columnsPost: ColumnDef<Post>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => {
        const images: Image[] = row.getValue("images");
        if (images.length > 0) {
          return (
            <Avatar>
              <AvatarImage
                src={images[0].src + images[0].extension}
                alt={images[0].alt}
                className="w-10 h-10"
              />
            </Avatar>
          );
        } else {
          return (
            <Avatar>
              <AvatarImage
                src="/images/image_not_found.png"
                alt="image not found"
                className="w-10 h-10"
              />
            </Avatar>
          );
        }
      },
    },
    {
      accessorKey: "icode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            ICode
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "title",
      id: "titre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Titre
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "price",
      id: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Prix
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));

        return <div className="text-right font-medium">{price} €</div>;
      },
    },
    {
      header: () => <div className="text-center">Actions</div>,
      id: "actions",
      cell: ({ row }) => {
        const post = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="h-8 w-full p-0 ">
                <span className="sr-only">Ouvrir le menu</span>
                <FiMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(post.icode)}>
                Copier l'ICode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Button
                  variant="ghost"
                  onClick={() => handleEditPost("edit-post", post)}>
                  Modifier
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Button variant="destructive">Supprimer</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const columnsUser: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image: string = row.getValue("image");
        return (
          <Avatar>
            <AvatarImage
              src={image}
              alt="image de l'utilisateur"
              className="w-10 h-10"
            />
          </Avatar>
        );
      },
    },
    {
      accessorKey: "name",
      id: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Nom
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "username",
      id: "non d'utilisateur",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Nom d'utilisateur
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      id: "e-mail",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            E-mail
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "gender",
      id: "genre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Genre
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "postalCode",
      id: "code-postal",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Code postal
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      id: "numéro",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Numero
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      header: () => <div className="text-center">Actions</div>,
      id: "actions",
      cell: ({ row }) => {
        const post = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="h-8 w-full p-0 ">
                <span className="sr-only">Open menu</span>
                <FiMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {/* <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(post.icode)}>
              Copier l'ICode
            </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Button variant="ghost">Modifier</Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Button variant="destructive">Supprimer </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const columnsCategory: ColumnDef<Category>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const icon: string = row.getValue("icon");
        const altIcon: string = row.getValue("altIcon");

        if (icon) {
          return (
            <Avatar>
              <AvatarImage
                src={icon}
                alt={altIcon}
                className="w-10 h-10"
              />
            </Avatar>
          );
        } else {
          return (
            <Avatar>
              <AvatarImage
                src="/images/image_not_found.png"
                alt="image not found"
                className="w-10 h-10"
              />
            </Avatar>
          );
        }
      },
    },
    {
      accessorKey: "name",
      id: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Nom
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "altIcon",
      id: "altIcon",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Alt Icon
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "posts",
      id: "Annonces",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Annonces dans la catégorie
            <FaArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const category: Category = row.original;
        return (
          <div className="text-right font-medium">{category.posts.length}</div>
        );
      },
    },
    {
      header: () => <div className="text-center">Actions</div>,
      id: "actions",
      cell: ({ row }) => {
        const post = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="h-8 w-full p-0 ">
                <span className="sr-only">Open menu</span>
                <FiMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {/* <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(post.icode)}>
              Copier l'ICode
            </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Button variant="ghost">Modifier</Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Button variant="destructive">Supprimer </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-row space-x-6 h-full w-full">
      <aside className="flex flex-col gap-y-4 bg-white w-1/1 py-4 px-8 shadow-md rounded-sm">
        <div className="space-y-4 my-2">
          <h2 className="text-2xl text-black drop-shadow-md">Sélection</h2>
          <Separator />
          <div className="flex w-full items-center space-x-2">
            <Button
              className="w-full text-white"
              variant="secondary"
              onClick={() => setCurrentContent("posts")}>
              {" "}
              Annonces{" "}
            </Button>
          </div>
          <div className="flex w-full items-center space-x-2">
            <Button
              className="w-full text-white"
              variant="secondary"
              onClick={() => setCurrentContent("categories")}>
              {" "}
              Catégories{" "}
            </Button>
          </div>
          <div className="flex w-full items-center space-x-2">
            <Button
              className="w-full text-white"
              variant="secondary"
              onClick={() => setCurrentContent("users")}>
              {" "}
              Utilisateurs{" "}
            </Button>
          </div>
          <Separator />
          <div className="flex w-full items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentContent("new-post")}
              className="w-full text-white">
              {" "}
              Créer une Nouvelle Annonce{" "}
            </Button>
          </div>
        </div>
      </aside>
      <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
        <div className="space-y-4 my-2">
          {currentContent === "posts" ? (
            <h2 className="text-2xl text-black drop-shadow-md">
              List de tout les Annonces
            </h2>
          ) : currentContent === "users" ? (
            <h2 className="text-2xl text-black drop-shadow-md">
              List de tout les Utilisateurs
            </h2>
          ) : currentContent === "categories" ? (
            <h2 className="text-2xl text-black drop-shadow-md">
              List de tout les Catégories
            </h2>
          ) : currentContent === "new-post" ? (
            <h2 className="text-2xl text-black drop-shadow-md">
              Créer une Nouvelle Annonce
            </h2>
          ) : currentContent === "edit-post" ? (
            <h2 className="text-2xl text-black drop-shadow-md">
              Modifier L'annonce {currentPostEdit?.title}
            </h2>
          ) : null}
        </div>
        <Separator />
        <div>
          {currentContent === "posts" ? (
            <DataTablePost
              columns={columnsPost}
              data={allPosts as any}
            />
          ) : currentContent === "users" ? (
            <DataTableUser
              columns={columnsUser}
              data={allUsers as any}
            />
          ) : currentContent === "categories" ? (
            <DataTableCategory
              columns={columnsCategory}
              data={allCategories as any}
            />
          ) : currentContent === "new-post" ? (
            <NewPost />
          ) : currentContent === "edit-post" ? (
            <EditPost post={currentPostEdit as Post} />
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default DashboardContent;
