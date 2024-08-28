import Heros from "@/components/banner/heros";
import HomeContent from "./home-content";
import { getPosts } from "@/data/post";
import BannerH from "@/components/banner/banner-h";

const HomePage = async () => {
  const allPosts = await getPosts();

  return (
    <>
      <main className="flex flex-col py-8 space-y-6 container">
        <Heros />
        <HomeContent posts={allPosts || []} />
        <BannerH variant="2" />
      </main>
    </>
  );
};

export default HomePage;
