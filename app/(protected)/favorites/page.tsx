import TemplateFavorites from "@/components/favorites/server/template-favorites";

const FavoritesPage = () => {
  return (
    <main className="flex flex-col py-8 space-y-6 container">
      <TemplateFavorites />
    </main>
  );
};

export default FavoritesPage;
