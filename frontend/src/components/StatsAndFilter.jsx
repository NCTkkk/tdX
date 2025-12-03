import React from "react";
import { Badge } from "./ui/badge";
import { Filtertypes } from "@/lib/data";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";

const StatsAndFilter = ({
  completedTaskCount = 0,
  activeTaskCount = 0,
  filter = "all",
  setFilter,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Phần thống kê */}
      <div className="flex gap-3">
        <Badge
          variant="secondary "
          className="bg-white/50 text-accent-foreground border-info/20"
        >
          {activeTaskCount} {Filtertypes.active}
        </Badge>
        <Badge
          variant="secondary "
          className="bg-white/50 text-success border-success/20"
        >
          {completedTaskCount} {Filtertypes.complete}
        </Badge>
      </div>

      {/* Phần filter */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {Object.keys(Filtertypes).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "gradient" : "ghost"}
            size="sm"
            className={"capitalize"}
            onClick={() => setFilter(type)}
          >
            <Filter className="size-4" />
            {Filtertypes[type]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StatsAndFilter;
