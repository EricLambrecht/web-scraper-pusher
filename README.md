# web-scraper-pusher
A web scraper that reports it's results to a pusher channel

## Context
This is a Node.JS script / server that runs puppeteer inside a Heroku App. It checks for changes on web sites and sends the results to a Pusher Channel.

## Development
The whole setup is built with Heroku in mind.

So, first login:
```
heroku login
```

Create you app via:
```
heroku create [APPNAME]
```

Deploy:
```
git push heroku main
```

Test web scraper locally via (or the npm/yarn script `start:scraper`):
```
node web-scraper.js
```

Add scraper script to heroku's run config:
```
heroku run node web-scraper.js
```