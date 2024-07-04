import { auth } from "@/auth";
import LoaderOkaze from "@/components/utils/server/loader";
import { getLotsByUserId } from "@/data/lot";
import Content from "@/components/lots/client/content";
import { Lot } from "@/prisma/lot/types";

const TemplateLots = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  let lots: Lot[] = [];

  if (session?.user) {
    lots = (await getLotsByUserId(session.user.id as string)) || [];
  }

  return <Content lots={lots} />;
};

export default TemplateLots;
