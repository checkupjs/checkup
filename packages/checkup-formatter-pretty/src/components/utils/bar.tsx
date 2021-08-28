import * as React from 'react';
import { Text } from 'ink';
import { BarData } from '../../types';

export const Bar: React.FC<{ data: BarData }> = ({ data }) => {
  const barTick = '■';
  // 16777215 == ffffff in decimal
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  const width: number = 50;

  const normalizeSegment = function (amount: number) {
    return Math.ceil(
      data.total < width ? amount * (width / data.total) : amount / (data.total / width)
    );
  };

  return (
    <Text color={randomColor}>
      {barTick.repeat(normalizeSegment(data.value))} {data.name} ({data.value})
    </Text>
  );
};
