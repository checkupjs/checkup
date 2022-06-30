import * as React from 'react';
import { Text } from 'ink';

export const InvalidComponent: React.FC<{ data: any }> = ({ data }) => {
  return <Text>{data.properties.foo}</Text>;
};
