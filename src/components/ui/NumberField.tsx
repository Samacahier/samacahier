"use client";

import { useState, type FocusEvent, type ChangeEvent } from "react";

type NumberFieldProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: string | number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function NumberField({
  value,
  onChange,
  min,
  step = "any",
  required,
  disabled,
  className,
}: NumberFieldProps) {
  const [texte, setTexte] = useState(String(value));
  const [derniereValeur, setDerniereValeur] = useState(value);

  // Resynchronise l'affichage si `value` change depuis l'extérieur (ex.
  // préremplissage), sauf en cours de saisie de cette même valeur : sinon
  // une décimale en cours ("10.") serait écrasée en "10".
  if (value !== derniereValeur) {
    setDerniereValeur(value);
    if (!(texte !== "" && Number(texte) === value)) {
      setTexte(String(value));
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let saisie = event.target.value;

    // Pas de zéro en tête : taper sur un champ à "0" remplace le 0.
    if (/^0\d/.test(saisie)) {
      saisie = saisie.replace(/^0+/, "");
    }

    setTexte(saisie);

    if (saisie === "" || saisie === "-") return;

    const nombre = Number(saisie);
    if (!Number.isNaN(nombre)) onChange(nombre);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  function handleBlur() {
    if (texte === "" || texte === "-") {
      setTexte("0");
      onChange(0);
    }
  }

  return (
    <input
      type="number"
      inputMode="decimal"
      min={min}
      step={step}
      required={required}
      disabled={disabled}
      value={texte}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
}
