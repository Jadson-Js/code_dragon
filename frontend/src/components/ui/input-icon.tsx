import * as React from "react";

import { cn } from "@/lib/utils";

interface InputIconProps extends React.ComponentProps<"input"> {
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    onIconRightClick?: () => void;
}

function InputIcon({
    className,
    type,
    iconLeft,
    iconRight,
    onIconRightClick,
    ...props
}: InputIconProps) {
    return (
        <div className="relative w-full">
            {iconLeft && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white-2 pointer-events-none">
                    {iconLeft}
                </div>
            )}
            <input
                type={type}
                data-slot="input"
                className={cn(
                    "w-full h-12 bg-bg-2 text-white-1 rounded-lg border border-bg-3 outline-none transition-all",
                    "placeholder:text-white-2",
                    "focus:ring-2 focus:ring-primary-1/50",
                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    iconLeft ? "pl-12" : "pl-4",
                    iconRight ? "pr-12" : "pr-4",
                    className
                )}
                {...props}
            />
            {iconRight && (
                <button
                    type="button"
                    onClick={onIconRightClick}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white-2 hover:text-white-1 transition-colors cursor-pointer"
                    tabIndex={-1}
                >
                    {iconRight}
                </button>
            )}
        </div>
    );
}

export { InputIcon };
