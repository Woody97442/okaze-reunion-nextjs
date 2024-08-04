"use client";
import { Post } from "@/prisma/post/types";
import { User } from "@/prisma/user/types";
import { Category } from "@/prisma/category/types";
import { Image } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import { FaArrowsUpDown } from "react-icons/fa6";
import { FiMoreHorizontal } from "react-icons/fi";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import FindAdminContext from "@/lib/admin-context-provider";
import DeletePostButton from "../admin/delete-post-button";
import PublishSwitch from "../admin/publish-switch";

export const columnsPost: ColumnDef<Post>[] = [
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
    header: () => {
      return <div className="w-auto text-center">Image</div>;
    },
    cell: ({ row }) => {
      const images: Image[] = row.getValue("images");
      if (images && images.length > 0) {
        return (
          <Avatar>
            <AvatarImage
              src={images[0].src}
              alt={images[0].alt}
              className="w-10 h-10 object-cover"
            />
          </Avatar>
        );
      } else {
        return (
          <Avatar>
            <AvatarImage
              src="/images/image_not_found.png"
              alt="image not found"
              className="w-10 h-10 object-cover"
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto text-center">
          ICode
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const post = row.original;
      return <div className="w-auto font-bold text-center">{post.icode}</div>;
    },
  },
  {
    accessorKey: "title",
    id: "titre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto text-center">
          Titre
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const post = row.original;
      return <div className="w-auto text-center">{post.title}</div>;
    },
  },
  {
    accessorKey: "isActive",
    id: "publier",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto text-center">
          Publier
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const post = row.original;
      return (
        <PublishSwitch
          idPost={post.id}
          isActive={post.isActive}
        />
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto text-center">
          Prix
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));

      return <div className="w-auto text-center">{price} €</div>;
    },
  },
  {
    accessorKey: "category",
    id: "Categorie",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto text-center">
          Catégories
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div>
          <div className="w-auto text-center">{post.categories[0].name}</div>
        </div>
      );
    },
  },
  {
    header: () => <div className="w-auto text-center">Actions</div>,
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;
      const { setCurrentContent, setCurrentPost } = FindAdminContext();

      // Edit post
      const handleEditPost = (value: string, post: Post) => {
        setCurrentContent(value);
        setCurrentPost(post);
      };

      return (
        <div className="flex justify-center space-x-2 items-center">
          <Button
            variant="default"
            onClick={() => handleEditPost("edit-post", post)}>
            Modifier
          </Button>
          <DeletePostButton postId={post.id} />
        </div>
      );
    },
  },
];

export const columnsUser: ColumnDef<User>[] = [
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
    header: () => {
      return <div className="w-auto">Images</div>;
    },
    cell: ({ row }) => {
      const image: string = row.getValue("image");

      if (image) {
        return (
          <Avatar>
            <AvatarImage
              src={image}
              alt="image de l'utilisateur"
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
          Numero
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: () => <div className="w-auto">Actions</div>,
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

export const columnsCategory: ColumnDef<Category>[] = [
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-auto">
          Nb Annonces
          <FaArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category: Category = row.original;
      return (
        <div className="text-center font-medium">{category.posts.length}</div>
      );
    },
  },
  {
    header: () => <div className="w-auto">Actions</div>,
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