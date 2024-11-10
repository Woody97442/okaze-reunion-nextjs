import BannerH from "@/components/banner/banner-h";
import CarouselCategories from "@/components/category/carousel-category";
import ContentCategory from "@/components/category/content-category";
import LoaderOkaze from "@/components/utils/loader";
import { getCategoryBySlug } from "@/data/category";
import { getPostsByCategoryId } from "@/data/post";
import { Category } from "@/prisma/category/types";
import { Post } from "@/prisma/post/types";
import { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

interface OneAttribut {
  id: string;
  name: string;
}

// Fonction pour récupérer la catégorie et les posts
export async function generateMetadata({
  params: { slug },
}: Props): Promise<Metadata> {
  const category: Category | null = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: `Catégorie non trouvée | Okaze Réunion | Brocante en Ligne à La Réunion`,
      description: "Cette catégorie n'existe pas sur Okaze Réunion.",
      openGraph: {
        title: `Catégorie non trouvée | Okaze Réunion`,
        description: "Cette catégorie n'existe pas sur Okaze Réunion.",
        url: `https://www.okaze-reunion.com/category/${slug}`,
        images: [
          {
            url: "https://www.okaze-reunion.com/images/banner/banner_h_1.jpg",
            width: 1200,
            height: 630,
            alt: "Catégorie non trouvée",
          },
        ],
        type: "website",
        siteName: "Okaze Réunion",
      },
      twitter: {
        card: "summary_large_image",
        title: "Catégorie non trouvée | Okaze Réunion",
        description: "Cette catégorie n'existe pas sur Okaze Réunion.",
        images: ["https://www.okaze-reunion.com/images/banner/banner_h_1.jpg"],
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `https://www.okaze-reunion.com/category/${slug}`,
        languages: {
          "fr-FR": `https://www.okaze-reunion.com/category/${slug}`,
        },
      },
    };
  }

  return {
    title: `Catégorie ${category.name} | Okaze Réunion | Brocante en Ligne à La Réunion`,
    description: `Explorez les articles d'occasion et d'antiquités disponibles dans la catégorie ${category.name} sur Okaze Réunion.`,
    keywords: [
      "catégories",
      "brocante",
      "Réunion",
      "occasion",
      "antiquités",
      "meubles",
      "accessoires",
      "objets rares",
      "achats d'occasion",
    ],
    openGraph: {
      title: `Catégorie ${category.name} | Okaze Réunion | Brocante en Ligne à La Réunion`,
      description: `Découvrez une sélection d'articles uniques dans la catégorie ${category.name} sur Okaze Réunion.`,
      url: `https://www.okaze-reunion.com/category/${slug}`,
      images: [
        {
          url: "https://www.okaze-reunion.com/images/banner/banner_h_1.jpg",
          width: 1200,
          height: 630,
          alt: `Explorez les catégories de brocante Okaze Réunion`,
        },
      ],
      type: "website",
      siteName: "Okaze Réunion",
    },
    twitter: {
      card: "summary_large_image",
      title: `Catégorie ${category.name} | Okaze Réunion | Brocante en Ligne`,
      description: `Explorez des objets uniques dans la catégorie ${category.name} sur Okaze Réunion.`,
      images: ["https://www.okaze-reunion.com/images/banner/banner_h_1.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.okaze-reunion.com/category/${slug}`,
      languages: {
        "fr-FR": `https://www.okaze-reunion.com/category/${slug}`,
      },
    },
  };
}

export default async function CategoryId({ params: { slug } }: Props) {
  const category: Category | null = await getCategoryBySlug(slug);

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
      <div className="space-y-6 text-start shadow-md bg-secondary py-4 px-12 rounded-sm">
        <h1 className="text-2xl text-white font-bold font-Lato text-center">
          Annonces {category?.name} occasion
        </h1>
      </div>
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
