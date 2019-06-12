var express = require('express');
var bodyParser = require('body-parser');
var ipfs = require('./ipfsService.js');
var mam = require('./mamService.js');
var express = require('express');
var multer = require('multer');
var upload = multer()
var TChallan = require('./models/TChallan');

var app = express();

mam.initialize();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//try http://localhost:4000/ipfs/get?ipfshash=QmTgC2pWbbAfZ5UpRYsLgi62qbcormwnA1QBH2jarFwJ8Z
app.get('/api/hello', async (req, res) => {
  res.status(200).json({ message: "hello" });
  t.is
});

//try http://localhost:4000/ipfs/get?ipfshash=QmRuDCUrEx3FTLLebdmC71TySwcXaWJCxzioWzoeSnHHSv
app.get('/ipfs/getimage', async (req, res) => {
  ipfs.get(req.query.ipfshash).then((result) => {
    var img = new Buffer(result[0].content, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  }).catch((err) => {
    res.status(500).json({ error: err.toString() })
  });
});
app.post('/ipfs/files', upload.array('ipfsfiles'), function (req, res, next) {
  req.files.forEach(file => {
    ipfs.addFile(req.body.platenum, req.file.buffer).then((result) => {
      res.status(200).json({ hash: result[0].hash });
    }).catch((err) => {
      res.status(500).json({ error: err.toString() })
    });
  });
});

app.post('/ipfs/file', upload.single('ipfsfile'), (req, res) => {
  let mamrec = new TChallan({
    date: Date.now(),
    platenum: req.body.platenum,
    ipfshash: result[0].hash,//'QmRuDCUrEx3FTLLebdmC71TySwcXaWJCxzioWzoeSnHHSv',//result[0].hash,
    geoLat: req.body.geoLat,
    geoLng: req.body.geoLng,
    description: "signal jump",
    isAppealed: false,
    applCmnts: "",
    isApplAprvd: false,
    isApplAprvCmnts: "",
    isPaid: false,
    payTransHash: ""
  });
  mam.publish(mamrec, true).then((result) => {
    //console.log(JSON.stringify(result));
    res.status(200).json({ iotaroot: result.mamMsg.root, ipfshash: result[0].hash/*'QmRuDCUrEx3FTLLebdmC71TySwcXaWJCxzioWzoeSnHHSv'*/ });
  }).catch((err) => {
    res.status(500).json({ error: err.toString() })
  });
});

app.get('/iota/channel/:root', (req, res) => {

  mam.fetch(req.params.root).then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    res.status(500).json({ error: err.toString() })
  });

});



app.post('/ipfs/add', async (req, res) => {
  ipfs.add(req.body.data).then((result) => {
    res.status(200).json({ hash: result[0].hash });
  }).catch((err) => {
    res.status(500).json({ error: err.toString() })
  });
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});