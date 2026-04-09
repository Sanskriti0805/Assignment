import { memo, useRef, useCallback } from "react";

type DayCellProps = {
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isRangeSingle: boolean;
  index: number;
  onSelect: () => void;
};

function DayCell({
  dayNumber,
  isCurrentMonth,
  isToday,
  isWeekend,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isRangeSingle,
  index,
  onSelect,
}: DayCellProps) {
  const isEdge = isRangeStart || isRangeEnd;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    onSelect();
    if (isEdge && buttonRef.current) {
      buttonRef.current.classList.add("active");
      const timeout = setTimeout(() => {
        buttonRef.current?.classList.remove("active");
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isEdge, onSelect]);

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={!isCurrentMonth}
      onClick={handleClick}
      className={[
        "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-transparent p-1 text-sm font-medium transition-all duration-200 sm:rounded-xl sm:text-base hover-scale-lift",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
        "animate-cell-stagger",
        isCurrentMonth
          ? "cursor-pointer bg-white text-slate-700 active:scale-95"
          : "cursor-not-allowed bg-slate-50 text-slate-300",
        isWeekend && isCurrentMonth ? "text-slate-500" : "",
        isInRange ? "bg-blue-100 text-slate-900 transition-colors-smooth" : "",
        isEdge ? "bg-transparent text-white ripple-on-select" : "",
      ].join(" ")}
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      {(isInRange || isEdge) && !isRangeSingle ? (
        <span
          className={[
            "absolute inset-y-1 bg-blue-100",
            isInRange ? "inset-x-0 rounded-none" : "",
            isRangeStart ? "left-1/2 right-0 rounded-r-full" : "",
            isRangeEnd ? "left-0 right-1/2 rounded-l-full" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      ) : null}

      <span
        className={[
          "relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full tabular-nums transition-all duration-200 sm:h-8 sm:w-8",
          isEdge ? "bg-blue-600 text-white shadow-md" : "",
          !isEdge && isInRange ? "bg-transparent text-slate-900" : "",
          !isEdge && !isInRange && isCurrentMonth ? "bg-transparent" : "",
        ].join(" ")}
      >
        {dayNumber}
      </span>

      {isToday && !isEdge ? (
        <span className="absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-sky-500 transition-colors" aria-hidden="true" />
      ) : null}
    </button>
  );
}

export default memo(DayCell);
