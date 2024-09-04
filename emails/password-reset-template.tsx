const PasswordResetTemplate = ({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
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
        Demande de réinitialisation du mot de passe
      </h2>
      <p>Bonjour, {email},</p>
      <p>
        Nous avons reçu une demande de réinitialisation de votre mot de passe
        sur Okaze Réunion.
      </p>
      <p>
        Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien
        ci-dessous :
      </p>
      <p>
        <a
          href={resetLink}
          style={{
            color: "#4A90E2",
            textDecoration: "none",
            fontWeight: "bold",
          }}>
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p>
        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer
        ce message. Votre mot de passe restera inchangé.
      </p>
      <p>Merci et à bientôt sur Okaze Réunion !</p>
      <p>Bien cordialement,</p>
      <p>L'équipe Okaze Réunion</p>
      <p>
        <small>
          Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous
          contacter à{" "}
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

export default PasswordResetTemplate;
