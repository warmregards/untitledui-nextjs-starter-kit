"use client";

import { useRef, useState } from "react";
import { parseDate, CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { Calendar } from "@/components/application/date-picker/calendar";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

interface DatePickerProps {
    /** The selected date value */
    value?: Date | null;
    /** Callback when date changes */
    onChange?: (date: Date | null) => void;
    /** Placeholder text when no date is selected */
    placeholder?: string;
    /** Additional class names */
    className?: string;
    /** Whether the picker is disabled */
    disabled?: boolean;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Convert JavaScript Date to CalendarDate
 */
function dateToCalendarDate(date: Date): CalendarDate {
    return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    );
}

/**
 * Convert CalendarDate to JavaScript Date
 */
function calendarDateToDate(calendarDate: CalendarDate): Date {
    return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
}

/**
 * Format a date for display
 */
function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ============================================================================
// Component
// ============================================================================

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    className,
    disabled = false,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const calendarValue = value ? dateToCalendarDate(value) : null;

    const handleChange = (newValue: CalendarDate | null) => {
        if (newValue) {
            onChange?.(calendarDateToDate(newValue));
        } else {
            onChange?.(null);
        }
        setIsOpen(false);
    };

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                className={cx(
                    "flex w-full items-center justify-start rounded-lg bg-white px-3 py-2.5 text-left text-md shadow-xs ring-1 ring-inset transition-all",
                    "ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-brand focus:outline-none",
                    disabled && "cursor-not-allowed opacity-50",
                    className
                )}
            >
                <CalendarIcon className="mr-2 size-5 text-gray-400" />
                {value ? (
                    <span className="text-primary">{formatDate(value)}</span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </button>

            <Popover
                placement="bottom start"
                offset={4}
                className={cx(
                    "z-[200] rounded-xl bg-white p-4 shadow-xl ring-1 ring-gray-200",
                    "entering:animate-in entering:fade-in entering:slide-in-from-top-1 entering:duration-150",
                    "exiting:animate-out exiting:fade-out exiting:slide-out-to-top-1 exiting:duration-100"
                )}
            >
                <Dialog className="outline-none">
                    <Calendar
                        value={calendarValue}
                        onChange={(value) => handleChange(value as CalendarDate | null)}
                        className="w-[280px]"
                    />
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
}

export default DatePicker;
