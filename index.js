const express = require('express')
const app = express()
const port = 4000
const path = require('path');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));
const downloadImagesController = require("./controllers/downloadImages.controller")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/downloadImages/index.html'));
})
app.post('/download-images', async (req, res) => {
  const result = await downloadImagesController.downloadImages(req)
  await downloadImagesController.zipFolder(result);
  res.send({ downloaded: result });
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})