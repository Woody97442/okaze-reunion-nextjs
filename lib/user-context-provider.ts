import { UserContext } from "@/components/layout/user-context";
import { useContext } from "react";

export default function FindUserContext() {
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("UserContext not found");
    }
    const { currentUser, setCurrentUser, currentUserFavorite, setCurrentUserFavorite, currentUserLots, setCurrentUserLots } = userContext;



    return { currentUser, setCurrentUser, currentUserFavorite, setCurrentUserFavorite, currentUserLots, setCurrentUserLots };
}


// utilisation dans les components client :
//  const { currentUser, setCurrentUser } = FindUserContext();