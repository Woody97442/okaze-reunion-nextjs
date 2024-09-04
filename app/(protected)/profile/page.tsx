import { auth } from "@/auth";
import LoaderOkaze from "@/components/utils/loader";
import ProfileContent from "@/app/(protected)/profile/profile-content";

const ProfilePage = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  return (
    <main className="flex flex-col py-8 space-y-6 container mt-[17rem] md:mt-10">
      <ProfileContent />
    </main>
  );
};

export default ProfilePage;
