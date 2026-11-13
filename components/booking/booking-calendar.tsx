"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, TZDate } from "react-day-picker";
import { enGB } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { bookingDateToUtc, formatBookingDate, isCalendarDate } from "@/lib/booking-time";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type BookingCalendarProps = {
  id: string;
  value: string;
  today: string | null;
  invalid?: boolean;
  errorId?: string;
  onChange: (date: string) => void;
};

// Keep calendar values in London time, including on devices west/east of the UK.
const calendarDate = (value: string) => new TZDate(bookingDateToUtc(value), siteConfig.timeZone);
// Use a native Date at the boundary between DayPicker's TZDate and date-fns-tz.
const format = (date: Date, pattern: string) => formatInTimeZone(new Date(date.getTime()), siteConfig.timeZone, pattern, { locale: enGB });

export function BookingCalendar({ id, value, today, invalid = false, errorId, onChange }: BookingCalendarProps) {
  const selected = isCalendarDate(value) ? calendarDate(value) : undefined;
  const firstDay = today ? calendarDate(today) : undefined;

  return (
    <div className="mt-5">
      <p id={`${id}-label`} className="text-sm font-bold">Preferred date</p>
      <div
        id={id}
        data-field="date"
        role="group"
        tabIndex={-1}
        aria-labelledby={`${id}-label`}
        aria-describedby={invalid ? errorId : `${id}-hint`}
        lang="en-GB"
        className={cn("focus-ring mt-2 min-w-0 rounded-3xl border bg-white p-3 sm:p-5", invalid ? "border-red-500" : "border-ink/10")}
      >
        {firstDay ? (
          <DayPicker
            mode="single"
            required
            selected={selected}
            onSelect={(date) => onChange(format(date, "yyyy-MM-dd"))}
            defaultMonth={selected || firstDay}
            today={firstDay}
            startMonth={firstDay}
            disabled={{ before: firstDay }}
            timeZone={siteConfig.timeZone}
            locale={enGB}
            lang="en-GB"
            weekStartsOn={1}
            navLayout="around"
            fixedWeeks
            showOutsideDays={false}
            aria-label="Choose your preferred appointment date"
            formatters={{
              formatCaption: (date) => format(date, "MMMM yyyy"),
              formatWeekdayName: (date) => format(date, "EEE")
            }}
            labels={{
              labelPrevious: () => "Previous month",
              labelNext: () => "Next month",
              labelDayButton: (date, modifiers) => `${format(date, "EEEE, d MMMM yyyy")}${modifiers.today ? ", today" : ""}${modifiers.selected ? ", selected" : ""}`,
              labelWeekday: (date) => format(date, "EEEE"),
              labelGrid: (date) => format(date, "MMMM yyyy")
            }}
            components={{
              Chevron: ({ orientation }) => orientation === "left"
                ? <ChevronLeft size={18} aria-hidden="true" />
                : <ChevronRight size={18} aria-hidden="true" />
            }}
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "relative w-full",
              month_caption: "flex h-11 items-center justify-center px-11",
              caption_label: "display-title text-center text-xl leading-tight sm:text-2xl",
              button_previous: "focus-ring absolute left-0 top-0 grid h-11 w-10 place-items-center rounded-full border border-ink/10 text-teal hover:bg-mint disabled:cursor-not-allowed disabled:opacity-30",
              button_next: "focus-ring absolute right-0 top-0 grid h-11 w-10 place-items-center rounded-full border border-ink/10 text-teal hover:bg-mint disabled:cursor-not-allowed disabled:opacity-30",
              month_grid: "mt-4 w-full table-fixed border-collapse",
              weekday: "h-9 text-center text-xs font-semibold text-ink/60",
              day: "p-0.5 text-center",
              day_button: "focus-ring mx-auto grid min-h-10 w-full max-w-11 place-items-center rounded-xl text-sm font-semibold transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:text-ink/25 disabled:hover:bg-transparent sm:min-h-11",
              selected: "[&>button]:bg-teal [&>button]:text-white [&>button]:hover:bg-ink",
              today: "[&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-teal/40",
              hidden: "invisible"
            }}
          />
        ) : <p role="status" className="py-8 text-center text-sm text-ink/60">Loading calendar…</p>}
        <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 flex items-center gap-2 rounded-2xl bg-mint/50 px-3 py-3 text-sm font-semibold text-teal">
          <CalendarDays size={18} aria-hidden="true" />
          {selected ? formatBookingDate(value) : "Choose a day that suits you"}
        </p>
      </div>
      <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-ink/60">Dates follow London time. Past dates cannot be selected.</p>
    </div>
  );
}
