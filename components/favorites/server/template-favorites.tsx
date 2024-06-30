import { auth } from "@/auth";
import { getFavoriteByUserId } from "@/data/favorite";
import LoaderOkaze from "@/components/utils/server/loader";
import { Lot } from "@prisma/client";
import { getLotsByUserId } from "@/data/lot";
import { Post } from "@/prisma/post/types";
import Content from "@/components/favorites/client/content";

const TemplateFavorites = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  let lots: Lot[] = [];

  if (session?.user) {
    lots = (await getLotsByUserId(session.user.id as string)) || [];
  }

  const favovrites = await getFavoriteByUserId(session.user.id as string);

  const postInFavorites = (favovrites?.posts as Post[]) || [];

  return (
    <Content
      postInFavorites={postInFavorites}
      lots={lots}
    />
  );
};

export default TemplateFavorites;
