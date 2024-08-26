import { auth } from "@/auth";
import LoaderOkaze from "@/components/utils/loader";
import MessageContent from "@/app/(protected)/messages/message-content";

const MessagesPage = async () => {
  const session = await auth();
  if (!session) return <LoaderOkaze />;

  return (
    <main className="flex flex-col py-8 space-y-6 container">
      <MessageContent />
    </main>
  );
};

export default MessagesPage;
