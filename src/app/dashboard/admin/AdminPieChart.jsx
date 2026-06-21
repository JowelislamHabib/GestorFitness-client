"use client";

import { Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminPieChart({ data, nameKey, dataKey, config }) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={60}
          strokeWidth={5}
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
