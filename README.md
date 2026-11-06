# RelayRunner GitHub Actions

Reusable workflows for [RelayRunner](https://github.com/relayrunner/relayrunner). RelayRunner sends each GitHub Actions job to the first runner in your workspace's runner order that can take it, such as one of your own machines when one is online and free, or GitHub's hosted runners.

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

```yaml
  relay:
    uses: relayrunner/actions/.github/workflows/relay.yml@v1
    with:
      machine: macOS, ARM64
      github: macos-latest
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
- **The relay waits for RelayRunner.** If the App isn't installed, or RelayRunner can't be reached, the relay job stays queued until GitHub gives up on it, after 24 hours.
- **The relay appears as `relay / RelayRunner`** in your workflow run.

## Run a check without a runner

Some checks only read the pull request, so they don't need a machine at all. Put the check in its own job on `runs-on: relayrunner`, and RelayRunner answers it directly: the job passes or fails in a few seconds, with no runner and no billed minutes.

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

- **Every step must be a check.** RelayRunner runs the job itself only when all of its steps are RelayRunner checks with plain (not `${{ }}`) inputs. Otherwise the job fails and says why, so move other steps to their own job.
- **It works on any runner.** Each check is also an ordinary action, so the same job runs on `ubuntu-latest` or your own runner if you point it there.
- **Keep the job name stable** if you make it a required check. The check appears under the job's name, as any job does.

## Versions

Use `@v1` to get fixes and new features without breaking changes, or pin a release tag or commit SHA. See [releases](https://github.com/relayrunner/actions/releases).
