import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StackedBarChart = ({ data }) => {
  // Custom tooltip to show integer values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
          <p className="font-bold">{`Course: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${Math.round(entry.value)} hours`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    // 调整图表尺寸以更好地显示数据
    <div className="w-[500px] h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 100,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="course" 
            angle={-60}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: 'Hours', 
              angle: -90, 
              position: 'insideLeft' 
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: "10px" }}
          />
          <Bar dataKey="present" name="Present Hours" stackId="a" fill="#10B981" />
          <Bar dataKey="absent" name="Absent Hours" stackId="a" fill="#EF4444" />
          <Bar dataKey="absentWithPermission" name="Absent with Permission Hours" stackId="a" fill="#FBBF24" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;