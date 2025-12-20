"use client";

import { useMemo } from "react";

interface DataPoint {
  year: number;
  buyNetPosition: number;
  rentNetPosition: number;
}

interface BreakEvenChartProps {
  data: DataPoint[];
  breakEvenYear: number;
  className?: string;
}

export function BreakEvenChart({ data, breakEvenYear, className = "" }: BreakEvenChartProps) {
  const chartConfig = useMemo(() => {
    if (data.length === 0) return null;

    // Chart dimensions
    const width = 600;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min/max values
    const allValues = data.flatMap((d) => [d.buyNetPosition, d.rentNetPosition]);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const valueRange = maxValue - minValue || 1;

    // Scale functions
    const xScale = (year: number) => padding.left + ((year - 1) / (data.length - 1)) * chartWidth;
    const yScale = (value: number) => padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

    // Generate path data
    const buyPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.buyNetPosition)}`).join(" ");
    const rentPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.rentNetPosition)}`).join(" ");

    // Zero line position
    const zeroY = yScale(0);

    // Y-axis ticks
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minValue + (valueRange / yTicks) * i);

    // X-axis ticks (every 5 years)
    const xTicks = data.filter((d) => d.year % 5 === 0 || d.year === 1 || d.year === data.length);

    return {
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
      buyPath,
      rentPath,
      zeroY,
      yTickValues,
      xTicks,
      xScale,
      yScale,
      minValue,
      maxValue,
    };
  }, [data]);

  if (!chartConfig || data.length === 0) {
    return null;
  }

  const { width, height, padding, buyPath, rentPath, zeroY, yTickValues, xTicks, xScale, yScale } = chartConfig;

  // Format value for display
  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}T`;
    }
    return `${(value / 1_000_000).toFixed(0)}Tr`;
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[400px]"
        role="img"
        aria-label="Biểu đồ so sánh vị thế mua và thuê theo năm"
      >
        {/* Grid lines */}
        <g className="text-white/10">
          {yTickValues.map((value, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={yScale(value)}
              x2={width - padding.right}
              y2={yScale(value)}
              stroke="currentColor"
              strokeDasharray="4 4"
            />
          ))}
        </g>

        {/* Zero line */}
        {chartConfig.minValue < 0 && chartConfig.maxValue > 0 && (
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
        )}

        {/* Break-even indicator */}
        {breakEvenYear > 0 && breakEvenYear <= data.length && (
          <>
            <line
              x1={xScale(breakEvenYear)}
              y1={padding.top}
              x2={xScale(breakEvenYear)}
              y2={height - padding.bottom}
              stroke="rgba(34, 211, 238, 0.5)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <circle
              cx={xScale(breakEvenYear)}
              cy={yScale(data[breakEvenYear - 1]?.buyNetPosition || 0)}
              r="6"
              fill="#22d3ee"
              className="animate-pulse"
            />
            <text
              x={xScale(breakEvenYear)}
              y={padding.top - 5}
              textAnchor="middle"
              className="fill-cyan-400 text-[10px] font-medium"
            >
              Hoà vốn
            </text>
          </>
        )}

        {/* Rent line (bottom layer) */}
        <path
          d={rentPath}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
        />

        {/* Buy line (top layer) */}
        <path
          d={buyPath}
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
        />

        {/* Data points - Buy */}
        {data.filter((_, i) => i % 5 === 0 || i === data.length - 1).map((d) => (
          <circle
            key={`buy-${d.year}`}
            cx={xScale(d.year)}
            cy={yScale(d.buyNetPosition)}
            r="4"
            fill="#34d399"
            className="drop-shadow"
          />
        ))}

        {/* Data points - Rent */}
        {data.filter((_, i) => i % 5 === 0 || i === data.length - 1).map((d) => (
          <circle
            key={`rent-${d.year}`}
            cx={xScale(d.year)}
            cy={yScale(d.rentNetPosition)}
            r="4"
            fill="#a78bfa"
            className="drop-shadow"
          />
        ))}

        {/* Y-axis labels */}
        <g className="text-white/50">
          {yTickValues.map((value, i) => (
            <text
              key={i}
              x={padding.left - 8}
              y={yScale(value) + 4}
              textAnchor="end"
              className="fill-current text-[10px]"
            >
              {formatValue(value)}
            </text>
          ))}
        </g>

        {/* X-axis labels */}
        <g className="text-white/50">
          {xTicks.map((d) => (
            <text
              key={d.year}
              x={xScale(d.year)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="fill-current text-[10px]"
            >
              {d.year}n
            </text>
          ))}
        </g>

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          className="fill-white/40 text-[11px]"
        >
          Năm
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="text-muted-foreground">Vị thế mua</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-400" />
          <span className="text-muted-foreground">Vị thế thuê + đầu tư</span>
        </div>
        {breakEvenYear > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-muted-foreground">Điểm hoà vốn (năm {breakEvenYear})</span>
          </div>
        )}
      </div>
    </div>
  );
}
