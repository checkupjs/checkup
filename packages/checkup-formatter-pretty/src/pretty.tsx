import * as React from 'react';
import { Box } from 'ink';
import { getComponents } from './components';

const Pretty = ({ data }: { data: string[] }) => {
  let components = getComponents();
  let list = data.map((componentName, index) => {
    let Component = components.get(componentName)!;

    <Box key={index}>{React.createElement(Component, { data })}</Box>;
  });

  return <Box>{list}</Box>;
};

export default Pretty;
