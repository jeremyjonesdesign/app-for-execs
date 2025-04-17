import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';

interface ChartSegment {
  value: number;
  color: string;
  label?: string;
}

interface CircularChartProps {
  data: ChartSegment[];
  size: number;
  strokeWidth: number;
  innerRadius?: number;
  showLabels?: boolean;
}

export const CircularChart = ({
  data,
  size,
  strokeWidth,
  innerRadius = size * 0.6,
  showLabels = true,
}: CircularChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const total = data.reduce((sum, segment) => sum + segment.value, 0);

  // Calculate segments
  let segments = [];
  let startAngle = 0;

  for (const segment of data) {
    const percentage = segment.value / total;
    const angle = percentage * 360;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    // For arcs that are larger than 180 degrees
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
    
    segments.push({
      path: pathData,
      color: segment.color,
      startAngle,
      endAngle,
      percentage,
      label: segment.label || `${Math.round(percentage * 100)}%`,
    });
    
    startAngle = endAngle;
  }

  // For donut chart, calculate inner circle
  const donutPath = `
    M ${center - innerRadius} ${center}
    A ${innerRadius} ${innerRadius} 0 1 1 ${center + innerRadius} ${center}
    A ${innerRadius} ${innerRadius} 0 1 1 ${center - innerRadius} ${center}
  `;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {segments.map((segment, index) => (
            <Path
              key={index}
              d={segment.path}
              fill={segment.color}
              strokeWidth={1}
              stroke="#fff"
            />
          ))}
          {innerRadius > 0 && (
            <Path d={donutPath} fill="#fff" />
          )}
          
          {showLabels && segments.map((segment, index) => {
            const midAngle = (segment.startAngle + segment.endAngle) / 2;
            const midRad = (midAngle - 90) * (Math.PI / 180);
            const labelRadius = (radius + innerRadius) / 2;
            const x = center + labelRadius * Math.cos(midRad);
            const y = center + labelRadius * Math.sin(midRad);
            
            return segment.percentage > 0.05 ? (
              <SvgText
                key={`label-${index}`}
                x={x}
                y={y}
                fill="#000"
                fontSize={12}
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {segment.label}
              </SvgText>
            ) : null;
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 