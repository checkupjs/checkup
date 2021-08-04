import React, { FC } from 'react';
import { Text } from 'ink';
import { BarData } from '../types';

export const Bar: FC<{ data: BarData }> = ({ data }) => {
  const barTick = '■';
  // 16777215 == ffffff in decimal
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  return (
    <Text color={randomColor}>
      {barTick.repeat(data.number)} {data.name} ({data.number})
    </Text>
  );
};
