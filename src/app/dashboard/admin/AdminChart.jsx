"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Registrations",
    color: "hsl(var(--primary))",
  },
};

export default function AdminChart({ data }) {
  const colors = [
    "fill-blue-500",
    "fill-cyan-500",
    "fill-emerald-500",
    "fill-lime-500",
    "fill-amber-500",
    "fill-orange-500",
    "fill-pink-500",
  ];

  return (
    <ChartContainer config={chartConfig} className="h-full w-full aspect-auto min-h-[250px]">
      <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={8}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} className={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
