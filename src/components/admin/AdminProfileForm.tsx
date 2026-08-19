"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/profiles/queries";
import type { Profile } from "@/types/database";

type AdminProfileFormProps = {
  profile: Profile;
  email: string;
  derniereConnexion: string;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

export default function AdminProfileForm({ profile, email, derniereConnexion }: AdminProfileFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [apercuAvatar, setApercuAvatar] = useState<string | null>(profile.avatar_url);
  const [nom, setNom] = useState(profile.nom);
  const [telephone, setTelephone] = useState(profile.telephone ?? "");
  const [nouvelEmail, setNouvelEmail] = useState(email);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAvatarChange(fichier: File | null) {
    setAvatarFile(fichier);
    setApercuAvatar(fichier ? URL.createObjectURL(fichier) : profile.avatar_url);
  }

  async function uploaderAvatar(): Promise<string | null> {
    if (!avatarFile) return null;

    const supabase = createClient();
    const chemin = `${profile.id}/${Date.now()}-${avatarFile.name}`;
    const { error } = await supabase.storage.from("avatars").upload(chemin, avatarFile);
    if (error) return null;

    const { data } = supabase.storage.from("avatars").getPublicUrl(chemin);
    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const avatarUrl = await uploaderAvatar();

    const { error } = await updateProfile(profile.id, {
      nom,
      telephone: telephone || null,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    });

    if (error) {
      setLoading(false);
      setMessage(error);
      return;
    }

    if (nouvelEmail !== email) {
      const supabase = createClient();
      const { error: emailError } = await supabase.auth.updateUser({ email: nouvelEmail });
      setLoading(false);
      setMessage(
        emailError
          ? emailError.message
          : "Profil mis à jour. Vérifiez votre nouvelle adresse pour confirmer le changement d'e-mail.",
      );
      return;
    }

    setLoading(false);
    setMessage("Profil mis à jour.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="mb-5 flex items-center gap-4">
        <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-2xl font-bold text-white">
          {apercuAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={apercuAvatar} alt="Photo de profil" className="h-full w-full object-cover" />
          ) : (
            (nom.charAt(0) || "?").toUpperCase()
          )}
        </span>
        <div>
          <label className="inline-block cursor-pointer rounded-lg border border-line bg-secondary px-3.5 py-2 text-sm font-semibold text-ink">
            Changer la photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleAvatarChange(event.target.files?.[0] ?? null)}
            />
          </label>
          <p className="mt-1.5 text-[11.5px] text-ink-muted">
            Optionnel — un cercle avec l&apos;initiale sinon.
          </p>
        </div>
      </div>

      <label className="mb-3.5 flex flex-col gap-1 text-sm text-ink-muted">
        Nom
        <input
          type="text"
          required
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="mb-3.5 flex flex-col gap-1 text-sm text-ink-muted">
        Téléphone
        <input
          type="tel"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="mb-4 flex flex-col gap-1 text-sm text-ink-muted">
        Adresse e-mail
        <input
          type="email"
          required
          value={nouvelEmail}
          onChange={(event) => setNouvelEmail(event.target.value)}
          className={CHAMP}
        />
      </label>

      {message && <p className="mb-3 text-sm text-ink-muted">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-xl bg-accent px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>

      <p className="mt-4 text-[11.5px] text-ink-muted">Dernière connexion : {derniereConnexion}</p>
    </form>
  );
}
