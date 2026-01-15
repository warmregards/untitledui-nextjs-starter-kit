"use client";

import { useState, useRef } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

interface TimePickerProps {
    /** The selected time value in HH:MM format (24-hour) */
    value?: string;
    /** Callback when time changes */
    onChange?: (time: string) => void;
    /** Placeholder text when no time is selected */
    placeholder?: string;
    /** Additional class names */
    className?: string;
    /** Whether the picker is disabled */
    disabled?: boolean;
}

// ============================================================================
// Time Options
// ============================================================================

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"] as const;

// ============================================================================
// Utilities
// ============================================================================

/**
 * Convert 24-hour time to 12-hour format
 */
function to12Hour(time24: string): { hour: number; minute: string; period: "AM" | "PM" } {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12 || 12;
    return { hour, minute: String(minutes).padStart(2, "0"), period };
}

/**
 * Convert 12-hour time to 24-hour format
 */
function to24Hour(hour: number, minute: string, period: "AM" | "PM"): string {
    let hours24 = hour;
    if (period === "PM" && hour !== 12) {
        hours24 = hour + 12;
    } else if (period === "AM" && hour === 12) {
        hours24 = 0;
    }
    return `${String(hours24).padStart(2, "0")}:${minute}`;
}

/**
 * Format time for display
 */
function formatTimeDisplay(time24: string): string {
    const { hour, minute, period } = to12Hour(time24);
    return `${hour}:${minute} ${period}`;
}

// ============================================================================
// Component
// ============================================================================

export function TimePicker({
    value,
    onChange,
    placeholder = "Select time",
    className,
    disabled = false,
}: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Parse current value or use defaults
    const parsed = value ? to12Hour(value) : { hour: 9, minute: "00", period: "AM" as const };
    const [selectedHour, setSelectedHour] = useState(parsed.hour);
    const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
    const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(parsed.period);

    const handleConfirm = () => {
        const time24 = to24Hour(selectedHour, selectedMinute, selectedPeriod);
        onChange?.(time24);
        setIsOpen(false);
    };

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                className={cx(
                    "flex w-full items-center justify-between rounded-lg bg-white px-3 py-2.5 text-left text-md shadow-xs ring-1 ring-inset transition-all",
                    "ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-brand focus:outline-none",
                    disabled && "cursor-not-allowed opacity-50",
                    className
                )}
            >
                <div className="flex items-center gap-2">
                    <Clock className="size-5 text-gray-400" />
                    {value ? (
                        <span className="text-primary">{formatTimeDisplay(value)}</span>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className="size-4 text-gray-400" />
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
                    <div className="w-64">
                        {/* Time Selectors */}
                        <div className="flex items-center justify-center gap-2">
                            {/* Hour */}
                            <div className="flex-1">
                                <label className="mb-1.5 block text-center text-xs font-medium text-tertiary">Hour</label>
                                <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200">
                                    {HOURS_12.map((hour) => (
                                        <button
                                            key={hour}
                                            type="button"
                                            onClick={() => setSelectedHour(hour)}
                                            className={cx(
                                                "w-full py-2 text-center text-sm font-medium transition-colors",
                                                selectedHour === hour
                                                    ? "bg-brand-50 text-brand-700"
                                                    : "text-secondary hover:bg-gray-50"
                                            )}
                                        >
                                            {hour}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <span className="mt-6 text-lg font-semibold text-tertiary">:</span>

                            {/* Minute */}
                            <div className="flex-1">
                                <label className="mb-1.5 block text-center text-xs font-medium text-tertiary">Min</label>
                                <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200">
                                    {MINUTES.map((minute) => (
                                        <button
                                            key={minute}
                                            type="button"
                                            onClick={() => setSelectedMinute(minute)}
                                            className={cx(
                                                "w-full py-2 text-center text-sm font-medium transition-colors",
                                                selectedMinute === minute
                                                    ? "bg-brand-50 text-brand-700"
                                                    : "text-secondary hover:bg-gray-50"
                                            )}
                                        >
                                            {minute}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AM/PM */}
                            <div className="flex-1">
                                <label className="mb-1.5 block text-center text-xs font-medium text-tertiary">Period</label>
                                <div className="rounded-lg border border-gray-200">
                                    {PERIODS.map((period) => (
                                        <button
                                            key={period}
                                            type="button"
                                            onClick={() => setSelectedPeriod(period)}
                                            className={cx(
                                                "w-full py-2 text-center text-sm font-medium transition-colors",
                                                selectedPeriod === period
                                                    ? "bg-brand-50 text-brand-700"
                                                    : "text-secondary hover:bg-gray-50"
                                            )}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-center">
                            <span className="text-lg font-semibold text-primary">
                                {selectedHour}:{selectedMinute} {selectedPeriod}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
}

export default TimePicker;
