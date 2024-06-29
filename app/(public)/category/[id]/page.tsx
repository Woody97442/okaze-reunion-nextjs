import TemplateCategory from "@/components/category/server/template-category";

interface Props {
  params: {
    id: string;
  };
}

export default async function CategoryId({ params: { id } }: Props) {
  return (
    <main className="flex flex-col py-8 space-y-6">
      <TemplateCategory idCategory={id} />
    </main>
  );
}
