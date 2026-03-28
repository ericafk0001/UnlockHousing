"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

type TooltipEntry = {
  dataKey?: string | number;
  color?: string;
  value?: number | string;
};

type ChartStyle = React.CSSProperties & Record<string, string>;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  config,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  const style = Object.entries(config).reduce((acc, [key, item]) => {
    if (item.color) {
      acc[`--color-${key}`] = item.color;
    }
    return acc;
  }, {} as ChartStyle);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn("h-full w-full", className)}
        style={style}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
};

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
      {!hideLabel ? (
        <p className="text-xs font-medium uppercase tracking-wide text-black/60">
          {label}
        </p>
      ) : null}
      <div className="mt-1 space-y-1">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? "");
          const item = config[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2">
                {!hideIndicator ? (
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        item?.color ?? (entry.color as string | undefined),
                    }}
                  />
                ) : null}
                <span className="text-black/70">{item?.label ?? key}</span>
              </div>
              <span className="font-semibold text-black">
                {typeof entry.value === "number"
                  ? `${entry.value.toFixed(1)}%`
                  : entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
