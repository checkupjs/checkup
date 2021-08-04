import * as React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import { render } from 'ink-testing-library';

import Pretty from '../src/pretty';

describe('dependencies-task', () => {
  it('can generate tsx', async () => {
    const { stdout } = render(<Pretty data={['table', 'list']} />);
    expect(stdout.lastFrame()).toMatchInlineSnapshot(`
      "
       [41m[37m ERROR [49m[39m data.map is not a function

       [2msrc/components/table.tsx:19:26[22m

       [2m16:[22m }
       [2m17:[22m
       [2m18:[22m export const Table: FC<{ data: any[] }> = ({ data }) => {
       [41m[37m19:[49m[39m[41m[37m   const tableData = data.map((item) => {[39m[49m
       [2m20:[22m     const result: Result = {
       [2m21:[22m       taskName: item.properties.taskDisplayName,
       [2m22:[22m       uri: item.locations[0].physicalLocation.artifactLocation.uri,

       [2m- [22m[1m[2mTable[22m[90m[2m (src/components/table.tsx:19:26)[22m[39m[1m
       [2m-[22m[1m[2mrenderWithHoo[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler.develop[22m[39m[1m
        [1m[2ms[22m[1m[22m            [22m[90m[2mment.js:6036:18)[22m[39m[1m
       [2m-[22m[1m[2mmountIndeterminateCom[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler[22m[39m[1m
        [1m[2monent[22m[1m[22m                [22m[90m[2m.development.js:8570:13)[22m[39m[1m
       [2m-[22m[1m[2mbeginWork$[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler.developmen[22m[39m[1m
                  [90m[2mt.js:9938:16)[22m[39m
       [2m-[22m[1m[2mObject.invokeGuardedCall[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconci[22m[39m[1m
        [1m[2mackImpl[22m[1m[22m                 [22m[90m[2mler.development.js:11563:10)[22m[39m[1m
       [2m-[22m[1m[2minvokeGuardedCall[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler.dev[22m[39m[1m
        [1m[2mack[22m[1m[22m              [22m[90m[2melopment.js:11740:31)[22m[39m[1m
       [2m-[22m[1m[2mbeginWork$$[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler.developme[22m[39m[1m
                   [90m[2mnt.js:15778:7)[22m[39m
       [2m-[22m[1m[2mperformUnitOfW[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler.develo[22m[39m[1m
        [1m[2mrk[22m[1m[22m            [22m[90m[2mpment.js:14696:12)[22m[39m[1m
       [2m-[22m[1m[2mworkLoopSyn[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler.developme[22m[39m[1m
                   [90m[2mnt.js:14669:22)[22m[39m
       [2m-[22m[1m[2mperformSyncWorkOn[22m[90m[2m (/Users/zhanwang/checkup/node_modules/react-reconciler/cjs/react-reconciler.dev[22m[39m[1m
        [1m[2moot[22m[1m[22m              [22m[90m[2melopment.js:14265:11)[22m[39m[1m
      "
    `);
  });
});
