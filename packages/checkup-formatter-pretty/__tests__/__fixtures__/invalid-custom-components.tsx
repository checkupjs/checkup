import * as React from 'react';
import { FC } from 'react';
import { Text } from 'ink';

export const InvalidComponent: FC<{ data: any }> = ({ data }) => {
  return <Text>{data.properties.foo}</Text>;
};
