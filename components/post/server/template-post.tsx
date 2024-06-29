import LoaderOkaze from "@/components/utils/server/loader";

import { getPostById } from "@/data/post";

const TemplatePost = async ({ idPost }: { idPost: string }) => {
  const post = await getPostById(idPost);

  console.log(post);

  if (!post) return <LoaderOkaze />;

  return (
    <>
      <div className="space-y-6 text-start shadow-md bg-white py-4 px-12 mx-[250px] rounded-sm">
        s
      </div>
      <div className="flex flex-row space-x-6 mx-[250px] h-full ">
        <aside className="flex flex-col gap-y-4 bg-white w-1/3 py-4 px-12 shadow-md rounded-sm">
          s
        </aside>
        <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-12 shadow-md rounded-sm">
          s
        </section>
      </div>
    </>
  );
};

export default TemplatePost;
