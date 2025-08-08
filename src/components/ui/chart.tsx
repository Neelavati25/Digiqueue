import * as React from "react";
import { cn } from "../../lib/utils";

// Props for the tooltip content
export interface ChartTooltipContentProps {
  payload: any[];
  label: string;
  config: any;
}

// Tooltip content renderer
export function ChartTooltipContent({ payload, label, config }: ChartTooltipContentProps) {
  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-md">
      <div className="font-medium">{label}</div>
      <ul className="mt-2 space-y-1">
        {payload.map((item, index) => {
          const dataKey = item.dataKey as keyof typeof config;
          const color = config?.[dataKey]?.color || "#000";
          const itemLabel = config?.[dataKey]?.label || item.name;

          return (
            <li key={index} className="flex items-center justify-between">
              <span className="mr-2">{itemLabel}:</span>
              <span className="font-medium">{item.value}</span>
              <div className="ml-2 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Props for the chart container
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: any;
}

// Chart container that injects config into children
function ChartContainer({ className, children, config, ...props }: ChartContainerProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.type === "function") {
          return React.cloneElement(child as React.ReactElement<any>, { config });
        }
        return child;
      })}
    </div>
  );
}

// Placeholder components
const ChartTooltip = () => null;
const Chart = () => null;

export { Chart, ChartContainer, ChartTooltip };
