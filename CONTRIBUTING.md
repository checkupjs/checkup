# Contributing

## Running the project

Clone the repository:

```
git clone https://github.com/checkupjs/checkup.git
```
Cd into that directory, and install dependencies (this will install all dependencies for all packages via yarn workspaces):
```
yarn
```
Build the project:
```
yarn build
```
Link the CLI package:
```
cd packages/cli && yarn link
```
Link the default plugin
```
cd packages/plugin-default && yarn link
```
**Note:** do this for any additional packages you want to use, such as plugin-default

### In the project you want to run Checkup in:

Add required dependencies to package.json:
```
  "devDependencies": {
    "@checkup/cli": "0.0.0",
    "@checkup/plugin-default": "0.0.0",
    ...
  }
```
Create a checkup config file (`.checkuprc`):
```
  {
    "plugins": [
      "@checkup/plugin-default"
    ],
    "tasks": {}
  }
```
Locally link dependencies:
```
yarn link @checkup/cli
yarn link @checkup/plugin-default
```
Execute Checkup in your project
```
checkup run
```

Running a specific Checkup task in your project
```
checkup run --task TASK_NAME
```

### Gotchas
- You will need to rerun `yarn link` if `node_modules` of `travis-web` get flushed, but otherwise the link should persist through changes made to checkup
- If you update types from `core`, or any other package consumed by other packages within checkup, you may need to restart your TS server so these changes propagate throughout the IDE
- You can also develop in `watch` mode (as documented in the `package.json`) by running `yarn build:watch`
- You can run checkup in debug mode by running `DEBUG='*' checkup`

## Debugging checkup's code
Add a debugger in `packages/cli/src/index.ts` and run the following in the linked project
```
node --inspect-brk $(which checkup)
```

## Debugging tests
You'll want to ensure you're navigating into the specific yarn workspace when debugging jest:
```
node --inspect-brk node_modules/.bin/jest --runInBand
```
