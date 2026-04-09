"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { getRangeKey, NormalizedDateRange } from "@/utils/dateHelpers";

type NotesPanelProps = {
  selectedRange: NormalizedDateRange | null;
  compact?: boolean;
  animated?: boolean;
};

const NOTES_STORAGE_KEY = "wall-calendar:range-notes";

type NotesMap = Record<string, string>;

function readNotesMap(): NotesMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as NotesMap) : {};
  } catch {
    return {};
  }
}

export default function NotesPanel({ selectedRange, compact = false, animated = false }: NotesPanelProps) {
  const rangeKey = useMemo(() => getRangeKey(selectedRange), [selectedRange]);
  const attachedText = useMemo(() => {
    if (!selectedRange) {
      return "Attached to: Select a range";
    }

    return `Attached to: ${format(selectedRange.start, "MMM d")} – ${format(selectedRange.end, "MMM d")}`;
  }, [selectedRange]);

  const [draft, setDraft] = useState(() => {
    if (!rangeKey) {
      return "";
    }

    const notes = readNotesMap();
    return notes[rangeKey] ?? "";
  });
  const [status, setStatus] = useState<"idle" | "typing" | "saved">("idle");
  const timerRef = useRef<number | null>(null);

  const persistDraft = (value: string) => {
    if (!rangeKey || typeof window === "undefined") {
      return;
    }

    const nextMap = readNotesMap();
    const cleanDraft = value.trim();

    if (cleanDraft) {
      nextMap[rangeKey] = cleanDraft;
    } else {
      delete nextMap[rangeKey];
    }

    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextMap));
    setStatus("saved");
  };

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return (
    <section className={[
      "rounded-2xl border border-slate-200 bg-white",
      compact ? "p-3" : "p-6 shadow-lg sm:p-7",
      animated ? "animate-notes-enter" : "",
    ].join(" ")}>
      <div className={[
        "flex items-start justify-between gap-3",
        compact ? "mb-2" : "mb-4",
      ].join(" ")}>
        <div>
          <h3 className={compact ? "text-xl font-semibold tracking-tight text-slate-900" : "text-3xl font-semibold tracking-tight text-slate-900"}>Notes</h3>
          <p className={compact ? "mt-0.5 text-xs text-slate-500" : "mt-1 text-sm text-slate-500"}>{attachedText}</p>
        </div>

        <span className={[
          "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200",
          status === "saved" ? "bg-emerald-100 text-emerald-700" : status === "typing" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500",
        ].join(" ")}>
          {status === "saved" ? "Saved" : status === "typing" ? "Saving" : "Idle"}
        </span>
      </div>

      <div
        className={[
          "border border-slate-200 shadow-sm",
          compact ? "rounded-2xl p-2" : "rounded-3xl p-4",
        ].join(" ")}
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, white, white 28px, #e5e7eb 29px)",
          backgroundColor: "white",
        }}
      >
        <textarea
          value={draft}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDraft(nextValue);

            if (!rangeKey) {
              return;
            }

            setStatus("typing");

            if (timerRef.current) {
              window.clearTimeout(timerRef.current);
            }

            timerRef.current = window.setTimeout(() => {
              persistDraft(nextValue);
            }, 550);
          }}
          disabled={!rangeKey}
          placeholder={
            rangeKey
              ? "Capture reminders, deliverables, and highlights for this date range..."
              : "Select a date range to unlock notes"
          }
          className={[
            "w-full resize-none border-0 bg-transparent font-medium text-slate-700 outline-none placeholder:text-slate-400 transition-all duration-200 disabled:cursor-not-allowed disabled:text-slate-400",
            compact ? "min-h-[180px] text-sm leading-[29px]" : "min-h-44 text-base leading-[29px]",
          ].join(" ")}
        />
      </div>
    </section>
  );
}
