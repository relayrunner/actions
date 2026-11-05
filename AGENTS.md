# Repository instructions

This repo holds RelayRunner's public reusable workflows. Users reference them by path and tag, such as `relayrunner/actions/.github/workflows/relay.yml@v1`, so a workflow's inputs and outputs are a public API. Don't rename or remove an input or output within a major version. Pre-releases (`vX.Y.Z-beta.N`) may break, since nobody follows a major tag to them.

## Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit message and every pull request title, on a single line in the form `type(scope): description`, such as `feat(relay): add a count input`. Use one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`. Write the description in the imperative mood and in lowercase, with no trailing period. Mark a breaking change with `!`.

## Releases

Tag each release `vX.Y.Z` and move the major tag (`v1`) to it. Users follow the major tag, so a release must not break existing callers.

## Checks

CI runs [actionlint](https://github.com/rhysd/actionlint) on every workflow. The gateway itself lives in [relayrunner/relayrunner](https://github.com/relayrunner/relayrunner).
