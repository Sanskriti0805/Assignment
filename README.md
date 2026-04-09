# Wall Calendar

Production-style interactive wall calendar built with Next.js App Router, React, TypeScript, Tailwind CSS, and date-fns.

## Features

- Month calendar with Monday-first weekday headers.
- Date range selection:
	- First click selects start date.
	- Second click selects end date.
	- Third click resets and starts a new range.
- Handles same-day and reverse-order range selection.
- Notes panel attached to selected date range.
- localStorage persistence for:
	- Selected date range.
	- Saved notes per range.
- Weekend color differentiation.
- Smooth interaction and month-change animations.
- Responsive wall-calendar layout:
	- Mobile: hero image, calendar, notes.
	- Desktop: hero image left, calendar and notes right.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

- `app/page.tsx`
- `components/Calendar.tsx`
- `components/DayCell.tsx`
- `components/Header.tsx`
- `components/NotesPanel.tsx`
- `utils/dateHelpers.ts`

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- date-fns
