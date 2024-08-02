import { AdminContext } from "@/components/context/admin-context";
import { useContext } from "react";

export default function FindAdminContext() {
    const adminContext = useContext(AdminContext);

    if (!adminContext) {
        throw new Error("AdminContext not found");
    }
    const { allUsers, setAllUsers, allPosts, setAllPosts, allCategories, setAllCategories, currentContent, setCurrentContent, allAttributes, setAllAttributes, currentPost, setCurrentPost, loading, setLoading, tempUploadFiles, setTempUploadFiles } = adminContext;



    return { allUsers, setAllUsers, allPosts, setAllPosts, allCategories, setAllCategories, currentContent, setCurrentContent, allAttributes, setAllAttributes, currentPost, setCurrentPost, loading, setLoading, tempUploadFiles, setTempUploadFiles };
}


// utilisation dans les components client :
//  const { allUsers, setAllUsers } = FindAdminContext();