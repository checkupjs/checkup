# Semantic Versioning Policy

Checkup follows the [Semantic Versioning](http://semver.org/) specification. However, due to the nature of Checkup as a code quality tool, it's not always clear when a minor or major version bump occurs. To help clarify this, we have a [Semantic Versioning Policy](VERSIONING_POLICY.md) that describes the rules for version bumps.

## Patch release (intended to not break your Checkup build)

- A bug fix that may reduce the results reported by Checkup.
- Changes to the SARIF log output format.
- A bug fix to the CLI or core.
- Improvements to documentation.
- Non-user-facing changes such as refactoring code, adding, deleting, or modifying tests, and increasing test coverage.
- Re-releasing after a failed release (i.e., publishing a release that doesn't work for anyone).

## Minor release (may break your Checkup build)

- A bug fix that may increase the results reported by Checkup.
- Changes to the SARIF log output format.
- The public API is changed in a compatible way.

## Major release (likely to break your Checkup build)

- A new CLI capability is created.
- New capabilities to the public API are added (new classes, new methods, new arguments to existing methods, etc.).
- Part of the public API is removed or changed in an incompatible way. The public API includes:
  - Configuration schema
  - Command-line options
  - Node.js API
  - Task, formatter, analyzer, plugin APIs

## Special Note about SARIF

Checkup natively uses the [SARIF specification](https://docs.oasis-open.org/sarif/sarif/v2.0/sarif-v2.0.html) for its output format. While the SARIF format uses both semantic and non-semantic properties, Checkup makes no guarantees about the semantic properties of the SARIF log, or whether they'll be preserved in future releases. Therefore, Checkup does not guarantee that the SARIF log will be compatible with future releases of Checkup - it only guarantees that valid SARIF logs will be produced.
