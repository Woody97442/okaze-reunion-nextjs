import BannerH from "@/components/banner/banner-h";
import CarouselCategories from "@/components/category/carousel-category";
import ContentCategory from "@/components/category/content-category";
import LoaderOkaze from "@/components/utils/loader";
import { getCategoryById } from "@/data/category";
import { getPostsByCategoryId } from "@/data/post";
import { Category } from "@/prisma/category/types";
import { Post } from "@/prisma/post/types";

interface Props {
  params: {
    id: string;
  };
}

interface OneAttribut {
  id: string;
  name: string;
}

export default async function CategoryId({ params: { id } }: Props) {
  const category: Category | null = await getCategoryById(id);
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
    <main className="flex flex-col py-8 space-y-6 container">
      <BannerH variant="1" />
      <div className="space-y-6 text-start shadow-md bg-white py-4 px-12 rounded-sm">
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
    </main>
  );
}
