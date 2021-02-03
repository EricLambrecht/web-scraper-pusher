# Web Scraper for Pusher Channels
A web scraper that reports it's results to a pusher channel

## Context
This is a Node.JS script / server that runs puppeteer inside a Heroku App. It checks for changes on web sites and sends the results to a Pusher Channel.

## Development
The whole setup is built with Heroku in mind.

### Heroku Stuff

#### Creating the Heroku app
In your git repository run:

```bash
# if not already logged in
heroku login

# create the app
heroku create my-app-name
```

You'll also have to add the buildpacks `jontewks/puppeteer` and `heroku/nodejs` to your app. This can be done via CLI (`heroku buildpacks:add $NAME$`) or in the App Settings (Heroku Dashboard Web UI).

#### Deployments
```bash
git push heroku main
```

####  If you want to run the scrapers regularly on Heroku:
```bash
# install scheduler add-on
heroku addons:create scheduler:standard

# test one-off-dyno via
heroku run node web-scraper.js

# add the task above in scheduler config
heroku addons:open scheduler
```

### Testing

Run the npm/yarn script `start:scraper` or type:

```bash
node web-scraper.js
```