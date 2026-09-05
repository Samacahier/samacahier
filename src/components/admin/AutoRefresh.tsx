"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const INTERVALLE_MS = 30_000;

// Rafraîchit périodiquement les données serveur de la page courante (sans
// rechargement complet), pour que les pages admin consultées en continu
// reflètent l'activité récente des commerçants sans action manuelle.
export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const intervalle = setInterval(() => router.refresh(), INTERVALLE_MS);
    return () => clearInterval(intervalle);
  }, [router]);

  return null;
}
