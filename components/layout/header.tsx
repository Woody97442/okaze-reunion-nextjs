import { FindCategories } from "@/actions/category";
import { auth } from "@/auth";
import Navbar from "@/components/layout/navbar";
import { getNumberOfUnreadMessages } from "@/data/message";
import { getUserById } from "@/data/user";

export default async function Header() {
  const session = await auth();

  const user = await getUserById(session?.user.id as string);

  const categories = await FindCategories();

  const numberOfUnreadMessagesForAdmin = await getNumberOfUnreadMessages();

  return (
    <header>
      <Navbar
        user={user}
        categories={categories}
        numberOfUnreadMessages={numberOfUnreadMessagesForAdmin || ""}
      />
    </header>
  );
}
