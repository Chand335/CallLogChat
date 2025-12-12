import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CallType } from "@shared/schema";

interface FilterPillsProps {
  selectedFilter: CallType | "all";
  onChange: (filter: CallType | "all") => void;
}

const filters: { value: CallType | "all"; label: string; icon: typeof Phone }[] = [
  { value: "all", label: "All", icon: Phone },
  { value: "incoming", label: "Incoming", icon: PhoneIncoming },
  { value: "outgoing", label: "Outgoing", icon: PhoneOutgoing },
  { value: "missed", label: "Missed", icon: PhoneMissed },
];

export function FilterPills({ selectedFilter, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isSelected = selectedFilter === filter.value;
        return (
          <Button
            key={filter.value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="rounded-full gap-1.5 flex-shrink-0"
            onClick={() => onChange(filter.value)}
            data-testid={`button-filter-${filter.value}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
