import express from 'express'
import path from 'path'
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.send('web scraper is alive'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))