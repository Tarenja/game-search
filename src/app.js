var express = require('express')
var app = express()

app.use(express.static('public'))

var server = app.listen(3000);
console.log('Example app listen on port 3000!')









