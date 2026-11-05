# RelayRunner GitHub Actions

Reusable workflows for [RelayRunner](https://github.com/relayrunner/relayrunner). RelayRunner sends your GitHub Actions jobs to one of your own machines when one is online and free, and to GitHub's hosted runners when not.

## Relay a job to a runner

Add a `relay` job, then point the job you want routed at its output:

```yaml
jobs:
  relay:
    uses: relayrunner/actions/.github/workflows/relay.yml@v1

  test:
    needs: relay
    runs-on: ${{ needs.relay.outputs.runner }}
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

The relay job doesn't use a runner or bill any minutes. RelayRunner answers it directly with a runner label: a free machine in your workspace, or the fallback when none is free.

### Inputs

| Input | Default | Description |
| --- | --- | --- |
| `fallback` | `ubuntu-latest` | The runner label to use when no machine is free. Any `runs-on` label works, including another runner provider's. |

```yaml
  relay:
    uses: relayrunner/actions/.github/workflows/relay.yml@v1
    with:
      fallback: ubuntu-24.04
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
    relay-test:
      uses: relayrunner/actions/.github/workflows/relay.yml@v1
    build:
      needs: relay-build
      runs-on: ${{ needs.relay-build.outputs.runner }}
      # ...
    test:
      needs: relay-test
      runs-on: ${{ needs.relay-test.outputs.runner }}
      # ...
  ```

- **Public repositories always get the fallback.** RelayRunner never sends a public repository's jobs to your machines. Their relay job only runs if the Default runner group allows public repositories.
- **The relay waits for RelayRunner.** If the App isn't installed, or RelayRunner can't be reached, the relay job stays queued until GitHub gives up on it, after 24 hours.
- **The relay appears as `relay / RelayRunner`** in your workflow run.

## Versions

Use `@v1` to get fixes and new features without breaking changes, or pin a release tag or commit SHA. See [releases](https://github.com/relayrunner/actions/releases).
