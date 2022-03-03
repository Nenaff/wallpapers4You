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
  let screen = req.body.screen;
  let query = req.body.q + " wallpaper " + screen;
  let count = req.body.count;

  console.log(query)

  duck.image_search({ query: query, moderate: true }).then(results=> {
    let json = [...new Set(results)];

    switch (screen) {
      case "mobile":
        json = json.filter(e => e.width < e.height && e.width >= 640 && e.height >= 960);
        break;
      case "pc":
        json = json.filter(e => e.width > e.height && e.width >= 1920 && e.height >= 1080);
        break;
    }

    res.json(json.slice(0, 100).map(e => e.image))
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})