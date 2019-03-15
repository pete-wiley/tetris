const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname)));
app.listen(process.env.PORT, function () {
    console.log('Server listening on port ' + port);
});