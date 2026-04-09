import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type NormalizedDateRange = {
  start: Date;
  end: Date;
};

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
};

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function toDateOnly(date: Date): Date {
  return startOfDay(date);
}

export function normalizeRange(range: DateRange): NormalizedDateRange | null {
  if (!range.start || !range.end) {
    return null;
  }

  const start = toDateOnly(range.start);
  const end = toDateOnly(range.end);

  return isAfter(start, end) ? { start: end, end: start } : { start, end };
}

export function getMonthGrid(monthDate: Date): CalendarDay[] {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    isCurrentMonth: date.getMonth() === monthStart.getMonth(),
  }));
}

export function isStrictlyBetween(target: Date, range: NormalizedDateRange): boolean {
  const date = toDateOnly(target);
  return isAfter(date, range.start) && isBefore(date, range.end);
}

export function toStorageDate(date: Date): string {
  return format(toDateOnly(date), "yyyy-MM-dd");
}

export function getRangeKey(range: NormalizedDateRange | null): string {
  if (!range) {
    return "";
  }

  return `${toStorageDate(range.start)}_${toStorageDate(range.end)}`;
}

export function parseStorageDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(year, month - 1, day);

  return Number.isNaN(candidate.getTime()) ? null : startOfDay(candidate);
}

export function parseRangeKey(value: string): NormalizedDateRange | null {
  const [startRaw, endRaw] = value.split("_");
  if (!startRaw || !endRaw) {
    return null;
  }

  const start = parseStorageDate(startRaw);
  const end = parseStorageDate(endRaw);

  if (!start || !end) {
    return null;
  }

  return normalizeRange({ start, end });
}

export function getMonthChangePreview(month: Date, direction: "next" | "prev"): Date {
  return addDays(startOfMonth(month), direction === "next" ? 31 : -1);
}

export function isSameDate(a: Date, b: Date): boolean {
  return isSameDay(a, b);
}
