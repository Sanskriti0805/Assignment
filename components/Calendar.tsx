"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addMonths, format, isSameDay, isToday } from "date-fns";
import DayCell from "@/components/DayCell";
import Header from "@/components/Header";
import NotesPanel from "@/components/NotesPanel";
import {
  DateRange,
  getMonthGrid,
  getRangeKey,
  isSameDate,
  isStrictlyBetween,
  normalizeRange,
  parseRangeKey,
  WEEKDAY_LABELS,
} from "@/utils/dateHelpers";

const RANGE_STORAGE_KEY = "wall-calendar:selected-range";

type TransitionDirection = "next" | "prev";

export default function Calendar() {
  const [selection, setSelection] = useState<DateRange>({ start: null, end: null });
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [direction, setDirection] = useState<TransitionDirection>("next");
  const [monthToken, setMonthToken] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(RANGE_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = parseRangeKey(raw);
    if (!parsed) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      setSelection({ start: parsed.start, end: parsed.end });
      setCurrentMonth(parsed.start);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);



  const normalizedRange = useMemo(() => normalizeRange(selection), [selection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rangeKey = getRangeKey(normalizedRange);
    if (!rangeKey) {
      window.localStorage.removeItem(RANGE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(RANGE_STORAGE_KEY, rangeKey);
  }, [normalizedRange]);



  const monthGrid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const monthLabel = useMemo(() => format(currentMonth, "MMMM yyyy"), [currentMonth]);
  const heroMonth = useMemo(() => format(currentMonth, "MMMM").toUpperCase(), [currentMonth]);
  const heroYear = useMemo(() => format(currentMonth, "yyyy"), [currentMonth]);

  const moveMonth = useCallback((nextDirection: TransitionDirection) => {
    setDirection(nextDirection);
    setCurrentMonth((prevMonth) => addMonths(prevMonth, nextDirection === "next" ? 1 : -1));
    setMonthToken((token) => token + 1);
  }, []);

  const handleDaySelect = useCallback((day: Date) => {
    setSelection((previous) => {
      if (!previous.start || (previous.start && previous.end)) {
        return { start: day, end: null };
      }

      if (isSameDay(previous.start, day)) {
        return { start: previous.start, end: day };
      }

      return { start: previous.start, end: day };
    });
  }, []);



  return (
    <section className="grid h-full min-h-0 grid-rows-[auto_1fr] bg-white p-3 sm:p-4">
      <div className="mb-2 flex items-end justify-between border-b border-slate-200 pb-2">
        <div>
          <p className="font-display text-[0.7rem] uppercase tracking-[0.25em] text-slate-500">Wall Calendar</p>
          <div className="mt-1 flex items-end gap-2">
            <h1 className="font-display text-2xl leading-none text-slate-900 sm:text-3xl">{heroMonth}</h1>
            <span className="pb-1 text-sm font-semibold tracking-[0.2em] text-sky-700">{heroYear}</span>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 gap-3 md:grid-cols-[220px_1fr] md:gap-4">
        <div className="order-2 md:order-1">
          <NotesPanel key={getRangeKey(normalizedRange) || "no-range"} selectedRange={normalizedRange} compact animated />
        </div>

        <div className="order-1 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-slate-50/35 p-3 sm:p-4">
          <Header monthLabel={monthLabel} onPrevious={() => moveMonth("prev")} onNext={() => moveMonth("next")} />

          <div className="mx-auto flex w-full max-w-[500px] flex-1 min-h-0 flex-col">
            <div className="mb-2 grid grid-cols-7 gap-1 px-0.5">
              {WEEKDAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="px-0.5 py-1 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500"
                >
                  {label}
                </div>
              ))}
            </div>

            <div
              key={`${format(currentMonth, "yyyy-MM")}-${monthToken}`}
              className={[
                "grid grid-cols-7 gap-1 sm:gap-1.5",
                direction === "next" ? "animate-month-next" : "animate-month-prev",
              ].join(" ")}
            >
              {monthGrid.map((entry, index) => {
                const isStart = normalizedRange ? isSameDate(entry.date, normalizedRange.start) : false;
                const isEnd = normalizedRange ? isSameDate(entry.date, normalizedRange.end) : false;
                const isSingleDayRange = normalizedRange
                  ? isSameDate(normalizedRange.start, normalizedRange.end) && isStart && isEnd
                  : false;
                const inRange = normalizedRange ? isStrictlyBetween(entry.date, normalizedRange) : false;
                const weekend = entry.date.getDay() === 0 || entry.date.getDay() === 6;

                return (
                  <DayCell
                    key={entry.date.toISOString()}
                    index={index}
                    dayNumber={entry.date.getDate()}
                    isCurrentMonth={entry.isCurrentMonth}
                    isToday={isToday(entry.date)}
                    isWeekend={weekend}
                    isRangeStart={isStart}
                    isRangeEnd={isEnd}
                    isInRange={inRange}
                    isRangeSingle={isSingleDayRange}
                    onSelect={() => handleDaySelect(entry.date)}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-slate-700 sm:text-sm">
            {normalizedRange
              ? `${format(normalizedRange.start, "MMM d, yyyy")} to ${format(normalizedRange.end, "MMM d, yyyy")}`
              : "Pick a start date, then an end date. Click again to begin a new range."}
          </div>
        </div>
      </div>
    </section>
  );
}
