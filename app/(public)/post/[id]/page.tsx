import TemplatePost from "@/components/post/server/template-post";

interface Props {
  params: {
    id: string;
  };
}

export default async function PostId({ params: { id } }: Props) {
  return (
    <main className="flex flex-col py-8 space-y-6">
      <TemplatePost idPost={id} />
    </main>
  );
}
