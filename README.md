# RelayRunner GitHub Actions

Reusable workflows for [RelayRunner](https://github.com/relayrunner/relayrunner). RelayRunner sends each GitHub Actions job to the first runner in your workspace's runner order that can take it, such as one of your own machines when one is online and free, Blacksmith, or GitHub's hosted runners.

## Relay a job to a runner

Add a `relay` job that says which runners can run your job, then point the job at its output:

```yaml
jobs:
  relay:
    uses: relayrunner/actions/.github/workflows/relay.yml@v1
    with:
      machine: self-hosted    # any machine in your workspace
      github: ubuntu-latest   # or GitHub-hosted ubuntu-latest

  test:
    needs: relay
    runs-on: ${{ needs.relay.outputs.runner }}
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

The relay job doesn't use a runner or bill any minutes. RelayRunner answers it directly with a runner label, trying the runners in your workspace's runner order and skipping the ones the job didn't name. If none of them fits, the relay job fails with the reason and `test` doesn't start.

### Inputs

Give one input per runner provider the job can use. A provider you leave out is never used for this job, even if it's in your runner order.

| Input | Description |
| --- | --- |
| `machine` | Comma-separated labels a machine in your workspace must have, all of them. Every machine has `self-hosted`, so `machine: self-hosted` accepts any machine; narrow it with labels such as `macOS, ARM64`. Leave it out (or empty) if the job shouldn't run on your machines. |
| `github` | The GitHub-hosted runner label to use, such as `ubuntu-latest` or `macos-latest`. Leave it out if the job shouldn't run on GitHub-hosted runners. |
| `blacksmith` | The [Blacksmith](https://www.blacksmith.sh) runner label to use, such as `blacksmith-2vcpu-ubuntu-2404`. It must start with `blacksmith-`. Leave it out if the job shouldn't run on Blacksmith. |

```yaml
  relay:
    uses: relayrunner/actions/.github/workflows/relay.yml@v1
    with:
      machine: macOS, ARM64
      github: macos-latest
```

```yaml
  relay:
    uses: relayrunner/actions/.github/workflows/relay.yml@v1
    with:
      machine: self-hosted
      blacksmith: blacksmith-4vcpu-ubuntu-2404
      github: ubuntu-latest
```

### Outputs

| Output | Description |
| --- | --- |
| `runner` | The label to put in the next job's `runs-on`. |

### Requirements

- The [RelayRunner GitHub App](https://github.com/apps/relayrunner) is installed on the repository's owner and connected to a RelayRunner workspace.
- The repository's owner is an organization. RelayRunner registers the runner that answers the relay job in the organization's Default runner group.
- If your organization limits which actions and reusable workflows can run, allow `relayrunner/actions/*`.

### Good to know

- **One relay routes one job.** A machine's label can only be claimed by one job. If two jobs, or the legs of a matrix, share one relay's output, only the first runs and the rest stay queued. Give each job its own relay:

  ```yaml
  jobs:
    relay-build:
      uses: relayrunner/actions/.github/workflows/relay.yml@v1
      with:
        machine: self-hosted
        github: ubuntu-latest
    relay-test:
      uses: relayrunner/actions/.github/workflows/relay.yml@v1
      with:
        machine: self-hosted
        github: ubuntu-latest
    build:
      needs: relay-build
      runs-on: ${{ needs.relay-build.outputs.runner }}
      # ...
    test:
      needs: relay-test
      runs-on: ${{ needs.relay-test.outputs.runner }}
      # ...
  ```

- **Public repositories never run on your machines.** RelayRunner skips machines for a public repository's jobs, so give them a `github` label. Their relay job only runs if the Default runner group allows public repositories.
- **Blacksmith needs its own GitHub App.** RelayRunner only hands the job a Blacksmith label, so Blacksmith's GitHub App must be installed on the repository's owner. RelayRunner can't see Blacksmith's capacity, so a Blacksmith step always takes a job with a Blacksmith label, public repositories included.
- **The relay waits for RelayRunner.** If the App isn't installed, or RelayRunner can't be reached, the relay job stays queued until GitHub gives up on it, after 24 hours.
- **The relay appears as `relay / RelayRunner`** in your workflow run.

## Run a check without a runner

Some checks don't need a machine of yours at all. Put the check in its own job on `runs-on: relayrunner`, and RelayRunner answers it directly: the job passes or fails in seconds, with no runner and no billed minutes.

```yaml
on:
  pull_request:
    types: [opened, edited, synchronize, reopened]

jobs:
  pr-title:
    runs-on: relayrunner
    steps:
      - uses: relayrunner/actions/checks/pr-title@v1
```

| Check | What it does | Inputs |
| --- | --- | --- |
| `checks/pr-title` | Fails unless the pull request title is a [Conventional Commit](https://www.conventionalcommits.org/), such as `feat(api): add a check`. | `types`: comma-separated types the title may use. Defaults to `feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert`. |
| `checks/lint` | Runs linters on the commit (the pull request's head on `pull_request` events) and fails if any reports an error. Each tool also gets a `Lint / <tool>` check run with its problems as annotations. | `tools` (required): comma-separated linters, any of `oxlint`, `oxfmt`, `ruff`, `actionlint`, `zizmor`, `shellcheck` and `typos`. `paths`: comma-separated globs, such as `apps/**`; only problems in matching files count. |

### Lint on demand

`checks/lint` doesn't read the pull request, so it runs on any event. A `workflow_dispatch` workflow gives you a **Run workflow** button in the Actions tab that lints the branch you pick:

```yaml
on: workflow_dispatch

jobs:
  lint:
    runs-on: relayrunner
    steps:
      - uses: relayrunner/actions/checks/lint@v1
        with:
          tools: oxlint, oxfmt, actionlint
```

RelayRunner lints the commit in its own sandbox, with no internet access, and posts the check runs through the RelayRunner Checks GitHub App, so install that App on the repository as well. The job uses only its own inputs and ignores any lint list in `relayrunner.yml`. Lint is in preview: RelayRunner runs it only for organizations it has enabled, and fails the job with the reason otherwise.

- **Every step must be a check.** RelayRunner runs the job itself only when all of its steps are RelayRunner checks with plain (not `${{ }}`) inputs. Otherwise the job fails and says why, so move other steps to their own job.
- **It works on any runner.** Each check is also an ordinary action, so the same job runs on `ubuntu-latest` or your own runner if you point it there. There, `checks/lint` checks out the commit, installs the tools with `npx` and `pipx`, and reports problems as annotations on the job instead of check runs.
- **Keep the job name stable** if you make it a required check. The check appears under the job's name, as any job does.

## Versions

Use `@v1` to get fixes and new features without breaking changes, or pin a release tag or commit SHA. See [releases](https://github.com/relayrunner/actions/releases).
