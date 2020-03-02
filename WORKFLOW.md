# How to contribute to checkup

## Getting the app running
1. Fork repo

2. Clone forked repo

3. `cd checkup` and run `yarn && yarn build`

4. `cd packages/cli && yarn link`
    - do this for any additional packages you want to link as well, for starters likely `plugin-default` as well

5. In a new terminal window, `cd travis-web` (or any other repo you want to run checkup on)

6. Add the following to travis-web/package.json

```
  "devDependencies": {
  +    "@checkup/cli": "0.0.0",
  +    "@checkup/plugin-default": "0.0.0",

```
7. Create a checkup config file in `travis-web` called `.checkuprc`. You can put all the tasks/plugins you want run here. For example:
```
  {
    "plugins": [
      "@checkup/plugin-default"
    ],
    "tasks": {}
  }
```
8. Inside `travis-web`, run `yarn link @checkup/cli && yarn link @checkup/plugin-default`

9. Thats it! Now, just run `checkup` (inside `travis-web`)

### Notes
- You will need to rerun `yarn link` if `node_modules` of `travis-web` get flushed, but otherwise the link should persist through changes made to checkup
- If you update types from `core`, or any other package consumed by other packages within checkup, you may need to restart your TS server so these changes propagate throughout the IDE
- You can also develop in `watch` mode (as documented in the `package.json`) by running `yarn build:watch`
- You can run checkup in debug mode by running `DEBUG='*' checkup`

## Creating a PR
1. Once you have a commit on a feature branch inside the repo that you are ready for feedback on, run `git push origin $branch_name`

2. Go into the github UI and create a pull request.

3. Add appropriate reviewers (likely at least @scalvert on all changes), and wait for reviews

4. Once reviews are given, merge into master


## Debugging
- To debug the app code, put a debugger in `packages/cli/src/index.ts` and then run `node --inspect-brk $(which checkup)` inside of `travis-web`. Inside chrome dev tools, you will see a little node icon pop up when the server is running. Click that, and step on through!
- To to debug tests inside specific package, put a debugger into the test, and then `cd` into that package and run `node --inspect-brk node_modules/.bin/jest --runInBand`
