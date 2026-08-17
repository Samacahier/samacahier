import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/12 bg-page/88 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1160px] items-center justify-between px-5 sm:px-7">
        <div className="font-display text-[22px] font-extrabold tracking-tight">
          Sama<span className="text-accent">·</span>Cahier
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink px-5 py-2.5 text-[14.5px] font-semibold transition-colors hover:bg-ink hover:text-card"
        >
          Se connecter
        </Link>
      </div>
    </header>
  );
}
