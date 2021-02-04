# Web Scraper for Pusher Channels
A web scraper that reports it's results to a pusher channel

## Context
This repo contains a Node.JS-script that runs puppeteer inside a Heroku App (and a small express server as a sort of health check). The script (`src/main-task.js`) checks for changes on web sites and sends the results to a Pusher Channel. Changes are detected using a Postgres DB (also on Heroku) as an intermediate storage.

## Development
The whole setup is built with Heroku in mind. It also uses Typescript.

When testing locally, compile the sources into Javascript with
```
# via npm
npm run build

# or, if you installed Typescript locally, simply:
tsc

# or use the watcher
npm run watch:ts
``` 

### Heroku Stuff

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

####  If you want to run the scrapers regularly on Heroku:
```bash
# install scheduler add-on
heroku addons:create scheduler:standard

# test one-off-dyno via (after code has been pushed to Heroku!)
heroku run node dist/main-task.js

# Open scheduler config
heroku addons:open scheduler
```

Add `node dist/main-task.js` in the scheduler config.

### Testing

After you compiled your Typescript sources into JS you can start the scraper task like so:

```bash
# via node...
node dist/main-task.js

# ...or via npm...
npm run start:scraper

# ...or if you want to execute it remotely on Heroku:
heroku run dist/main-task.js
```