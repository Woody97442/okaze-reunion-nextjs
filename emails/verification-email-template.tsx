const VerificationEmailTemplate = ({
  email,
  confirmLink,
}: {
  email: string;
  confirmLink: string;
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#333",
      }}>
      <h2 style={{ color: "#4A90E2" }}>Bienvenue sur Okaze Réunion !</h2>
      <p>Bonjour, {email}</p>
      <p>
        Merci de vous être inscrit sur Okaze Réunion. Pour compléter votre
        inscription, veuillez vérifier votre adresse e-mail en cliquant sur le
        lien ci-dessous :
      </p>
      <p>
        <a
          href={confirmLink}
          style={{
            color: "#4A90E2",
            textDecoration: "none",
            fontWeight: "bold",
          }}>
          Vérifier mon e-mail
        </a>
      </p>
      <p>
        Si vous n&#39;avez pas créé de compte sur notre site, vous pouvez
        ignorer ce message.
      </p>
      <p>Merci et à bientôt sur Okaze Réunion !</p>
      <p>Bien cordialement,</p>
      <p>L&#39;équipe Okaze Réunion</p>
      <p>
        <small>
          Si vous avez des questions, n&#39;hésitez pas à nous contacter à{" "}
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

export default VerificationEmailTemplate;
