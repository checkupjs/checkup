import React from 'react';
import { Box } from 'ink';
import { getComponents } from './components';

const Pretty = ({ data }: { data: string[] }) => {
  let components = getComponents();
  let list = data.map((componentName, index) => {
    let Component = components.get(componentName)!;
    return (
      <Box key={index}>
        <Component data="hello" />
      </Box>
    );
  });

  return <Box>{list}</Box>;
};

export default Pretty;
