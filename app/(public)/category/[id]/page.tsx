import { CardWrapper } from "@/components/auth/client/card-wrapper";

import TemplateCategory from "@/components/category/template-category";
import { getCategoryById } from "@/data/category";
import { Category } from "@prisma/client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface CategoryIdProps {
  params: {
    id: string;
  };
}

export default async function CategoryId({ params: { id } }: CategoryIdProps) {
  try {
    const data: Category | null = await getCategoryById(id);

    if (!data) {
      return (
        <main className="flex flex-col py-8 space-y-6 justify-center items-center">
          <CardWrapper
            headerLabel="Oops! Quelque chose s'est mal passé"
            backButtonHref="/"
            backButtonLabel="Retour à la page de d'accueil">
            <div className="w-full flex justify-center items-center">
              <ExclamationTriangleIcon className="text-destructive h-8 w-8" />
            </div>
          </CardWrapper>
        </main>
      );
    }

    return (
      <main className="flex flex-col py-8 space-y-6">
        <TemplateCategory category={data} />
      </main>
    );
  } catch (error) {
    console.error("Échec du chargement des données de catégorie:", error);
    return (
      <main className="flex flex-col py-8 space-y-6">
        <p>Échec du chargement des données de catégorie</p>
      </main>
    );
  }
}
