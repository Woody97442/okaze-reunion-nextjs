const TwoFactorTokenTemplate = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#333",
        lineHeight: "1.6",
      }}>
      <h2 style={{ color: "#4A90E2" }}>
        Validation en Deux Étapes sur Okaze Réunion
      </h2>
      <p>Bonjour, {email},</p>
      <p>
        Nous avons besoin de confirmer votre identité pour compléter
        l'authentification en deux étapes sur Okaze Réunion.
      </p>
      <p>Voici votre code de validation :</p>
      <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4A90E2" }}>
        {token}
      </p>
      <p>
        Entrez ce code dans le champ prévu à cet effet pour finaliser le
        processus de connexion ou d'inscription.
      </p>
      <p>
        Si vous n'avez pas demandé cette vérification, vous pouvez ignorer ce
        message. Votre compte n'a pas été affecté.
      </p>
      <p>Merci et à bientôt sur Okaze Réunion !</p>
      <p>Bien cordialement,</p>
      <p>L'équipe Okaze Réunion</p>
      <p>
        <small>
          Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas
          à nous contacter à{" "}
          <a
            href="mailto:okaze-reunion@gmail.com"
            style={{ color: "#4A90E2" }}>
            okaze-reunion@gmail.com
          </a>
          .
        </small>
      </p>
    </div>
  );
};

export default TwoFactorTokenTemplate;
