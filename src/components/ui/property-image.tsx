"use client";

import { Home } from "lucide-react";
import { cx } from "@/utils/cx";

interface PropertyImageProps {
    src: string | undefined;
    alt: string;
    className?: string;
}

export function PropertyImage({ src, alt, className }: PropertyImageProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={cx("object-cover", className)}
            />
        );
    }

    return (
        <div
            className={cx(
                "flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-300",
                className
            )}
        >
            <Home className="w-[40%] h-[40%]" />
        </div>
    );
}
