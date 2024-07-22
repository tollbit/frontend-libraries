# Tollbit Tiles Monorepo

Welcome to the official source of Tollbit Tile libraries! This repo contains packages to allow developers to interact with the Tollbit Tile system, write their own tiles, and integrate them into their own ChatBots.

This repo uses [Turborepo](https://turbo.build/repo) to manage its builds

## Table of Contents

- [@tollbit/integrate-tile](./packages/integrate-tile/README.md)
- [@tollbit/create-tile](./packages/create-tile/README.md)

## Contributing

This repo uses [@changelog/cli](https://github.com/changesets/changesets/blob/main/packages/cli/README.md), [Turborepo](https://turbo.build/repo/docs), and NPM.

### Installiong

Run

```bash
npm install
```

To build all libraries, from root run

```bash
npm run build
```

### Releases

This repo uses the [@changelog/cli](https://github.com/changesets/changesets/blob/main/packages/cli/README.md) package to manage releases. When you are ready to push a PR, run

```bash
npm run changelog
```

and follow the prompts to update the changelog file with your changes. Once the changelog file has been updated, run

```bash
npm run version
```

This will go through and increment each package that should be deployed. Commit these changes and push them to your PR.
