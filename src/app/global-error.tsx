"use client";

// Dernier filet de sécurité : erreur dans le layout racine lui-même. Doit
// fournir ses propres <html>/<body> et ne dépendre d'aucun style global.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e6d6bd",
          fontFamily: "system-ui, sans-serif",
          color: "#2d2616",
          padding: 16,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            background: "#fff9ef",
            border: "1px solid #e0cba8",
            borderRadius: 16,
            padding: 32,
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: 700, color: "#b8621a" }}>Sama Cahier</p>
          <h1 style={{ fontSize: 20 }}>Une erreur est survenue</h1>
          <p style={{ fontSize: 14, color: "#524940" }}>
            Merci de réessayer dans quelques instants
            {error.digest ? ` (code ${error.digest})` : ""}.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#d97b1e",
              color: "#fff",
              border: 0,
              borderRadius: 12,
              padding: "8px 16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
