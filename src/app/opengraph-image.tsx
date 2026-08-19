import { ImageResponse } from "next/og";

export const alt = "Sama Cahier — gestion quotidienne pour petits commerces au Sénégal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function chargerPoliceBricolage(texte: string, poids: string) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${poids}&text=${encodeURIComponent(texte)}`,
    )
  ).text();
  const source = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!source) throw new Error("Police Bricolage Grotesque introuvable");
  return (await fetch(source[1])).arrayBuffer();
}

const WORDMARK = "Sama·Cahier";
const ACCROCHE = "Le cahier de votre commerce ne se perd plus";

export default async function OpengraphImage() {
  const [policeWordmark, policeAccroche] = await Promise.all([
    chargerPoliceBricolage(WORDMARK, "800"),
    chargerPoliceBricolage(ACCROCHE, "600"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e6d6bd",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Bricolage Grotesque",
            fontWeight: 800,
            fontSize: 84,
            color: "#2d2616",
          }}
        >
          Sama<span style={{ color: "#d97b1e" }}>·</span>Cahier
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontFamily: "Bricolage Grotesque",
            fontWeight: 600,
            fontSize: 30,
            color: "#524940",
          }}
        >
          {ACCROCHE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: policeWordmark, weight: 800, style: "normal" },
        { name: "Bricolage Grotesque", data: policeAccroche, weight: 600, style: "normal" },
      ],
    },
  );
}
