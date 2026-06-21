"use client";

import { Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminPieChart({ data, nameKey, dataKey, config }) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <PieChart>
        <defs>
          <filter id="glass-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
          </filter>
        </defs>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={0}
          stroke="none"
          filter="url(#glass-shadow)"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} className={entry.className} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
