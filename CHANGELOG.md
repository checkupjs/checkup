## v0.0.4 (2020-04-06)

#### :house: Internal
* `cli`, `core`, `parser-eslint`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  * [#206](https://github.com/checkupjs/checkup/pull/206) Updating scripts to ensure lib is cleaned before build ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v0.0.3 (2020-04-06)

#### :bug: Bug Fix
* `cli`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  * [#205](https://github.com/checkupjs/checkup/pull/205) Fixing hooks config paths to point to lib vs src ([@scalvert](https://github.com/scalvert))

#### :house: Internal
* `cli`
  * [#195](https://github.com/checkupjs/checkup/pull/195) Fixing checkup meta test to account for dynamic version ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v0.0.2 (2020-04-03)

#### :bug: Bug Fix
* `cli`, `core`
  * [#185](https://github.com/checkupjs/checkup/pull/185) Fixing missing deps in core ([@scalvert](https://github.com/scalvert))
* `cli`
  * [#166](https://github.com/checkupjs/checkup/pull/166) Fixing checkup-meta-task's use of shorthash ([@scalvert](https://github.com/scalvert))
* `plugin-ember-octane`
  * [#163](https://github.com/checkupjs/checkup/pull/163) Fix NaN bugs in lint reports ([@lbdm44](https://github.com/lbdm44))

#### Committers: 4
- Lewis Miller ([@lbdm44](https://github.com/lbdm44))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


## v0.0.1 (2020-03-27)

#### :rocket: Enhancement
* `cli`, `core`
  * [#103](https://github.com/checkupjs/checkup/pull/103) Add Config Init Command ([@mahirshah](https://github.com/mahirshah))
  * [#80](https://github.com/checkupjs/checkup/pull/80) Add config flag to optionally pass explicit config path to cli ([@mahirshah](https://github.com/mahirshah))
  * [#60](https://github.com/checkupjs/checkup/pull/60) Refactor Checkup Configuration Loading ([@mahirshah](https://github.com/mahirshah))
  * [#53](https://github.com/checkupjs/checkup/pull/53) Add Validation to Checkup Config ([@mahirshah](https://github.com/mahirshah))
  * [#26](https://github.com/checkupjs/checkup/pull/26) feat(core): Add support for checkup config file ([@mahirshah](https://github.com/mahirshah))
* `cli`, `test-helpers`
  * [#127](https://github.com/checkupjs/checkup/pull/127) Adding plugin generator ([@scalvert](https://github.com/scalvert))
  * [#122](https://github.com/checkupjs/checkup/pull/122) Adding generate command ([@scalvert](https://github.com/scalvert))
* `plugin-ember-octane`
  * [#95](https://github.com/checkupjs/checkup/pull/95) ESLint console output ([@lbdm44](https://github.com/lbdm44))
  * [#86](https://github.com/checkupjs/checkup/pull/86) Output completion info to JSON ([@lbdm44](https://github.com/lbdm44))
* `cli`, `core`, `plugin-default`, `plugin-ember-octane`, `plugin-ember`
  * [#97](https://github.com/checkupjs/checkup/pull/97) Adding PDF function to task results ([@carakessler](https://github.com/carakessler))
* `cli`, `core`, `plugin-default`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  * [#87](https://github.com/checkupjs/checkup/pull/87) PDF reporter ([@scalvert](https://github.com/scalvert))
* `cli`, `plugin-ember-octane`
  * [#83](https://github.com/checkupjs/checkup/pull/83) Create plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))
* `cli`, `core`, `plugin-default`, `plugin-ember`, `test-helpers`
  * [#57](https://github.com/checkupjs/checkup/pull/57) Task prioritization ([@scalvert](https://github.com/scalvert))
* `plugin-default`, `plugin-ember`, `test-helpers`
  * [#54](https://github.com/checkupjs/checkup/pull/54) Adds @checkup/plugin-default to output basic, generic project information. ([@scalvert](https://github.com/scalvert))
* `cli`, `core`, `plugin-ember`, `test-helpers`
  * [#30](https://github.com/checkupjs/checkup/pull/30) feat(core): Add Support for Plugins via Config File ([@mahirshah](https://github.com/mahirshah))
* `cli`, `core`, `plugin-ember`
  * [#29](https://github.com/checkupjs/checkup/pull/29) Adding taskName and friendlyTaskName to Task ([@scalvert](https://github.com/scalvert))
  * [#28](https://github.com/checkupjs/checkup/pull/28) Adding path argument to specify directory to run in ([@scalvert](https://github.com/scalvert))
* `cli`
  * [#27](https://github.com/checkupjs/checkup/pull/27) Refactors Checkup and CheckupCLI classes into one ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* `cli`
  * [#94](https://github.com/checkupjs/checkup/pull/94) Fixing reportOutputPath to create directory if doesn't exist ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#61](https://github.com/checkupjs/checkup/pull/61) Adding use cases and personas into the spec ([@carakessler](https://github.com/carakessler))
* [#62](https://github.com/checkupjs/checkup/pull/62) Adding workflow instructions ([@carakessler](https://github.com/carakessler))
* [#3](https://github.com/checkupjs/checkup/pull/3) Adding Checkup spec ([@scalvert](https://github.com/scalvert))

#### :house: Internal
* `plugin-ember-octane`
  * [#148](https://github.com/checkupjs/checkup/pull/148) Plugin Ember Octane: Refactor linting constructs into their own files/ ([@lbdm44](https://github.com/lbdm44))
  * [#140](https://github.com/checkupjs/checkup/pull/140) Refactor types for plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))
  * [#123](https://github.com/checkupjs/checkup/pull/123) Add template lint to plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))
* `cli`, `core`, `plugin-default`, `plugin-ember-octane`, `plugin-ember`
  * [#106](https://github.com/checkupjs/checkup/pull/106) Add in card partial scaffolding ([@carakessler](https://github.com/carakessler))
* `cli`
  * [#110](https://github.com/checkupjs/checkup/pull/110) Increasing test timeout for test in @checkup/cli ([@carakessler](https://github.com/carakessler))
* `cli`, `core`
  * [#105](https://github.com/checkupjs/checkup/pull/105) Converts single command to multi ([@scalvert](https://github.com/scalvert))
  * [#60](https://github.com/checkupjs/checkup/pull/60) Refactor Checkup Configuration Loading ([@mahirshah](https://github.com/mahirshah))
* `cli`, `core`, `plugin-default`, `plugin-ember`, `test-helpers`
  * [#75](https://github.com/checkupjs/checkup/pull/75) Refactoring task registration to simplify ([@scalvert](https://github.com/scalvert))
  * [#55](https://github.com/checkupjs/checkup/pull/55) task(linting): Adding linting plugins to extend lint checks ([@scalvert](https://github.com/scalvert))
* `plugin-ember`, `test-helpers`
  * [#56](https://github.com/checkupjs/checkup/pull/56) Cleanup implementations of fixturify-project classes ([@scalvert](https://github.com/scalvert))
* `cli`, `core`, `parser-eslint`
  * [#48](https://github.com/checkupjs/checkup/pull/48) Adds @checkup/parser-eslint plugin package ([@scalvert](https://github.com/scalvert))
* `cli`, `core`, `plugin-ember`, `test-helpers`
  * [#43](https://github.com/checkupjs/checkup/pull/43) Add clean commands ([@lbdm44](https://github.com/lbdm44))
* Other
  * [#42](https://github.com/checkupjs/checkup/pull/42) Adding wsrun package to execute tasks in dependency order and parallel ([@scalvert](https://github.com/scalvert))
* `cli`, `plugin-ember`, `test-helpers`
  * [#32](https://github.com/checkupjs/checkup/pull/32) Adding @checkup/test-helpers package ([@scalvert](https://github.com/scalvert))

#### Committers: 6
- Lewis Miller ([@lbdm44](https://github.com/lbdm44))
- Lisa Li ([@LLisa717](https://github.com/LLisa717))
- Mahir Shah ([@mahirshah](https://github.com/mahirshah))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)


