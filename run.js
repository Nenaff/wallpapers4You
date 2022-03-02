const express = require('express')
const app = express()
const port = 3000
const duck = require('duckduckgo-images-api');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.post('/search', (req, res) => {
  let query = req.body.q + " wallpaper pc";
  let count = req.body.count;

  

  duck.image_search({ query: query, moderate: true }).then(results=> {
    let json = [...new Set(results)];
    res.json(json.filter(e => e.width > e.height && e.width >= 1920 && e.height >= 1080).slice(0, 100).map(e => e.image))
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})