import { auth } from "@/auth";
import LoaderOkaze from "@/components/utils/server/loader";
import { getUserById } from "@/data/user";
import Content from "@/components/profile/client/content";

const TemplateProfile = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  const user = await getUserById(session.user.id as string);
  if (!user) return <LoaderOkaze />;

  return <Content user={user} />;
};

export default TemplateProfile;
