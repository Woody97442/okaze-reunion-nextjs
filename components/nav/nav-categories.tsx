import { getCategories } from "@/data/category";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavCategories = async () => {
  const categories = await getCategories();

  if (!categories) return null;

  return (
    <div className="bg-white flex justify-between items-center  w-full py-4 px-12">
      {categories.slice(0, 7).map((category) => (
        <div
          className="flex"
          key={category.id}>
          <Button
            variant={"ghost"}
            className="h-full">
            <Link
              href={"/categories?id=" + category.id}
              className={`flex flex-row items-center gap-x-2 font-bold `}>
              <img
                src={category.icon}
                alt={category.altIcon ? category.altIcon : "icon de catégorie"}
                className="w-[42px] h-[42px]"
              />
              <span>
                {category.name.slice(0, 1).toUpperCase() +
                  category.name.slice(1).toLowerCase()}
              </span>
            </Link>
          </Button>
        </div>
      ))}
      <div className="flex">
        <Button
          variant={"ghost"}
          className="h-full">
          <Link
            href={"/categories"}
            className={`flex flex-row items-center gap-x-2 font-bold `}>
            <img
              src={"/images/categories/categories.png"}
              alt={"icon des catégories"}
              className="w-[42px] h-[42px]"
            />
            <span>{"Catégories"}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NavCategories;
