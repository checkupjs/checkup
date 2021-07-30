import React, { FC } from 'react';
import { Box } from 'ink';
import { ScalarDict } from '../types/components';

export const Table: FC<{ data: ScalarDict }> = ({ data }) => {
  return <Box>{data}</Box>;
};
