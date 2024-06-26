import CarouselCategories from "@/components/category/client/carousel-category";
import BannerH from "@/components/banner/server/banner-h";
import LoaderOkaze from "@/components/utils/server/loader";
import ContentCategory from "@/components/category/client/content-category";

import { getNewestPostsByCategory } from "@/data/post";
import { getCategoryById } from "@/data/category";

interface Props {
  idCategory: string;
}

const TemplateCategory = async (props: Props) => {
  const category = await getCategoryById(props.idCategory);

  if (!category) return <LoaderOkaze />;

  const newPostsCategory = await getNewestPostsByCategory(category.id, 10);

  return (
    <>
      <BannerH variant="1" />
      <div className="space-y-6 text-start shadow-md bg-white py-4 px-12 mx-[250px] rounded-sm">
        <CarouselCategories
          posts={newPostsCategory}
          categoryName={category.name}
        />
      </div>
      <ContentCategory category={category} />
      <BannerH variant="2" />
    </>
  );
};

export default TemplateCategory;
