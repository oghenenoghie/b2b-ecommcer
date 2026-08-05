"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function RevenueByProductChart({ data }: { data: { title: string; unitsSold: number }[] }) {
  return (
    <div className="h-72 border border-line bg-paper p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="#E6E3DC" vertical={false} />
          <XAxis
            dataKey="title"
            tick={{ fontSize: 11, fill: "#6E6E6E" }}
            axisLine={{ stroke: "#E6E3DC" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#6E6E6E" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ border: "1px solid #0A0A0A", borderRadius: 2, fontSize: 12 }}
            cursor={{ fill: "#F5F3EE" }}
          />
          <Bar dataKey="unitsSold" fill="#0A0A0A" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
