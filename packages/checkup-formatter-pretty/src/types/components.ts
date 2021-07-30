import { FC } from 'react';

type Scalar = string | number | boolean | null | undefined;

export type ScalarDict = {
  [key: string]: Scalar;
};

export type ComponentsMap = Record<string, FC<{ data: ScalarDict }>>;
