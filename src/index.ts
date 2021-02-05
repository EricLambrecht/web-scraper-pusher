import express from 'express'
const PORT = process.env.PORT || 5000

express()
  .get('/', (req, res) => res.send('web scraper is alive'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
