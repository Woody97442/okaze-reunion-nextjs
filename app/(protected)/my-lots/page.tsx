import { auth } from "@/auth";
import LoaderOkaze from "@/components/utils/loader";
import MyLotsContent from "@/app/(protected)/my-lots/my-lots-content";

const MyLotsPage = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  return (
    <main className="flex flex-col py-8 space-y-6 container mt-[17rem] md:mt-10">
      <MyLotsContent />
    </main>
  );
};

export default MyLotsPage;
