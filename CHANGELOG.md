# @relayrunner/actions

## 1.0.0

### Major Changes

- e3bf509: First stable release. Use `relay.yml@v1` to get fixes and new features without breaking changes; the `v1` tag now moves with each 1.x release.

### Minor Changes

- 2b4f4ed: `relay.yml` takes a `boat` input, so RelayRunner can route a job to Boat.
- 2865dd4: `relay.yml` takes a `groundbox` input, so RelayRunner can route a job to Groundbox runners.
- e080181: `relay.yml` takes `depot`, `namespace`, `warpbuild`, `ubicloud` and `runs-on` inputs, so RelayRunner can route a job to those providers. Adds the `checks/lint` action.
- 0756b37: `relay.yml` takes a `lizard` input, so RelayRunner can route a job to Lizard runners.
- 9a6cf39: `relay.yml` takes `starsling`, `monkci`, `runloft`, `latchkey`, `berrybox`, `celesto` and `instabox` inputs, so RelayRunner can route a job to those runner clouds.
- e9e8c4e: `relay.yml` takes `os`, `arch` and `cpus` inputs, so a job can say what it needs and RelayRunner sizes a runner from every provider in the workspace's runner order.

## 1.0.0-beta.10

### Minor Changes

- e9e8c4e: `relay.yml` takes `os`, `arch` and `cpus` inputs, so a job can say what it needs and RelayRunner sizes a runner from every provider in the workspace's runner order.

## 1.0.0-beta.9

### Minor Changes

- 2865dd4: `relay.yml` takes a `groundbox` input, so RelayRunner can route a job to Groundbox runners.

## 1.0.0-beta.8

### Minor Changes

- 0756b37: `relay.yml` takes a `lizard` input, so RelayRunner can route a job to Lizard runners.

## 1.0.0-beta.7

### Minor Changes

- 9a6cf39: `relay.yml` takes `starsling`, `monkci`, `runloft`, `latchkey`, `berrybox`, `celesto` and `instabox` inputs, so RelayRunner can route a job to those runner clouds.

## 1.0.0-beta.6

### Minor Changes

- 2b4f4ed: `relay.yml` takes a `boat` input, so RelayRunner can route a job to Boat.

## 1.0.0-beta.5

### Minor Changes

- e080181: `relay.yml` takes `depot`, `namespace`, `warpbuild`, `ubicloud` and `runs-on` inputs, so RelayRunner can route a job to those providers. Adds the `checks/lint` action.
