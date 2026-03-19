import * as React from "react";
import { SearchInput } from "./searchInput";
import { Badge } from "./badge";
import { cn } from "@/shared/utils";

export interface SearchSelectItem {
  id: number;
  name: string;
}

interface SearchSelectFieldProps {
  items: SearchSelectItem[];
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  popularLabel?: string;
  emptyMessage?: string;
  maxPopular?: number;
  maxSearchResults?: number;
  showPopular?: boolean;
  className?: string;
}

export function SearchSelectField({
  items,
  value,
  onChange,
  placeholder: _placeholder,
  searchPlaceholder = "Buscar...",
  popularLabel = "Populares:",
  emptyMessage = "Nenhum item disponível encontrado",
  maxPopular = 20,
  maxSearchResults = 8,
  showPopular = true,
  className,
}: SearchSelectFieldProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedIds = value ?? [];

  const toggleSelection = (id: number) => {
    const newValue = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    onChange(newValue);
    setSearchTerm("");
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  const filteredSearch = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedIds.includes(item.id),
    )
    .slice(0, maxSearchResults);

  const availablePopular = items
    .filter((item) => !selectedIds.includes(item.id))
    .slice(0, maxPopular);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input with Dropdown */}
      <div className="relative" ref={containerRef}>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "bg-bg-2 border-bg-3 focus:border-primary-1",
            className,
          )}
        />
        {searchTerm && (
          <div className="absolute top-full left-0 w-full mt-2 bg-bg-2 border border-bg-3 rounded-lg z-20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {filteredSearch.length > 0 ? (
              filteredSearch.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-bg-3 transition-colors text-white-1 text-sm border-b border-bg-3 last:border-b-0 cursor-pointer"
                  onClick={() => toggleSelection(item.id)}
                >
                  {item.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-white-2 text-sm text-center">
                {emptyMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Items Badges */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="default"
              onClick={() => toggleSelection(item.id)}
              hasIcon={true}
            >
              {item.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Popular Items */}
      {showPopular && availablePopular.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-white-2 text-sm font-medium">
            {popularLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {availablePopular.map((item) => (
              <Badge
                key={item.id}
                variant="outline"
                onClick={() => toggleSelection(item.id)}
              >
                {item.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
