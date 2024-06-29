import CarouselCategories from "@/components/category/client/carousel-category";
import BannerH from "@/components/banner/server/banner-h";
import LoaderOkaze from "@/components/utils/server/loader";
import ContentCategory from "@/components/category/client/content-category";

import { getCategoryById } from "@/data/category";
import { getPostsByCategoryId } from "@/data/post";

import { Category } from "@/prisma/category/types";
import { Post } from "@/prisma/post/types";
import { Attribut } from "@/prisma/attribut/types";

interface Props {
  idCategory: string;
}

interface OneAttribut {
  id: string;
  name: string;
}

const TemplateCategory = async (props: Props) => {
  const category: Category = await getCategoryById(props.idCategory);
  if (!category) return <LoaderOkaze />;

  const posts: Post[] | null = await getPostsByCategoryId(category.id);
  if (!posts) return <LoaderOkaze />;

  const Listattributs: string[] = [];

  posts.map(async (post: Post) => {
    if (post) {
      if (post.attributs) {
        if (post.attributs.length > 0) {
          post.attributs.map((attribut: OneAttribut) => {
            if (!Listattributs.includes(attribut.name)) {
              Listattributs.push(attribut.name);
            }
          });
        }
      }
    }
  });

  return (
    <>
      <BannerH variant="1" />
      <div className="space-y-6 text-start shadow-md bg-white py-4 px-12 mx-[250px] rounded-sm">
        <CarouselCategories
          categoryName={category.name}
          posts={posts}
        />
      </div>
      <ContentCategory
        category={category}
        posts={posts}
        listAttributs={Listattributs}
      />
      <BannerH variant="2" />
    </>
  );
};

export default TemplateCategory;
