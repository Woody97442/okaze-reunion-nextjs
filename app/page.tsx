import Heros from "@/components/banner/heros";
import HomeContent from "./home-content";
import { getPosts } from "@/data/post";
import BannerH from "@/components/banner/banner-h";

const HomePage = async () => {
  const allPosts = await getPosts();

  return (
    <>
      <div className=" md:hidden px-6">
        <Heros />
      </div>
      <main className="flex flex-col py-8 space-y-12 container">
        <div className="hidden md:block">
          <Heros />
        </div>
        <HomeContent posts={allPosts || []} />
        <BannerH variant="2" />
      </main>
    </>
  );
};

export default HomePage;
