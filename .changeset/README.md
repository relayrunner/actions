# Changesets

Pending releases of this repo's workflows and actions.

## Adding a changeset

A PR that changes what callers of `relay.yml` or the `checks/*` actions get adds a file here:

```sh
pnpm changeset
```

Or write `.changeset/<slug>.md` by hand:

```md
---
"@relayrunner/actions": minor
---

What changed, written for someone who calls the workflow.
```

Use `patch` for fixes, `minor` for new inputs or features and `major` for breaking changes. Docs-only and CI-only PRs don't need one. `pnpm changeset:lint` (run in CI) rejects any other package name.

## Release flow

1. Merge PRs with changesets to `main`.
2. The **Release** workflow (`.github/workflows/release.yml`) opens or updates a `chore: version packages` PR that bumps `package.json` and writes `CHANGELOG.md`.
3. Merging that PR tags `v<version>` and creates a GitHub release. A stable release also moves the major tag (`v1`) to it.

Don't edit the `version` in `package.json` or push release tags by hand; the workflow owns them.

## Pre-releases

The repo is in beta pre-release mode (`pre.json`), so releases are `v1.0.0-beta.N` and `v1` doesn't move. To ship `v1.0.0`, run `pnpm changeset pre exit` in a PR. The next version PR after it releases `v1.0.0` and creates `v1`.
