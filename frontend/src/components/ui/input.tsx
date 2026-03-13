import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { InputMask as BaseInputMask } from "@react-input/mask";

import { cn } from "@/shared/utils";

interface InputWithIconsProps extends React.ComponentProps<"input"> {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

interface InputMaskProps extends React.ComponentProps<"input"> {
  mask: string;
  replacement?: Record<string, RegExp>;
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-white-2 selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 rounded-[8px] border border-bg-3 bg-bg-2 px-3 py-5 text-base text-white-1  transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-primary-1 focus-visible:ring-primary-1/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
  ({ className, type, mask, ...props }, ref) => {
    return (
      <BaseInputMask
        ref={ref}
        mask={mask}
        replacement={{ _: /\d/ }}
        className={cn(
          "file:text-foreground placeholder:text-white-2 selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 rounded-[8px] border border-bg-3 bg-bg-2 px-3 py-5 text-base text-white-1  transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-primary-1 focus-visible:ring-primary-1/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
InputMask.displayName = "InputMask";

const InputWithIcons = React.forwardRef<HTMLInputElement, InputWithIconsProps>(
  (
    {
      className,
      type,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onLeftIconClick,
      onRightIconClick,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative flex items-center w-full">
        {LeftIcon && (
          <button
            type="button"
            onClick={onLeftIconClick}
            disabled={!onLeftIconClick}
            className={cn(
              "absolute left-3 size-5 text-white-2 transition-colors",
              onLeftIconClick
                ? "cursor-pointer hover:text-white-1"
                : "pointer-events-none",
            )}
          >
            <LeftIcon className="size-full" />
          </button>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-white-2 selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 rounded-[8px] border border-bg-3 bg-bg-2 py-5 text-base text-white-1 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-primary-1 focus-visible:ring-primary-1/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            LeftIcon ? "pl-11" : "pl-3",
            RightIcon ? "pr-11" : "pr-3",
            className,
          )}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={!onRightIconClick}
            className={cn(
              "absolute right-3 size-5 text-white-2 transition-colors",
              onRightIconClick
                ? "cursor-pointer hover:text-white-1"
                : "pointer-events-none",
            )}
          >
            <RightIcon className="size-full" />
          </button>
        )}
      </div>
    );
  },
);
InputWithIcons.displayName = "InputWithIcons";

export { Input, InputMask, InputWithIcons };
