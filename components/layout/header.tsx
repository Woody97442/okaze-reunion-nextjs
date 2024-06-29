import { auth } from "@/auth";
import NavCategories from "@/components/nav/client/nav-categories";
import Navbar from "@/components/nav/client/navbar";
import NavbarAuthenticated from "@/components/nav/client/navbar-authenticated";

export default async function Header() {
  const session = await auth();
  return (
    <header>
      {!session?.user ? <Navbar /> : <NavbarAuthenticated />}
      <NavCategories />
    </header>
  );
}
