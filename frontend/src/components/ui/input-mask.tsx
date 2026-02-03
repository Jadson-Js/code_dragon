import * as React from "react";
import { useState, useCallback } from "react";

import { cn } from "@/lib/utils";

type MaskType = "date" | "phone" | "cpf" | "cnpj" | "cep";

interface MaskConfig {
  pattern: string;
  maxLength: number;
  placeholder: string;
}

const MASK_CONFIGS: Record<MaskType, MaskConfig> = {
  date: {
    pattern: "##/##/####",
    maxLength: 10,
    placeholder: "DD/MM/AAAA",
  },
  phone: {
    pattern: "(##) #####-####",
    maxLength: 15,
    placeholder: "(00) 00000-0000",
  },
  cpf: {
    pattern: "###.###.###-##",
    maxLength: 14,
    placeholder: "000.000.000-00",
  },
  cnpj: {
    pattern: "##.###.###/####-##",
    maxLength: 18,
    placeholder: "00.000.000/0000-00",
  },
  cep: {
    pattern: "#####-###",
    maxLength: 9,
    placeholder: "00000-000",
  },
};

function applyMask(value: string, mask: string): string {
  const numbers = value.replace(/\D/g, "");
  let result = "";
  let numberIndex = 0;

  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === "#") {
      result += numbers[numberIndex];
      numberIndex++;
    } else {
      result += mask[i];
    }
  }

  return result;
}

interface InputMaskProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  mask: MaskType;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconRightClick?: () => void;
  onValueChange?: (value: string, rawValue: string) => void;
}

function InputMask({
  className,
  mask,
  iconLeft,
  iconRight,
  onIconRightClick,
  onValueChange,
  value: controlledValue,
  ...props
}: InputMaskProps) {
  const config = MASK_CONFIGS[mask];
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue !== undefined ? String(controlledValue) : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "");
      const formatted = applyMask(e.target.value, config.pattern);

      if (controlledValue === undefined) {
        setInternalValue(formatted);
      }

      onValueChange?.(formatted, rawValue);
    },
    [config.pattern, controlledValue, onValueChange]
  );

  return (
    <div className="relative w-full">
      {iconLeft && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white-2 pointer-events-none">
          {iconLeft}
        </div>
      )}
      <input
        type="text"
        inputMode="numeric"
        data-slot="input"
        maxLength={config.maxLength}
        placeholder={props.placeholder || config.placeholder}
        value={value}
        onChange={handleChange}
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

export { InputMask, type MaskType };
