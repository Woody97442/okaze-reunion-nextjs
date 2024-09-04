import { auth } from "@/auth";
import FavoritesContent from "@/app/(protected)/favorites/favorites-content";
import LoaderOkaze from "@/components/utils/loader";

const FavoritesPage = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  return (
    <main className="flex flex-col py-8 space-y-6 container mt-[17rem] md:mt-[13rem]">
      <FavoritesContent />
    </main>
  );
};

export default FavoritesPage;
