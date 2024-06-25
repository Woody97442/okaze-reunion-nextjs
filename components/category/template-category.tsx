import CarouselCategories from "@/components/category/client/carousel-category";
import LeftColumn from "@/components/category/left-column";
import BannerH from "@/components/banner/server/banner-h";
import RightColumn from "@/components/category/client/right-column";
import LoaderOkaze from "@/components/utils/server/loader";

import { Category } from "@prisma/client";
import { getNewestPostsByCategory } from "@/data/post";

interface Props {
  category: Category;
}

const TemplateCategory = async (props: Props) => {
  const category = props.category;
  const newPostsCategory = await getNewestPostsByCategory(category.id, 10);

  if (!category) return <LoaderOkaze />;

  return (
    <>
      <BannerH variant="1" />
      <div className="space-y-6 text-start shadow-md bg-white py-4 px-12 mx-[250px] rounded-sm">
        <CarouselCategories
          posts={newPostsCategory}
          categoryName={category.name}
        />
      </div>
      <div className="flex flex-row space-x-6 mx-[250px] h-full ">
        <aside className="flex flex-col gap-y-4 bg-white w-1/3 py-4 px-12 shadow-md rounded-sm">
          <LeftColumn />
        </aside>
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-12 shadow-md rounded-sm">
          <RightColumn
            categoryName={category.name}
            categoryId={category.id}
          />
        </section>
      </div>
      <BannerH variant="2" />
    </>
  );
};

export default TemplateCategory;
