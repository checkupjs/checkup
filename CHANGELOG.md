Version 9 of Highlight.js has reached EOL and is no longer supported.
Please upgrade or ask whatever dependency you are using to upgrade.
https://github.com/highlightjs/highlight.js/issues/2877

## v1.4.1 (2021-12-10)

#### :bug: Bug Fix
* `core`
  * [#1148](https://github.com/checkupjs/checkup/pull/1148) Skip unused dependency check to avoid depcheck open file spike ([@mikrostew](https://github.com/mikrostew))
  * [#1144](https://github.com/checkupjs/checkup/pull/1144) backwards incompatibility issue introduced in 1.4.0 ([@carakessler](https://github.com/carakessler))

#### :house: Internal
* `checkup-formatter-pretty`
  * [#1138](https://github.com/checkupjs/checkup/pull/1138) fix: Fixes v8 error thrown when running pretty formatter tests ([@scalvert](https://github.com/scalvert))

#### Committers: 3
- Michael Stewart ([@mikrostew](https://github.com/mikrostew))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)


## v1.4.0 (2021-11-16)

#### :rocket: Enhancement
* `checkup-plugin-javascript`, `cli`, `core`
  * [#1137](https://github.com/checkupjs/checkup/pull/1137) [enhancement] Adding non-fatal errors to tasks ([@carakessler](https://github.com/carakessler))
* `checkup-plugin-javascript`, `core`
  * [#1135](https://github.com/checkupjs/checkup/pull/1135) Adds valid-esm-package-task ([@scalvert](https://github.com/scalvert))

#### Committers: 2
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)


## v1.3.0 (2021-11-02)

#### :rocket: Enhancement
* `checkup-plugin-ember`, `core`
  * [#1130](https://github.com/checkupjs/checkup/pull/1130) Upgrades ember-template-lint to 3.11.0 ([@scalvert](https://github.com/scalvert))
* `checkup-formatter-pretty`, `core`
  * [#1128](https://github.com/checkupjs/checkup/pull/1128) Adds validation task base class and associated component ([@scalvert](https://github.com/scalvert))
* `checkup-plugin-ember`, `checkup-plugin-javascript`
  * [#1127](https://github.com/checkupjs/checkup/pull/1127) Adding ruleId into eslint and ember-template-lint disable tasks ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* `core`
  * [#1131](https://github.com/checkupjs/checkup/pull/1131) Removes @private jsdoc attribute ([@scalvert](https://github.com/scalvert))
  * [#1129](https://github.com/checkupjs/checkup/pull/1129) Fixes base-task jsdoc generating invalid syntax for docs (mdx) ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.2.0 (2021-10-26)

#### :rocket: Enhancement
* `checkup-plugin-ember`, `checkup-plugin-javascript`
  * [#1124](https://github.com/checkupjs/checkup/pull/1124) Adding ruleId into eslint and ember-template-lint summary tasks ([@scalvert](https://github.com/scalvert))
* `checkup-formatter-pretty`, `checkup-plugin-ember`, `core`
  * [#1123](https://github.com/checkupjs/checkup/pull/1123) Adding migration class to provide more API-based guidance for adding migrations ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation
* [#1125](https://github.com/checkupjs/checkup/pull/1125) Adding versioning policy ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.1.1 (2021-10-19)

#### :bug: Bug Fix
* `cli`, `core`
  * [#1122](https://github.com/checkupjs/checkup/pull/1122) [bugfix] Add cases to getPaths to prevent uncaught exception ([@carakessler](https://github.com/carakessler))

#### Committers: 1
- [@carakessler](https://github.com/carakessler)


## v1.1.0 (2021-10-08)

#### :rocket: Enhancement
* `checkup-formatter-pretty`, `checkup-plugin-ember`
  * [#1115](https://github.com/checkupjs/checkup/pull/1115) Adding support for declarative sorting in Migration component ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix
* `core`
  * [#1116](https://github.com/checkupjs/checkup/pull/1116) Fixing JavaScriptAnalyzer to handle esm. Adding tests ([@scalvert](https://github.com/scalvert))
  * [#1114](https://github.com/checkupjs/checkup/pull/1114) Fixing bug in ember-template-lint-analyzer ([@carakessler](https://github.com/carakessler))

#### Committers: 2
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)


## v1.0.3 (2021-09-30)

#### :bug: Bug Fix
* `core`
  * [#1113](https://github.com/checkupjs/checkup/pull/1113) Fixes bug in get-paths where subdir segments were truncated ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.0.2 (2021-09-29)

#### :bug: Bug Fix
* `checkup-formatter-pretty`
  * [#1112](https://github.com/checkupjs/checkup/pull/1112) Fixes Pretty formatter outputing empty results for all tasks ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.0.1 (2021-09-28)

#### :bug: Bug Fix
* `core`
  * [#1111](https://github.com/checkupjs/checkup/pull/1111) fix: Fixes lint result filtering to exclude exact match on global ([@scalvert](https://github.com/scalvert))

#### Committers: 1
- Steve Calvert ([@scalvert](https://github.com/scalvert))


## v1.0.0 (2021-09-27)

#### :boom: Breaking Change

- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#1108](https://github.com/checkupjs/checkup/pull/1108) Extracting rule metadata from addResult ([@scalvert](https://github.com/scalvert))
- `checkup-formatter-pretty`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#1077](https://github.com/checkupjs/checkup/pull/1077) Converts built-in LOC info to task ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`
  - [#1025](https://github.com/checkupjs/checkup/pull/1025) Converts all Tasks to use new addResult API ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`
  - [#1011](https://github.com/checkupjs/checkup/pull/1011) Standardizing output in tasks: ember-in-repo-addons-engines-task ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `plugin`, `test-helpers`
  - [#999](https://github.com/checkupjs/checkup/pull/999) Standardize analyzers ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`
  - [#997](https://github.com/checkupjs/checkup/pull/997) Part 2: Ensure results adhere to SARIF specifications ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `cli`, `core`, `test-helpers`
  - [#996](https://github.com/checkupjs/checkup/pull/996) Part 1: Ensure results adhere to SARIF specifications ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#963](https://github.com/checkupjs/checkup/pull/963) Adding support to pass in a config inline to checkup ([@carakessler](https://github.com/carakessler))
- `cli`, `core`, `test-helpers`
  - [#944](https://github.com/checkupjs/checkup/pull/944) Removing output-file from CheckupTaskRunner ([@carakessler](https://github.com/carakessler))
- `cli`, `core`
  - [#939](https://github.com/checkupjs/checkup/pull/939) Refactor format options to align more closely with formatters ([@carakessler](https://github.com/carakessler))
- `cli`, `core`, `test-helpers`
  - [#935](https://github.com/checkupjs/checkup/pull/935) Removes format from RunOptions to clean up Node API ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#934](https://github.com/checkupjs/checkup/pull/934) Rename reporters to formatters and associated types/code ([@scalvert](https://github.com/scalvert))
- `cli`, `test-helpers`
  - [#924](https://github.com/checkupjs/checkup/pull/924) Removes unused APIs ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#909](https://github.com/checkupjs/checkup/pull/909) Moving registration to index ([@scalvert](https://github.com/scalvert))
  - [#900](https://github.com/checkupjs/checkup/pull/900) Part 3 of moving off oclif to vanilla CLI ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-javascript`, `core`
  - [#903](https://github.com/checkupjs/checkup/pull/903) Include `filePath` as part of `ember-template-lint-parser`, update `ember-template-lint` ([@brendenpalmer](https://github.com/brendenpalmer))
- `checkup-plugin-javascript`, `cli`
  - [#895](https://github.com/checkupjs/checkup/pull/895) Part 2 of moving off oclif to vanilla CLI ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-javascript`, `cli`, `test-helpers`
  - [#891](https://github.com/checkupjs/checkup/pull/891) Part 1 of moving off oclif to vanilla CLI ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#887](https://github.com/checkupjs/checkup/pull/887) Merging info and migration commands ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`
  - [#853](https://github.com/checkupjs/checkup/pull/853) Phase 2: Adding new sub-command: migration ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#851](https://github.com/checkupjs/checkup/pull/851) Phase 1 - Commands refactor ([@scalvert](https://github.com/scalvert))

#### :lock: Security

- `checkup-plugin-javascript`, `cli`
  - [#1084](https://github.com/checkupjs/checkup/pull/1084) deps: Upgrading jest ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#1081](https://github.com/checkupjs/checkup/pull/1081) Upgrades yeoman dependencies to fix security issues ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement

- `cli`, `core`
  - [#1109](https://github.com/checkupjs/checkup/pull/1109) Allows formatters to be called using a short form ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#1107](https://github.com/checkupjs/checkup/pull/1107) Ensuring global execution defaults to local if present ([@scalvert](https://github.com/scalvert))
  - [#1104](https://github.com/checkupjs/checkup/pull/1104) Add export to @checkup/cli for writeResultFile ([@carakessler](https://github.com/carakessler))
- `checkup-formatter-pretty`, `checkup-plugin-ember`
  - [#1106](https://github.com/checkupjs/checkup/pull/1106) Add no-results-found sub component ([@zhanwang626](https://github.com/zhanwang626))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`
  - [#1069](https://github.com/checkupjs/checkup/pull/1069) Adds endLine/endColumn to result range ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `cli`, `core`
  - [#1060](https://github.com/checkupjs/checkup/pull/1060) Change other formatters to return strings ([@scalvert](https://github.com/scalvert))
- `checkup-formatter-pretty`, `cli`, `core`
  - [#1049](https://github.com/checkupjs/checkup/pull/1049) Update checkup-formatter-pretty to output string ([@zhanwang626](https://github.com/zhanwang626))
- `checkup-formatter-pretty`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#1041](https://github.com/checkupjs/checkup/pull/1041) Adding custom formatter package ([@scalvert](https://github.com/scalvert))
- `cli`, `core`, `test-helpers`
  - [#1021](https://github.com/checkupjs/checkup/pull/1021) Adds addResult API to base-task ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#1009](https://github.com/checkupjs/checkup/pull/1009) Allows for loading plugins from arbitrary directories using `--plugin-base-dir` ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`, `plugin`
  - [#1006](https://github.com/checkupjs/checkup/pull/1006) Adding handlebars analyzer ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#1003](https://github.com/checkupjs/checkup/pull/1003) Creates DependencyAnalyzer for use in multiple tasks ([@scalvert](https://github.com/scalvert))
- `core`
  - [#1001](https://github.com/checkupjs/checkup/pull/1001) Adds new analyzer: stylelint ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#963](https://github.com/checkupjs/checkup/pull/963) Adding support to pass in a config inline to checkup ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#961](https://github.com/checkupjs/checkup/pull/961) Adds ability to specify custom formatters ([@scalvert](https://github.com/scalvert))
- `core`
  - [#957](https://github.com/checkupjs/checkup/pull/957) Improve type definition for error kind map ([@evansolomon](https://github.com/evansolomon))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#941](https://github.com/checkupjs/checkup/pull/941) Adding functionality for pretty formatter to write to a file ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `plugin`, `test-helpers`
  - [#923](https://github.com/checkupjs/checkup/pull/923) Adding new checkup package to provide plugin utils. Generates docs ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#911](https://github.com/checkupjs/checkup/pull/911) Adds TaskError class to provide to task implementers ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-javascript`, `cli`
  - [#895](https://github.com/checkupjs/checkup/pull/895) Part 2 of moving off oclif to vanilla CLI ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#857](https://github.com/checkupjs/checkup/pull/857) Update generators to work with new commands ([@scalvert](https://github.com/scalvert))
  - [#851](https://github.com/checkupjs/checkup/pull/851) Phase 1 - Commands refactor ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`
  - [#853](https://github.com/checkupjs/checkup/pull/853) Phase 2: Adding new sub-command: migration ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `checkup-plugin-ember`, `core`
  - [#1110](https://github.com/checkupjs/checkup/pull/1110) Fixes errors in lint results causing incorrect data ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-javascript`, `cli`
  - [#1100](https://github.com/checkupjs/checkup/pull/1100) Fixes actions generator for JavaScript ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-javascript`
  - [#1101](https://github.com/checkupjs/checkup/pull/1101) [bugfix] Fixing URI in LOC task ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#1095](https://github.com/checkupjs/checkup/pull/1095) Remove commandType param from task generator ([@scalvert](https://github.com/scalvert))
  - [#1094](https://github.com/checkupjs/checkup/pull/1094) Fixes plugin generator not generating in custom subdirectory ([@scalvert](https://github.com/scalvert))
- `checkup-formatter-pretty`, `cli`
  - [#1074](https://github.com/checkupjs/checkup/pull/1074) Move pretty related tests to checkup-formatter-pretty ([@zhanwang626](https://github.com/zhanwang626))
- `cli`
  - [#1070](https://github.com/checkupjs/checkup/pull/1070) Add description to Task generator ([@scalvert](https://github.com/scalvert))
  - [#1046](https://github.com/checkupjs/checkup/pull/1046) Fixes task generator to output correct new Task format ([@scalvert](https://github.com/scalvert))
- `core`
  - [#1059](https://github.com/checkupjs/checkup/pull/1059) Rename stylelint analyzer and add public export. ([@oa495](https://github.com/oa495))
- Other
  - [#1045](https://github.com/checkupjs/checkup/pull/1045) Resolves type errors when building fresh master ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#986](https://github.com/checkupjs/checkup/pull/986) Fix checkup config resolution regression with cwd config paths. ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#956](https://github.com/checkupjs/checkup/pull/956) Fixes paths parsing to include multiple paths ([@scalvert](https://github.com/scalvert))
- `core`
  - [#955](https://github.com/checkupjs/checkup/pull/955) Fixes loop in ember-template-lint-parser ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#945](https://github.com/checkupjs/checkup/pull/945) Fixing bug in pretty formatter conditional ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#936](https://github.com/checkupjs/checkup/pull/936) Ensures that empty array values are treated as undefined for task runs ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#931](https://github.com/checkupjs/checkup/pull/931) Export reporter APIs ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#930](https://github.com/checkupjs/checkup/pull/930) Exporting task runner as public API ([@scalvert](https://github.com/scalvert))
  - [#926](https://github.com/checkupjs/checkup/pull/926) Correctly generates plugins with latest package versions ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#910](https://github.com/checkupjs/checkup/pull/910) Fixes CLI error handling by standardizing within the yargs handlers ([@scalvert](https://github.com/scalvert))
  - [#856](https://github.com/checkupjs/checkup/pull/856) [bugfix] Get paths updates ([@carakessler](https://github.com/carakessler))
- `core`
  - [#864](https://github.com/checkupjs/checkup/pull/864) Fixing task config overrides merging correctly ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#849](https://github.com/checkupjs/checkup/pull/849) Only conditionally show total results in verbose-reporter ([@carakessler](https://github.com/carakessler))

#### :memo: Documentation

- `core`
  - [#1099](https://github.com/checkupjs/checkup/pull/1099) Fixes invalid syntax for type output ([@scalvert](https://github.com/scalvert))
- `core`, `test-helpers`
  - [#1091](https://github.com/checkupjs/checkup/pull/1091) Adding jsdocs for test-helpers and core APIs. ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#1076](https://github.com/checkupjs/checkup/pull/1076) Add js doc for cli export contents ([@zhanwang626](https://github.com/zhanwang626))
- [#1080](https://github.com/checkupjs/checkup/pull/1080) Adding all-contributors ([@scalvert](https://github.com/scalvert))
- [#987](https://github.com/checkupjs/checkup/pull/987) Updates the README to clarify the value prop ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`
  - [#854](https://github.com/checkupjs/checkup/pull/854) Fix minor styling issues in plugin READMEs ([@tylerbecks](https://github.com/tylerbecks))

#### :house: Internal

- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `plugin`, `test-helpers`
  - [#1089](https://github.com/checkupjs/checkup/pull/1089) Sort all package.json files ([@scalvert](https://github.com/scalvert))
- `checkup-formatter-pretty`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`
  - [#1066](https://github.com/checkupjs/checkup/pull/1066) Pretty checkup tasks' output in checkup-formatter-pretty ([@zhanwang626](https://github.com/zhanwang626))
- `cli`
  - [#1071](https://github.com/checkupjs/checkup/pull/1071) Adding type to CLI options ([@scalvert](https://github.com/scalvert))
- `core`
  - [#1068](https://github.com/checkupjs/checkup/pull/1068) Project cleanup in preparation for 1.0 ([@scalvert](https://github.com/scalvert))
- Other
  - [#1067](https://github.com/checkupjs/checkup/pull/1067) Upgrades version of yarn via volta ([@scalvert](https://github.com/scalvert))
- `checkup-formatter-pretty`, `checkup-plugin-ember`, `checkup-plugin-javascript`
  - [#1064](https://github.com/checkupjs/checkup/pull/1064) Update list and bar component to render task result correctly. ([@zhanwang626](https://github.com/zhanwang626))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`
  - [#1061](https://github.com/checkupjs/checkup/pull/1061) Retrofit components ([@zhanwang626](https://github.com/zhanwang626))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#1017](https://github.com/checkupjs/checkup/pull/1017) Adding CheckupLogBuilder to taskContext ([@scalvert](https://github.com/scalvert))
- [#1000](https://github.com/checkupjs/checkup/pull/1000) Removes husky-install from prepare script ([@scalvert](https://github.com/scalvert))
- [#998](https://github.com/checkupjs/checkup/pull/998) Fixing husky ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`
  - [#983](https://github.com/checkupjs/checkup/pull/983) Adding @microsoft/jest-sarif for log/result validation ([@scalvert](https://github.com/scalvert))
- `core`
  - [#957](https://github.com/checkupjs/checkup/pull/957) Improve type definition for error kind map ([@evansolomon](https://github.com/evansolomon))
- `cli`, `core`, `test-helpers`
  - [#944](https://github.com/checkupjs/checkup/pull/944) Removing output-file from CheckupTaskRunner ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#943](https://github.com/checkupjs/checkup/pull/943) Renaming find to findTask to fix static analysis issue ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#940](https://github.com/checkupjs/checkup/pull/940) Pulling out cli-ux ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#929](https://github.com/checkupjs/checkup/pull/929) Removing all relics of oclif ([@carakessler](https://github.com/carakessler))
- Other
  - [#915](https://github.com/checkupjs/checkup/pull/915) Removes chai, which is unused ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#914](https://github.com/checkupjs/checkup/pull/914) Removes yeoman output in tests ([@scalvert](https://github.com/scalvert))
  - [#906](https://github.com/checkupjs/checkup/pull/906) Fixes verbose output when using generator utils in tests ([@scalvert](https://github.com/scalvert))
- `cli`, `test-helpers`
  - [#907](https://github.com/checkupjs/checkup/pull/907) Speeds up tests by using local link to @checkup/core in generated plugins ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-javascript`, `cli`, `test-helpers`
  - [#891](https://github.com/checkupjs/checkup/pull/891) Part 1 of moving off oclif to vanilla CLI ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#881](https://github.com/checkupjs/checkup/pull/881) Removing `output-map` from verbose-console-reporter ([@carakessler](https://github.com/carakessler))

#### :recycle: Generators

- `cli`
  - [#1070](https://github.com/checkupjs/checkup/pull/1070) Add description to Task generator ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Brenden Palmer ([@brendenpalmer](https://github.com/brendenpalmer))
- Chad Hietala ([@chadhietala](https://github.com/chadhietala))
- Evan Solomon ([@evansolomon](https://github.com/evansolomon))
- Omayeli Arenyeka ([@oa495](https://github.com/oa495))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- Tyler Becks ([@tylerbecks](https://github.com/tylerbecks))
- Zhan Wang ([@zhanwang626](https://github.com/zhanwang626))
- [@carakessler](https://github.com/carakessler)

## v0.13.2 (2021-01-14)

#### :rocket: Enhancement

- `checkup-plugin-ember-octane`, `core`
  - [#847](https://github.com/checkupjs/checkup/pull/847) Updates Octane migration task with better messages ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `cli`, `core`
  - [#848](https://github.com/checkupjs/checkup/pull/848) Filtering out eslint results that indicate a rule was not found ([@carakessler](https://github.com/carakessler))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.13.1 (2021-01-06)

#### :house: Internal

- `cli`, `core`
  - [#830](https://github.com/checkupjs/checkup/pull/830) Removing meta-task as a concept, moving logic from project-meta-task into get-log ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#829](https://github.com/checkupjs/checkup/pull/829) Removing `appendCheckupProperties` and doing it directly in the builders ([@carakessler](https://github.com/carakessler))

#### Committers: 1

- [@carakessler](https://github.com/carakessler)

## v0.13.0 (2021-01-05)

#### :rocket: Enhancement

- `checkup-plugin-ember-octane`, `core`
  - [#840](https://github.com/checkupjs/checkup/pull/840) Extend lint tasks with custom config ([@scalvert](https://github.com/scalvert))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.12.1 (2020-12-23)

#### :boom: Breaking Change

- `cli`, `core`, `test-helpers`
  - [#824](https://github.com/checkupjs/checkup/pull/824) Convert all flags to dasherized ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `checkup-plugin-javascript`, `cli`
  - [#822](https://github.com/checkupjs/checkup/pull/822) Fixes output to only include tasks that were executed. ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.12.0 (2020-12-07)

#### :boom: Breaking Change

- `cli`, `core`, `test-helpers`
  - [#807](https://github.com/checkupjs/checkup/pull/807) Converts current console output to use verbose flag, adds summarized output ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement

- `cli`, `core`, `test-helpers`
  - [#807](https://github.com/checkupjs/checkup/pull/807) Converts current console output to use verbose flag, adds summarized output ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `cli`
  - [#793](https://github.com/checkupjs/checkup/pull/793) Adding task to run ember-template-lint ([@carakessler](https://github.com/carakessler))

#### :bug: Bug Fix

- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#794](https://github.com/checkupjs/checkup/pull/794) Fixes warnings, lint issues, and adds a test to ensure config schema is reachable ([@scalvert](https://github.com/scalvert))

#### :bar_chart: Checkup Task

- `checkup-plugin-ember`, `cli`
  - [#793](https://github.com/checkupjs/checkup/pull/793) Adding task to run ember-template-lint ([@carakessler](https://github.com/carakessler))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.11.1 (2020-11-25)

#### :bug: Bug Fix

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#781](https://github.com/checkupjs/checkup/pull/781) Fixing SARIF log so that each location is mapped to one Result ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.11.0 (2020-11-20)

#### :rocket: Enhancement

- `cli`
  - [#780](https://github.com/checkupjs/checkup/pull/780) Exporting getReporters API in order to provide reporting for Node API ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.10.0 (2020-11-19)

#### :boom: Breaking Change

- `cli`
  - [#778](https://github.com/checkupjs/checkup/pull/778) Changes file extension of outputFile to sarif ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement

- `cli`
  - [#777](https://github.com/checkupjs/checkup/pull/777) Implements new node API to allow for programmatic invocation of Checkup ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.9.0 (2020-11-16)

#### :rocket: Enhancement

- `cli`, `core`
  - [#753](https://github.com/checkupjs/checkup/pull/753) Adding HTTP support for config loading ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `checkup-plugin-ember`, `cli`, `core`
  - [#771](https://github.com/checkupjs/checkup/pull/771) Moving consoleMessage to properties ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)

## v0.8.2 (2020-11-12)

#### :rocket: Enhancement

- `core`
  - [#752](https://github.com/checkupjs/checkup/pull/752) Exporting buildLintResultsFromEslintOrTemplateLint ([@carakessler](https://github.com/carakessler))

#### :bug: Bug Fix

- `core`
  - [#752](https://github.com/checkupjs/checkup/pull/752) Exporting buildLintResultsFromEslintOrTemplateLint ([@carakessler](https://github.com/carakessler))

#### Committers: 1

- [@carakessler](https://github.com/carakessler)

## v0.8.1 (2020-11-11)

#### :bug: Bug Fix

- `cli`, `core`
  - [#751](https://github.com/checkupjs/checkup/pull/751) Bug fixes ([@carakessler](https://github.com/carakessler))
- `core`
  - [#750](https://github.com/checkupjs/checkup/pull/750) Moving @types/sarif from devDeps to deps ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.8.0 (2020-11-11)

#### :boom: Breaking Change

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#723](https://github.com/checkupjs/checkup/pull/723) Migrating to SARIF Schema ([@carakessler](https://github.com/carakessler))

#### :rocket: Enhancement

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#723](https://github.com/checkupjs/checkup/pull/723) Migrating to SARIF Schema ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.7.4 (2020-09-21)

#### :rocket: Enhancement

- `cli`, `core`
  - [#704](https://github.com/checkupjs/checkup/pull/704) Extends error output to include stack traces ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `cli`
  - [#705](https://github.com/checkupjs/checkup/pull/705) Fixes node API to return stdout from runCommand ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.7.3 (2020-08-28)

#### :bug: Bug Fix

- `checkup-plugin-ember-octane`
  - [#669](https://github.com/checkupjs/checkup/pull/669) Bumping eslint-plugin-ember ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-javascript`, `cli`
  - [#657](https://github.com/checkupjs/checkup/pull/657) Fixing typos ([@carakessler](https://github.com/carakessler))

#### :house: Internal

- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#646](https://github.com/checkupjs/checkup/pull/646) First steps at standardizing console reporter - implementing SummaryResult reporters ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.7.2 (2020-08-20)

#### :house: Internal

- `cli`
  - [#655](https://github.com/checkupjs/checkup/pull/655) Ensuring errors render fullyQualifiedTaskNames ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)

## v0.7.1 (2020-08-19)

#### :bug: Bug Fix

- `checkup-plugin-javascript`
  - [#652](https://github.com/checkupjs/checkup/pull/652) Fixing missing dep in checkup-plugin-javascript ([@carakessler](https://github.com/carakessler))

#### Committers: 1

- [@carakessler](https://github.com/carakessler)

## v0.7.0 (2020-08-19)

#### :rocket: Enhancement

- `cli`, `core`
  - [#650](https://github.com/checkupjs/checkup/pull/650) Adding task timings ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `checkup-plugin-ember`
  - [#649](https://github.com/checkupjs/checkup/pull/649) Bug fix for ember-test-types-task ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)

## v0.6.1 (2020-08-17)

#### :bug: Bug Fix

- `checkup-plugin-javascript`
  - [#648](https://github.com/checkupjs/checkup/pull/648) [bugfix] Fixing eslint-summary task so it only lints files passed in ([@carakessler](https://github.com/carakessler))

#### :house: Internal

- `cli`, `core`
  - [#647](https://github.com/checkupjs/checkup/pull/647) Fixing checkup-result types and ensuring results use typed output ([@scalvert](https://github.com/scalvert))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)

## v0.6.0 (2020-08-17)

#### :house: Internal

- `cli`, `core`
  - [#645](https://github.com/checkupjs/checkup/pull/645) Prioritizing cli args for turning tasks on ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)

## v0.5.0 (2020-08-12)

#### :rocket: Enhancement

- `cli`
  - [#633](https://github.com/checkupjs/checkup/pull/633) Adding dependency on `--format json` for `outputFile` flag ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `core`
  - [#629](https://github.com/checkupjs/checkup/pull/629) Remove chalk.white from terminal output ([@carakessler](https://github.com/carakessler))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.4.0 (2020-08-10)

#### :rocket: Enhancement

- `cli`
  - [#628](https://github.com/checkupjs/checkup/pull/628) Adding actions generator ([@scalvert](https://github.com/scalvert))

#### :recycle: Generators

- `cli`
  - [#628](https://github.com/checkupjs/checkup/pull/628) Adding actions generator ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.3.2 (2020-08-09)

#### :bug: Bug Fix

- `cli`, `core`, `test-helpers`
  - [#617](https://github.com/checkupjs/checkup/pull/617) Updates --tasks flag back to --tasks, and allows multiple invocations ([@scalvert](https://github.com/scalvert))
- `core`
  - [#616](https://github.com/checkupjs/checkup/pull/616) Adding missing dependency ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.3.1 (2020-08-07)

#### :rocket: Enhancement

- `cli`
  - [#615](https://github.com/checkupjs/checkup/pull/615) task: Adding v8-compile-cache to speed up CLI perf ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.3.0 (2020-08-07)

#### :boom: Breaking Change

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#612](https://github.com/checkupjs/checkup/pull/612) Removal of meta property in favor of flat properties ([@scalvert](https://github.com/scalvert))
  - [#611](https://github.com/checkupjs/checkup/pull/611) Deleting all TaskResult classes ([@scalvert](https://github.com/scalvert))
  - [#608](https://github.com/checkupjs/checkup/pull/608) First pass at removing toConsole by creating a console reporter ([@scalvert](https://github.com/scalvert))
  - [#569](https://github.com/checkupjs/checkup/pull/569) Converting to new checkup schema format. ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#610](https://github.com/checkupjs/checkup/pull/610) Adding actions registration system to decouple from task results ([@scalvert](https://github.com/scalvert))
  - [#588](https://github.com/checkupjs/checkup/pull/588) Convert eslint summary to schema ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`
  - [#604](https://github.com/checkupjs/checkup/pull/604) Standardizing task names within plugins for consistency. ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#600](https://github.com/checkupjs/checkup/pull/600) Converting octane-migration-status task to schema ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#587](https://github.com/checkupjs/checkup/pull/587) Converting eslint-disable task to schema ([@scalvert](https://github.com/scalvert))
  - [#584](https://github.com/checkupjs/checkup/pull/584) Convert loc to schema ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `cli`, `core`
  - [#586](https://github.com/checkupjs/checkup/pull/586) Converting template-lint-disable task to schema ([@scalvert](https://github.com/scalvert))
  - [#583](https://github.com/checkupjs/checkup/pull/583) Convert ember test types to new schema ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`
  - [#573](https://github.com/checkupjs/checkup/pull/573) Updating outdated dependencies task to use new schema ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `core`, `test-helpers`
  - [#572](https://github.com/checkupjs/checkup/pull/572) Schema changes based on pairing session ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`, `test-helpers`
  - [#571](https://github.com/checkupjs/checkup/pull/571) Converting ember types task to schema ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`
  - [#570](https://github.com/checkupjs/checkup/pull/570) Converting in-repo task to schema ([@scalvert](https://github.com/scalvert))
- Other
  - [#559](https://github.com/checkupjs/checkup/pull/559) Adds result schema and corresponding types ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement

- `cli`
  - [#607](https://github.com/checkupjs/checkup/pull/607) Add linting to plugins generated by plugin generator ([@scalvert](https://github.com/scalvert))
- `cli`, `core`, `test-helpers`
  - [#605](https://github.com/checkupjs/checkup/pull/605) Adding `--listTasks` flag to list all available tasks to run ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-javascript`, `core`
  - [#602](https://github.com/checkupjs/checkup/pull/602) Updates eslint-summary output ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`
  - [#606](https://github.com/checkupjs/checkup/pull/606) Cleanup of task name standardization ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#585](https://github.com/checkupjs/checkup/pull/585) Remove unneeded dependencies ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#560](https://github.com/checkupjs/checkup/pull/560) Consolidate meta tasks ([@scalvert](https://github.com/scalvert))

#### :bar_chart: Checkup Task

- `checkup-plugin-javascript`, `core`
  - [#602](https://github.com/checkupjs/checkup/pull/602) Updates eslint-summary output ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.2.3 (2020-07-16)

#### :rocket: Enhancement

- `cli`, `core`, `test-helpers`
  - [#551](https://github.com/checkupjs/checkup/pull/551) Enhances config schema to correctly enforce task config ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.2.2 (2020-07-02)

#### :rocket: Enhancement

- `core`
  - [#532](https://github.com/checkupjs/checkup/pull/532) [enhancement] use Number.prototype.toLocaleString() for bar and sectionedBar ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### :house: Internal

- `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#529](https://github.com/checkupjs/checkup/pull/529) Simplifying actions into a more declarative API ([@scalvert](https://github.com/scalvert))

#### Committers: 2

- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.2.1 (2020-06-30)

#### :boom: Breaking Change

- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`
  - [#526](https://github.com/checkupjs/checkup/pull/526) Adds a specific type for a config value ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `checkup-plugin-ember`, `core`
  - [#524](https://github.com/checkupjs/checkup/pull/524) [tests] add tests and fixes sectionedBar calculations ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### Committers: 2

- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.2.0 (2020-06-28)

#### :boom: Breaking Change

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#521](https://github.com/checkupjs/checkup/pull/521) Adding strong types for register hooks arguments ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#520](https://github.com/checkupjs/checkup/pull/520) Refactors tasks to have correct isolation between Task and TaskResult classes ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement

- `cli`, `core`
  - [#519](https://github.com/checkupjs/checkup/pull/519) Adding count of files checkup operated on to the project-meta task ([@carakessler](https://github.com/carakessler))

#### :bug: Bug Fix

- `cli`, `core`
  - [#518](https://github.com/checkupjs/checkup/pull/518) Fixes generator error handling. Fix bug with short plugin names ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#520](https://github.com/checkupjs/checkup/pull/520) Refactors tasks to have correct isolation between Task and TaskResult classes ([@scalvert](https://github.com/scalvert))

#### :bar_chart: Checkup Task

- `cli`, `core`
  - [#519](https://github.com/checkupjs/checkup/pull/519) Adding count of files checkup operated on to the project-meta task ([@carakessler](https://github.com/carakessler))

#### :recycle: Generators

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#521](https://github.com/checkupjs/checkup/pull/521) Adding strong types for register hooks arguments ([@scalvert](https://github.com/scalvert))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)

## v0.1.3 (2020-06-24)

#### :rocket: Enhancement

- `core`
  - [#516](https://github.com/checkupjs/checkup/pull/516) Extending ember-template-lint config type definition ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `cli`
  - [#515](https://github.com/checkupjs/checkup/pull/515) Ensuring generators can generate into a specific path ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#517](https://github.com/checkupjs/checkup/pull/517) Bumping walksync and using new API to Closes [#473](https://github.com/checkupjs/checkup/issues/473) ([@carakessler](https://github.com/carakessler))

#### :bar_chart: Checkup Task

- `checkup-plugin-ember`, `checkup-plugin-javascript`
  - [#505](https://github.com/checkupjs/checkup/pull/505) Adding actions for eslint-summary task ([@carakessler](https://github.com/carakessler))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)

## v0.1.2 (2020-06-22)

#### :bug: Bug Fix

- `cli`
  - [#513](https://github.com/checkupjs/checkup/pull/513) Output correct generators list on missing generator ([@scalvert](https://github.com/scalvert))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.1.1 (2020-06-17)

#### :boom: Breaking Change

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#498](https://github.com/checkupjs/checkup/pull/498) Removing TaskType in favor of group ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement

- `checkup-plugin-ember`, `checkup-plugin-javascript`, `core`
  - [#499](https://github.com/checkupjs/checkup/pull/499) Adding actions for ember-test-types, template-lint, and outdated dependencies ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`, `test-helpers`
  - [#488](https://github.com/checkupjs/checkup/pull/488) Adding Actions to checkup ([@carakessler](https://github.com/carakessler))

#### :house: Internal

- `core`
  - [#500](https://github.com/checkupjs/checkup/pull/500) Removing 'on' option from task config because tasks are always on by default ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`, `core`
  - [#502](https://github.com/checkupjs/checkup/pull/502) Removing startcase library from checkup ([@carakessler](https://github.com/carakessler))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.1.0 (2020-06-10)

#### :rocket: Enhancement

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`, `core`
  - [#486](https://github.com/checkupjs/checkup/pull/486) Render the task category in stdout ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#487](https://github.com/checkupjs/checkup/pull/487) Externalizing programmatic invocation of checkup ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `checkup-plugin-javascript`, `cli`
  - [#472](https://github.com/checkupjs/checkup/pull/472) Creating checkup-plugin-javascript, and moving the eslint-disable and outdated-deps task into it ([@carakessler](https://github.com/carakessler))
- `cli`, `core`, `test-helpers`
  - [#466](https://github.com/checkupjs/checkup/pull/466) Adding field excludePaths to config, so consumers of checkup can add globs to be ignored ([@carakessler](https://github.com/carakessler))

#### :bug: Bug Fix

- `cli`, `core`
  - [#474](https://github.com/checkupjs/checkup/pull/474) (bug fix) Restricting file types for LOC class ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#470](https://github.com/checkupjs/checkup/pull/470) Changing wording on eslint disable task results ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`
  - [#465](https://github.com/checkupjs/checkup/pull/465) Sorting JSON results for ember-in-repo-addons-engines-task-test ([@carakessler](https://github.com/carakessler))

#### :house: Internal

- `cli`, `core`, `test-helpers`
  - [#471](https://github.com/checkupjs/checkup/pull/471) Bumping eslint-plugin-unicorn ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `cli`, `core`, `test-helpers`
  - [#467](https://github.com/checkupjs/checkup/pull/467) Creating FilePathsArray class that extends array and offers filtering functionality ([@carakessler](https://github.com/carakessler))

#### :bar_chart: Checkup Task

- `checkup-plugin-javascript`, `core`, `test-helpers`
  - [#453](https://github.com/checkupjs/checkup/pull/453) Adding task that runs eslint as configured in the app checkup is being run on ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`
  - [#469](https://github.com/checkupjs/checkup/pull/469) Adding task that checks how many times ember template-lint is disabled ([@carakessler](https://github.com/carakessler))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.14 (2020-05-29)

#### :rocket: Enhancement

- `cli`, `core`, `test-helpers`
  - [#448](https://github.com/checkupjs/checkup/pull/448) Gracefully handle errors in the CLI ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `cli`
  - [#404](https://github.com/checkupjs/checkup/pull/404) Changes `checkup run` to default to `checkup` (without `run`) ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `cli`, `core`
  - [#449](https://github.com/checkupjs/checkup/pull/449) Deleting unused code related to deprecated PDF/HTML functionality ([@scalvert](https://github.com/scalvert))
  - [#402](https://github.com/checkupjs/checkup/pull/402) Freezing task context to prevent mutation ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `cli`, `core`, `test-helpers`
  - [#430](https://github.com/checkupjs/checkup/pull/430) Adding paths to TaskContext and updating all tasks to use it ([@carakessler](https://github.com/carakessler))
- `cli`, `core`, `test-helpers`
  - [#429](https://github.com/checkupjs/checkup/pull/429) Removing cosmiconfig in favor of simpler structure. ([@scalvert](https://github.com/scalvert))
  - [#424](https://github.com/checkupjs/checkup/pull/424) Standardize flags ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `cli`, `core`, `test-helpers`
  - [#428](https://github.com/checkupjs/checkup/pull/428) Adding pkg: PackageJson to the TaskContext and updating all tasks to use it ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#403](https://github.com/checkupjs/checkup/pull/403) Add ability to specify location of output for meta tasks ([@scalvert](https://github.com/scalvert))

#### :bar_chart: Checkup Task

- `checkup-plugin-ember`, `cli`, `core`, `test-helpers`
  - [#386](https://github.com/checkupjs/checkup/pull/386) [task] - Ember test types ([@carakessler](https://github.com/carakessler))
  - [#387](https://github.com/checkupjs/checkup/pull/387) [task] - number of Ember engines and addons ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`, `cli`, `core`
  - [#379](https://github.com/checkupjs/checkup/pull/379) [task] TODOs ([@carakessler](https://github.com/carakessler))
- `cli`, `core`
  - [#401](https://github.com/checkupjs/checkup/pull/401) [task] Updates Outdated Dependency output to use barchart ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember`, `cli`, `test-helpers`
  - [#391](https://github.com/checkupjs/checkup/pull/391) [task] - Outdated Dependencies ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.13 (2020-05-07)

#### :bug: Bug Fix

- `cli`, `test-helpers`
  - [#354](https://github.com/checkupjs/checkup/pull/354) Fixing command tests ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#340](https://github.com/checkupjs/checkup/pull/340) Fixes plugin generator incorrectly generating TS for JavaScript ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation

- [#392](https://github.com/checkupjs/checkup/pull/392) Adding more labels for publishing ([@scalvert](https://github.com/scalvert))
- [#339](https://github.com/checkupjs/checkup/pull/339) Updating installation and contributing guidelines ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `cli`, `core`
  - [#373](https://github.com/checkupjs/checkup/pull/373) Part 3 of task context refactoring: Passing normalized plugin names to tasks ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#372](https://github.com/checkupjs/checkup/pull/372) Part 2 of task context refactoring ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `cli`, `core`, `test-helpers`
  - [#358](https://github.com/checkupjs/checkup/pull/358) Part 1 Refactoring tasks to include taskContext and task options ([@scalvert](https://github.com/scalvert))

#### :bar_chart: Checkup Task

- `checkup-plugin-ember`, `core`
  - [#378](https://github.com/checkupjs/checkup/pull/378) [task] Correctly summarizing output of ember tasks ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`
  - [#349](https://github.com/checkupjs/checkup/pull/349) [task] Adding in check to octane migration task for mixin usage ([@carakessler](https://github.com/carakessler))

#### :recycle: Generators

- `cli`
  - [#340](https://github.com/checkupjs/checkup/pull/340) Fixes plugin generator incorrectly generating TS for JavaScript ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.12 (2020-04-28)

#### :bug: Bug Fix

- `checkup-plugin-ember`
  - [#332](https://github.com/checkupjs/checkup/pull/332) Fixing output of check-plugin-ember dependency task ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `checkup-plugin-ember-octane`, `core`
  - [#333](https://github.com/checkupjs/checkup/pull/333) Updates output in octane task to be in bar format ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.0.11 (2020-04-28)

#### :house: Internal

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `cli`, `core`
  - [#330](https://github.com/checkupjs/checkup/pull/330) Renaming task result methods ([@scalvert](https://github.com/scalvert))

#### Committers: 2

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.10 (2020-04-27)

#### :bug: Bug Fix

- `checkup-plugin-ember-octane`, `core`
  - [#306](https://github.com/checkupjs/checkup/pull/306) Fixing missing dependencies in core ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `cli`, `core`
  - [#314](https://github.com/checkupjs/checkup/pull/314) Standardizing stdout output ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.9 (2020-04-21)

#### :house: Internal

- `cli`
  - [#296](https://github.com/checkupjs/checkup/pull/296) Updating package references ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.0.8 (2020-04-21)

#### :boom: Breaking Change

- `checkup-plugin-ember-octane`, `cli`, `plugin-ember-octane`, `plugin-ember`
  - [#278](https://github.com/checkupjs/checkup/pull/278) Renaming plugins to `checkup-*` ([@scalvert](https://github.com/scalvert))

#### :rocket: Enhancement

- `cli`
  - [#283](https://github.com/checkupjs/checkup/pull/283) Updating plugin generator to standardize plugin naming ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#280](https://github.com/checkupjs/checkup/pull/280) Cleanup of config generator ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `cli`
  - [#295](https://github.com/checkupjs/checkup/pull/295) Moving static external libraries out of src ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember`, `cli`
  - [#294](https://github.com/checkupjs/checkup/pull/294) Fixing misnamed packages ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation

- `cli`
  - [#268](https://github.com/checkupjs/checkup/pull/268) Cleaning up documentation ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `checkup-plugin-ember`, `cli`, `core`
  - [#292](https://github.com/checkupjs/checkup/pull/292) Backporting table tasks to return table data ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember-octane`, `checkup-plugin-ember`, `cli`, `core`, `test-helpers`
  - [#293](https://github.com/checkupjs/checkup/pull/293) Removing all relics of node 10 ([@carakessler](https://github.com/carakessler))
- `checkup-plugin-ember-octane`, `cli`, `core`, `plugin-ember`
  - [#281](https://github.com/checkupjs/checkup/pull/281) Modifying pdf hook to return array of values ([@carakessler](https://github.com/carakessler))
  - [#277](https://github.com/checkupjs/checkup/pull/277) Splitting out pdf results into sections ([@carakessler](https://github.com/carakessler))
- Other
  - [#282](https://github.com/checkupjs/checkup/pull/282) Removing node 10 from our CI test flow ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#276](https://github.com/checkupjs/checkup/pull/276) Cleaning up types in run command ([@scalvert](https://github.com/scalvert))
  - [#266](https://github.com/checkupjs/checkup/pull/266) Displaying results from meta tasks in the pdf ([@carakessler](https://github.com/carakessler))
  - [#267](https://github.com/checkupjs/checkup/pull/267) Adding tests for meta-task-list ([@scalvert](https://github.com/scalvert))
- `checkup-plugin-ember-octane`, `cli`, `plugin-ember-octane`, `plugin-ember`
  - [#278](https://github.com/checkupjs/checkup/pull/278) Renaming plugins to `checkup-*` ([@scalvert](https://github.com/scalvert))

#### Committers: 3

- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.7 (2020-04-16)

#### :rocket: Enhancement

- [#246](https://github.com/checkupjs/checkup/pull/246) Using volta to pin node && yarn versions ([@carakessler](https://github.com/carakessler))

#### :bug: Bug Fix

- `cli`
  - [#247](https://github.com/checkupjs/checkup/pull/247) Fixing `task` flag ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation

- [#252](https://github.com/checkupjs/checkup/pull/252) Adding badges to top-level readme ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `cli`, `core`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  - [#262](https://github.com/checkupjs/checkup/pull/262) Refactoring build to utilize typescript project references ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#257](https://github.com/checkupjs/checkup/pull/257) Modifying reporter results to use pdf hook ([@carakessler](https://github.com/carakessler))
  - [#222](https://github.com/checkupjs/checkup/pull/222) Implementing numerical-card ([@carakessler](https://github.com/carakessler))
- `cli`, `core`, `plugin-ember-octane`, `plugin-ember`
  - [#221](https://github.com/checkupjs/checkup/pull/221) Removing `undefined` from `ReportResultData`, and adding mock results to all existing tasks ([@carakessler](https://github.com/carakessler))
- `cli`, `core`, `test-helpers`
  - [#256](https://github.com/checkupjs/checkup/pull/256) Updating task ordering to sort by category then priority ([@scalvert](https://github.com/scalvert))
- `cli`, `core`, `parser-eslint`, `plugin-ember-octane`
  - [#251](https://github.com/checkupjs/checkup/pull/251) Extracting parsers to @checkup/core package ([@scalvert](https://github.com/scalvert))
- Other
  - [#250](https://github.com/checkupjs/checkup/pull/250) Use volta-cli/action for CI ([@rwjblue](https://github.com/rwjblue))
- `cli`, `core`, `parser-eslint`, `plugin-ember-octane`, `test-helpers`
  - [#245](https://github.com/checkupjs/checkup/pull/245) Adding --no-cache for jest tests to address test caching issues ([@scalvert](https://github.com/scalvert))
- `cli`, `core`
  - [#237](https://github.com/checkupjs/checkup/pull/237) Implementing table ([@carakessler](https://github.com/carakessler))

#### Committers: 4

- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.6 (2020-04-07)

#### :memo: Documentation

- `plugin-ember-octane`
  - [#218](https://github.com/checkupjs/checkup/pull/218) plugin-ember-octane: update docs ([@lbdm44](https://github.com/lbdm44))

#### :house: Internal

- `cli`, `core`, `plugin-ember-octane`, `plugin-ember`
  - [#220](https://github.com/checkupjs/checkup/pull/220) Removing Core category. Adding Recommendations and renaming Migration ([@scalvert](https://github.com/scalvert))
- `cli`, `core`, `parser-eslint`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  - [#219](https://github.com/checkupjs/checkup/pull/219) Adds debug package to provide useful debugging info for tasks ([@scalvert](https://github.com/scalvert))
  - [#217](https://github.com/checkupjs/checkup/pull/217) chore(deps) Bumping prettier ([@carakessler](https://github.com/carakessler))
- `cli`, `core`
  - [#210](https://github.com/checkupjs/checkup/pull/210) Adding report data infrastructure for generating HTML/PDF reports ([@carakessler](https://github.com/carakessler))

#### Committers: 4

- Lewis Miller ([@lbdm44](https://github.com/lbdm44))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.5 (2020-04-06)

#### :bug: Bug Fix

- `plugin-ember-octane`
  - [#207](https://github.com/checkupjs/checkup/pull/207) Move "babel-eslint" to deps for plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))

#### :memo: Documentation

- [#209](https://github.com/checkupjs/checkup/pull/209) updating contributing.md ([@LLisa717](https://github.com/LLisa717))

#### :house: Internal

- `plugin-ember-octane`
  - [#207](https://github.com/checkupjs/checkup/pull/207) Move "babel-eslint" to deps for plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))

#### Committers: 3

- Lewis Miller ([@lbdm44](https://github.com/lbdm44))
- Lisa Li ([@LLisa717](https://github.com/LLisa717))
- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.0.4 (2020-04-06)

#### :house: Internal

- `cli`, `core`, `parser-eslint`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  - [#206](https://github.com/checkupjs/checkup/pull/206) Updating scripts to ensure lib is cleaned before build ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.0.3 (2020-04-06)

#### :bug: Bug Fix

- `cli`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  - [#205](https://github.com/checkupjs/checkup/pull/205) Fixing hooks config paths to point to lib vs src ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `cli`
  - [#195](https://github.com/checkupjs/checkup/pull/195) Fixing checkup meta test to account for dynamic version ([@scalvert](https://github.com/scalvert))

#### Committers: 1

- Steve Calvert ([@scalvert](https://github.com/scalvert))

## v0.0.2 (2020-04-03)

#### :bug: Bug Fix

- `cli`, `core`
  - [#185](https://github.com/checkupjs/checkup/pull/185) Fixing missing deps in core ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#166](https://github.com/checkupjs/checkup/pull/166) Fixing checkup-meta-task's use of shorthash ([@scalvert](https://github.com/scalvert))
- `plugin-ember-octane`
  - [#163](https://github.com/checkupjs/checkup/pull/163) Fix NaN bugs in lint reports ([@lbdm44](https://github.com/lbdm44))

#### Committers: 4

- Lewis Miller ([@lbdm44](https://github.com/lbdm44))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v0.0.1 (2020-03-27)

#### :rocket: Enhancement

- `cli`, `core`
  - [#103](https://github.com/checkupjs/checkup/pull/103) Add Config Init Command ([@mahirshah](https://github.com/mahirshah))
  - [#80](https://github.com/checkupjs/checkup/pull/80) Add config flag to optionally pass explicit config path to cli ([@mahirshah](https://github.com/mahirshah))
  - [#60](https://github.com/checkupjs/checkup/pull/60) Refactor Checkup Configuration Loading ([@mahirshah](https://github.com/mahirshah))
  - [#53](https://github.com/checkupjs/checkup/pull/53) Add Validation to Checkup Config ([@mahirshah](https://github.com/mahirshah))
  - [#26](https://github.com/checkupjs/checkup/pull/26) feat(core): Add support for checkup config file ([@mahirshah](https://github.com/mahirshah))
- `cli`, `test-helpers`
  - [#127](https://github.com/checkupjs/checkup/pull/127) Adding plugin generator ([@scalvert](https://github.com/scalvert))
  - [#122](https://github.com/checkupjs/checkup/pull/122) Adding generate command ([@scalvert](https://github.com/scalvert))
- `plugin-ember-octane`
  - [#95](https://github.com/checkupjs/checkup/pull/95) ESLint console output ([@lbdm44](https://github.com/lbdm44))
  - [#86](https://github.com/checkupjs/checkup/pull/86) Output completion info to JSON ([@lbdm44](https://github.com/lbdm44))
- `cli`, `core`, `plugin-default`, `plugin-ember-octane`, `plugin-ember`
  - [#97](https://github.com/checkupjs/checkup/pull/97) Adding PDF function to task results ([@carakessler](https://github.com/carakessler))
- `cli`, `core`, `plugin-default`, `plugin-ember-octane`, `plugin-ember`, `test-helpers`
  - [#87](https://github.com/checkupjs/checkup/pull/87) PDF reporter ([@scalvert](https://github.com/scalvert))
- `cli`, `plugin-ember-octane`
  - [#83](https://github.com/checkupjs/checkup/pull/83) Create plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))
- `cli`, `core`, `plugin-default`, `plugin-ember`, `test-helpers`
  - [#57](https://github.com/checkupjs/checkup/pull/57) Task prioritization ([@scalvert](https://github.com/scalvert))
- `plugin-default`, `plugin-ember`, `test-helpers`
  - [#54](https://github.com/checkupjs/checkup/pull/54) Adds @checkup/plugin-default to output basic, generic project information. ([@scalvert](https://github.com/scalvert))
- `cli`, `core`, `plugin-ember`, `test-helpers`
  - [#30](https://github.com/checkupjs/checkup/pull/30) feat(core): Add Support for Plugins via Config File ([@mahirshah](https://github.com/mahirshah))
- `cli`, `core`, `plugin-ember`
  - [#29](https://github.com/checkupjs/checkup/pull/29) Adding taskName and friendlyTaskName to Task ([@scalvert](https://github.com/scalvert))
  - [#28](https://github.com/checkupjs/checkup/pull/28) Adding path argument to specify directory to run in ([@scalvert](https://github.com/scalvert))
- `cli`
  - [#27](https://github.com/checkupjs/checkup/pull/27) Refactors Checkup and CheckupCLI classes into one ([@scalvert](https://github.com/scalvert))

#### :bug: Bug Fix

- `cli`
  - [#94](https://github.com/checkupjs/checkup/pull/94) Fixing reportOutputPath to create directory if doesn't exist ([@scalvert](https://github.com/scalvert))

#### :memo: Documentation

- [#61](https://github.com/checkupjs/checkup/pull/61) Adding use cases and personas into the spec ([@carakessler](https://github.com/carakessler))
- [#62](https://github.com/checkupjs/checkup/pull/62) Adding workflow instructions ([@carakessler](https://github.com/carakessler))
- [#3](https://github.com/checkupjs/checkup/pull/3) Adding Checkup spec ([@scalvert](https://github.com/scalvert))

#### :house: Internal

- `plugin-ember-octane`
  - [#148](https://github.com/checkupjs/checkup/pull/148) Plugin Ember Octane: Refactor linting constructs into their own files/ ([@lbdm44](https://github.com/lbdm44))
  - [#140](https://github.com/checkupjs/checkup/pull/140) Refactor types for plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))
  - [#123](https://github.com/checkupjs/checkup/pull/123) Add template lint to plugin-ember-octane ([@lbdm44](https://github.com/lbdm44))
- `cli`, `core`, `plugin-default`, `plugin-ember-octane`, `plugin-ember`
  - [#106](https://github.com/checkupjs/checkup/pull/106) Add in card partial scaffolding ([@carakessler](https://github.com/carakessler))
- `cli`
  - [#110](https://github.com/checkupjs/checkup/pull/110) Increasing test timeout for test in @checkup/cli ([@carakessler](https://github.com/carakessler))
- `cli`, `core`
  - [#105](https://github.com/checkupjs/checkup/pull/105) Converts single command to multi ([@scalvert](https://github.com/scalvert))
  - [#60](https://github.com/checkupjs/checkup/pull/60) Refactor Checkup Configuration Loading ([@mahirshah](https://github.com/mahirshah))
- `cli`, `core`, `plugin-default`, `plugin-ember`, `test-helpers`
  - [#75](https://github.com/checkupjs/checkup/pull/75) Refactoring task registration to simplify ([@scalvert](https://github.com/scalvert))
  - [#55](https://github.com/checkupjs/checkup/pull/55) task(linting): Adding linting plugins to extend lint checks ([@scalvert](https://github.com/scalvert))
- `plugin-ember`, `test-helpers`
  - [#56](https://github.com/checkupjs/checkup/pull/56) Cleanup implementations of fixturify-project classes ([@scalvert](https://github.com/scalvert))
- `cli`, `core`, `parser-eslint`
  - [#48](https://github.com/checkupjs/checkup/pull/48) Adds @checkup/parser-eslint plugin package ([@scalvert](https://github.com/scalvert))
- `cli`, `core`, `plugin-ember`, `test-helpers`
  - [#43](https://github.com/checkupjs/checkup/pull/43) Add clean commands ([@lbdm44](https://github.com/lbdm44))
- Other
  - [#42](https://github.com/checkupjs/checkup/pull/42) Adding wsrun package to execute tasks in dependency order and parallel ([@scalvert](https://github.com/scalvert))
- `cli`, `plugin-ember`, `test-helpers`
  - [#32](https://github.com/checkupjs/checkup/pull/32) Adding @checkup/test-helpers package ([@scalvert](https://github.com/scalvert))

#### Committers: 6

- Lewis Miller ([@lbdm44](https://github.com/lbdm44))
- Lisa Li ([@LLisa717](https://github.com/LLisa717))
- Mahir Shah ([@mahirshah](https://github.com/mahirshah))
- Steve Calvert ([@scalvert](https://github.com/scalvert))
- [@carakessler](https://github.com/carakessler)
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)
