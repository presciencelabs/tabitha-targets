# Targets API

Available at [https://targets.tabitha.bible](https://targets.tabitha.bible)

## API

`https://targets.tabitha.bible/English/John/1/1`

## Local development

`pnpm i`

### Running locally

#### 1. Load the database

Dump files can be found under the "Artifacts" section of the workflow runs of the databases repo:  https://github.com/presciencelabs/tabitha-databases/actions/workflows/deploy.yml

Running the following command will load the data locally:

`wrangler d1 execute <DB_NAME_FROM_WRANGLER_TOML_FILE> --file=<DB_NAME_FROM_WRANGLER_TOML_FILE>.tabitha.sqlite.sql`

#### 2. Start the app

> `pnpm build` will need to be run the first time only.

```bash
pnpm dev
```

The site should then be available here: [http://localhost.tabitha.bible:8788](http://localhost.tabitha.bible:8788)

## Static analysis

```bash
pnpm check
```
### Testing locally

> `pnpm exec playwright install` will need to be run at least once to get the headless browsers for testing.

```bash
pnpm test:e2e
```

🐛 debugging tests can be done with `pnpm test:e2e:dev`.

## Contributing

Always start your work in a new branch.

Run the following command as a last check before opening a PR

```bash
pnpm precommit
```
