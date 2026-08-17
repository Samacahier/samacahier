type RegisterProgressProps = {
  step: 1 | 2;
};

const ETAPES = ["Compte", "Commerce"];

export default function RegisterProgress({ step }: RegisterProgressProps) {
  return (
    <ol className="flex gap-2">
      {ETAPES.map((etape, index) => {
        const numero = index + 1;
        const franchie = numero <= step;

        return (
          <li key={etape} className="flex flex-1 flex-col gap-1">
            <div className={`h-1 rounded-full ${franchie ? "bg-black" : "bg-zinc-200"}`} />
            <span className={`text-xs ${numero === step ? "font-semibold" : "text-zinc-500"}`}>
              {numero}. {etape}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
