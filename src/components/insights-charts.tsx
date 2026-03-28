"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const withoutHousingData = [
  { outcome: "Not Re-Arrested", percentage: 33.3, barColor: "#C35252" },
  {
    outcome: "Re-Arrested within 12 months",
    percentage: 66.6,
    barColor: "#456FA7",
  },
];

const withHousingData = [
  { name: "Not re-arrested in 12 months", value: 75 },
  { name: "Re-Arrested", value: 25 },
];

const withoutHousingConfig = {
  percentage: {
    label: "Percentage",
    color: "#C35252",
  },
} satisfies ChartConfig;

const withHousingConfig = {
  notReArrested: {
    label: "Not re-arrested in 12 months",
    color: "#C35252",
  },
  reArrested: {
    label: "Re-Arrested",
    color: "#456FA7",
  },
} satisfies ChartConfig;

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
    };
    value: number;
  }>;
}

const CustomPieTooltip = ({ active, payload }: CustomPieTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded bg-white p-2 shadow-lg border border-gray-300">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className="text-sm">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function InsightsCharts() {
  return (
    <section
      id="insights-data"
      className="bg-white px-4 pb-4 sm:px-6 sm:pb-6 lg:px-10 lg:pb-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-[2.1rem] border border-black/8 bg-[#f5f2eb] px-6 py-7 sm:px-8 sm:py-9 lg:px-10">
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-black/10 bg-white px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-lg font-semibold text-[#181c21] sm:text-xl">
                Individuals Released Without Stable Housing
              </p>
              <div className="mt-4 h-96">
                <ChartContainer config={withoutHousingConfig}>
                  <BarChart
                    data={withoutHousingData}
                    margin={{ top: 8, right: 12, left: 6, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(0,0,0,0.1)"
                    />
                    <XAxis
                      dataKey="outcome"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: "#3d444b", fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: "#3d444b", fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    />
                    <Bar dataKey="percentage" radius={[10, 10, 0, 0]}>
                      {withoutHousingData.map((entry) => (
                        <Cell key={entry.outcome} fill={entry.barColor} />
                      ))}
                      <LabelList
                        dataKey="percentage"
                        position="top"
                        offset={8}
                        formatter={(value) => `${Number(value)}%`}
                        className="fill-[#1b2026] text-xs font-semibold"
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </article>

            <article className="rounded-3xl border border-black/10 bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
              <p className="text-lg font-semibold text-[#181c21] sm:text-xl">
                Individuals Released With Stable Housing
              </p>
              <div className="mt-4 h-96">
                <ChartContainer config={withHousingConfig}>
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                      data={withHousingData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={false}
                    >
                      <Cell fill="#C35252" />
                      <Cell fill="#456FA7" />
                    </Pie>
                    <ChartTooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
