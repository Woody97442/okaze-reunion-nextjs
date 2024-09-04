import { auth } from "@/auth";
import LoaderOkaze from "@/components/utils/loader";
import AdminMessageContent from "@/app/(admin)/dashboard/admin-messages/admin-message-content";

const AdminMessagesPage = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  return (
    <main className="flex flex-col py-8 space-y-6 container mt-[17rem] md:mt-10">
      <AdminMessageContent />
    </main>
  );
};

export default AdminMessagesPage;
