type HeaderProps = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
};

export default function Header({ monthLabel, onPrevious, onNext }: HeaderProps) {
  return (
    <header className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
      <div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-500">Month View</p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{monthLabel}</h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Show previous month"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sky-100 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 active:scale-95 sm:h-9 sm:w-9"
        >
          <span aria-hidden="true">&#8592;</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Show next month"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sky-100 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 active:scale-95 sm:h-9 sm:w-9"
        >
          <span aria-hidden="true">&#8594;</span>
        </button>
      </div>
    </header>
  );
}
