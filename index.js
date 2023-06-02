const express = require('express');
const app = express();
const config = require('config');
const jwt = require('jsonwebtoken');

console.log(config.get('type_of_environment'));
/* console.log(app.get('NODE_ENV'));
console.log(process.env.NODE_ENV); */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
app.use(express.static('public'));


app.get('/test', (req, res) => {
    return res.json('Odgovor pre returna');
})

app.listen(5000, '127.0.0.1', () => console.log(`Server is listening on port ${5000}`))