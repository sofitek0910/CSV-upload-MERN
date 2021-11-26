import express from 'express'
import cors from 'cors'

const csv = require('csv-parser');
const fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
});

var upload = multer({ storage: storage }).single('file')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.send('This is from express.js')
})

var readCSV = function(filename) {
  var result = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream('./uploads/' + filename)
      .pipe(csv())
      .on('data', (row) => {
        
        console.log(row);
        result.push(row);
      })
      .on('end', (row) => {
        console.log('CSV file successfully processed');
        resolve(result);
      });
  });
}

app.post('/upload', function(req, res) {
  console.log(req)
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
    } else if (err) {
        return res.status(500).json(err)
    } else {
      readCSV(req.file.filename).then((data) => {
        return res.status(200).send(data);
      });
    }
  })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server started on port ${port}: http://localhost:${port}`)
})
