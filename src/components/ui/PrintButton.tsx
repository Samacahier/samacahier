"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded bg-black px-3 py-2 text-white"
    >
      Imprimer / Enregistrer en PDF
    </button>
  );
}
