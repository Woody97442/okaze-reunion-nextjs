import Heros from "@/components/banner/heros";
import HomeContent from "./home-content";
import { getPosts } from "@/data/post";
import BannerH from "@/components/banner/banner-h";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Okaze Réunion | Brocante en Ligne à La Réunion",
  description:
    "Découvrez Okaze Réunion, votre site de brocante en ligne à La Réunion. Trouvez des articles d'occasion, objets rares et antiquités à des prix compétitifs.",
  keywords: [
    "brocante",
    "Réunion",
    "occasion",
    "achat",
    "antiquités",
    "articles rares",
    "meubles",
    "accessoires",
  ],
  openGraph: {
    title: "Okaze Réunion | Brocante en Ligne à La Réunion",
    description:
      "Achetez facilement des articles d'occasion et des antiquités sur Okaze Réunion, votre plateforme en ligne à La Réunion.",
    url: "https://www.okaze-reunion.com",
    images: [
      {
        url: "https://www.okaze-reunion.com/images/banner/banner_h_1.jpg",
        width: 1200,
        height: 630,
        alt: "Image de présentation de la brocante Okaze Réunion",
      },
    ],
    type: "website",
    siteName: "Okaze Réunion",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okaze Réunion | Brocante en Ligne",
    description:
      "Explorez et trouvez des objets d'occasion uniques sur Okaze Réunion, votre plateforme locale à La Réunion.",
    images: ["https://www.okaze-reunion.com/images/banner/banner_h_1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.okaze-reunion.com",
    languages: {
      "fr-FR": "https://www.okaze-reunion.com",
    },
  },
};

const HomePage = async () => {
  const allPosts = await getPosts();

  return (
    <>
      <main className="flex flex-col py-8 space-y-12 container ">
        <div>
          <Heros />
        </div>
        <HomeContent posts={allPosts || []} />
        <BannerH variant="2" />
      </main>
    </>
  );
};

export default HomePage;
