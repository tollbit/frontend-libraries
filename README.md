# Tollbit Tiles Monorepo

Welcome to the official source of Tollbit Tile libraries! This repo contains packages to allow developers to interact with the Tollbit Tile system, write their own tiles, and integrate them into their own ChatBots.

This repo uses [Turborepo](https://turbo.build/repo) to manage its builds

## Table of Contents

- [@tollbit/react-integrate-tile](./packages/react-integrate/README.md)
- [@tollbit/core-integrate-tile](./packages/core-integrate/README.md)
- [@tollbit/create-tile](./packages/create/README.md)
- [@tollbit/client](./packages/client/README.md)

## Contributing

This repo uses [@changesets/cli](https://github.com/changesets/changesets/blob/main/packages/cli/README.md), [Turborepo](https://turbo.build/repo/docs), and NPM.

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

This repo uses the [@changesets/cli](https://github.com/changesets/changesets/blob/main/packages/cli/README.md) package to manage releases. When you are ready to push a PR, run

```bash
npm run changeset
```

Mark each relevant package that was changed and add a detailed changelog message. Once this is merged to main, all modified libraries will automatically have their version modified and have a new version published to NPM.
