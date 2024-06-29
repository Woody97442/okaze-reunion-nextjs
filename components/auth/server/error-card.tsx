import { CardWrapper } from "@/components/auth/client/card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Quelque chose s'est mal passé"
      backButtonHref="auth/login"
      backButtonLabel="Retour à la page de connexion">
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive h-8 w-8" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
