var express = require('express')
var app = express()

app.use(express.static(__dirname));

app.get('/coupons', function (req, res) {
  res.sendFile(__dirname + '/coupons.html');
})

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.listen(3080, function () {
  console.log('App listening on port 3000!')
})
