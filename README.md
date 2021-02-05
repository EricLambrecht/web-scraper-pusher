# Change Detection Notification using Puppeteer and Pusher

A framework of web scrapers that search for changes and report their results to a pusher channel.

## Context

This repo contains a Node.JS-script (`src/main-task.js`) which checks for changes on web sites (using puppeteer scrapers) and sends the results to a [Pusher Channel](https://pusher.com/channels). Changes are detected using a Postgres DB as an intermediate storage.

Since I currently host it on [Heroku](https://heroku.com), this repo also contains some heroku specific config and documentation (and a small express server as a sort of health check) — I also use the [Heroku Postgres DB](https://www.heroku.com/postgres) and [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) (to run the script every 10 minutes). However, **Heroku is not needed** to run the script. It can run perfectly fine without it, i.e. locally, in Docker, or hosted on any other server as long as the environment system has the expected dependencies.

The only hard dependencies for the script are [Pusher](https://pusher.com/channels), [Node](https://nodejs.org/en/), [Puppeteer](https://pptr.dev/) (incl. Chromium/Chrome) and a [PostgreSQL](https://www.postgresql.org/) database. Pusher could be replaced with a similar service with little to no effort, though.

## Development

The project uses Typescript, NPM and prettier (it also contains some Heroku specific files).

### Build

Before execution, compile the sources into Javascript with

```bash
# via npm
npm run build

# if you installed Typescript locally you can use it directly
tsc

# there is also a watcher script for active development
npm run watch:ts
```

### Starting the script

After you compiled your Typescript sources into JS you can start the scraper task like so:

```bash
# via node...
node dist/main-task.js

# ...or via npm...
npm run start:scraper

# ...or if you want to execute it remotely on Heroku:
heroku run dist/main-task.js
```

### Architecture

The main entrypoint for the script is `src/main-task.ts`.

Upon execution it will connect to PostgreSQL and Pusher, run a series of scrapers (currently defined inline) and publish the detected changes (in a Pusher channel).

The scrapers are located in `src/scrapers`.

All scrapers must inherit from `ChangeScraper` in order for the main-script to properly execute the scraper.

Changes are detected by calculating a delta between the state in the database and the state during execution. This "state" is simply a `string` (called `ChangeDetectionValue`) which will be generated during execution and stored in the database after every run to prepare for the next iteration.

There is also a further abstraction called `ListChangeScraper` for scrapers that don't check for changes in single elements, but rather lists where multiple items could change, e.g. changes in an appartment search result list.

The only work that has to be done when implementing a new scraper is:

- leading Puppeteer to the element that is supposed to be inspected
- infering a `ChangeDetectionValue` string from it (used for comparison)
- optionally infering change "details" for the notification

### Environment Variables

The script needs some environment variables that have to be set locally (and where you host it, like on Heroku etc.).

| Name             | Description                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`   | A PostgreSQL connection string (shoulb be automatically set on Heroku), locally something like `postgres://user:pw@localhost/db....` |
| `PUSHER_APP_ID`  | App ID of your pusher app                                                                                                            |
| `PUSHER_CLUSTER` | Cluster of your pusher app                                                                                                           |
| `PUSHER_KEY`     | Key of you pusher app                                                                                                                |
| `PUSHER_SECRET`  | Secret of your pusher app                                                                                                            |

## Heroku Stuff

#### Creating the Heroku app

In your git repository run:

```bash
# if not already logged in
heroku login

# create the app
heroku create my-app-name
```

You'll also have to add the buildpacks `jontewks/puppeteer` and `heroku/nodejs` to your app. This can be done via CLI or in the App Settings (Heroku Dashboard Web UI).

```
heroku buildpacks:add jontewks/puppeteer
heroku buildpacks:add heroku/nodejs
```

For scraper persistence add the Postgres Add-On:

```
heroku addons:create heroku-postgresql:hobby-dev
```

**Note**: You will have to [install Postgress locally](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup), too! — well... — only if you want to run the code locally of course.

#### Deployments

```bash
git push heroku main
```

#### If you want to run the scrapers regularly on Heroku:

```bash
# install scheduler add-on
heroku addons:create scheduler:standard

# test one-off-dyno via (after code has been pushed to Heroku!)
heroku run node dist/main-task.js

# Open scheduler config
heroku addons:open scheduler
```

Select interval (like every 10 minutes) and add `node dist/main-task.js` in the scheduler config.
