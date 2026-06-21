"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Registrations",
    color: "hsl(var(--primary))",
  },
};

export default function AdminChart({ data }) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
