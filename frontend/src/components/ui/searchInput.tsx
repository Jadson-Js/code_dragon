import * as React from "react";
import { Search } from "lucide-react";
import { InputWithIcons } from "./input";
import { cn } from "@/shared/utils";

interface SearchInputProps extends React.ComponentProps<
  typeof InputWithIcons
> {}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <InputWithIcons
        ref={ref}
        leftIcon={Search}
        className={cn("bg-[#1a202c] border-white/5", className)}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
