import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import dayjs from 'dayjs';
import type { WeightEntry } from '@/utils/types';
import { colors } from '@/utils/colors';

type Period = '1M' | '3M' | '6M' | '1Y' | 'all';

interface WeightChartProps {
  entries: WeightEntry[];
  period: Period;
}

const PERIOD_MONTHS: Record<Period, number | null> = {
  '1M': 1,
  '3M': 3,
  '6M': 6,
  '1Y': 12,
  all: null,
};

const WeightChart: React.FC<WeightChartProps> = ({ entries, period }) => {
  const filteredEntries = useMemo(() => {
    const months = PERIOD_MONTHS[period];
    const sorted = [...entries].sort(
      (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime(),
    );

    if (months === null) {
      return sorted;
    }

    const cutoff = dayjs().subtract(months, 'month').toDate().getTime();
    return sorted.filter((e) => new Date(e.measuredAt).getTime() >= cutoff);
  }, [entries, period]);

  const chartData = useMemo(() => {
    return filteredEntries.map((entry) => ({
      x: new Date(entry.measuredAt).getTime(),
      y: entry.weight,
    }));
  }, [filteredEntries]);

  if (chartData.length < 2) {
    return (
      <View className="h-[250px] items-center justify-center bg-gray-50 dark:bg-dark-surface rounded-xl">
        <Text className="text-sm text-muted dark:text-muted-dark text-center px-4">
          Add at least 2 entries to see the chart
        </Text>
      </View>
    );
  }

  return (
    <View style={{ height: 250 }}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={['y']}
        domainPadding={{ top: 20, bottom: 20, left: 10, right: 10 }}
      >
        {({ points }) => (
          <Line
            points={points.y}
            color={colors.primary[500]}
            strokeWidth={2.5}
            curveType="natural"
          />
        )}
      </CartesianChart>
    </View>
  );
};

export default React.memo(WeightChart);
