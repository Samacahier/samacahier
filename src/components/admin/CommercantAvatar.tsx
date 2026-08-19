type CommercantAvatarProps = {
  logoUrl: string | null;
  nom: string;
  taille?: "sm" | "lg";
};

const TAILLES: Record<NonNullable<CommercantAvatarProps["taille"]>, string> = {
  sm: "h-8 w-8 text-sm",
  lg: "h-16 w-16 text-2xl",
};

// Vignette du logo du commerce, avec repli sur un avatar-cercle (première
// lettre du nom) quand logo_url est absent — jamais d'image cassée.
export default function CommercantAvatar({ logoUrl, nom, taille = "sm" }: CommercantAvatarProps) {
  const classesTaille = TAILLES[taille];

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`Logo ${nom}`}
        className={`${classesTaille} shrink-0 rounded-full border border-line object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex ${classesTaille} shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-ink-muted`}
    >
      {nom.charAt(0).toUpperCase()}
    </span>
  );
}
