const express = require('express');
const app = express();
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const mongoAddress = `mongodb+srv://goranbelanovic:21061986gb@cluster0.le1oivh.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoAddress)
    .then(() => console.log('Connected to the database'))
    .catch(err => console.log(err))

const user_schema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
})
const User = mongoose.model('users', user_schema);

app.use(express.json({
    type: ['text/plain'],
    limit: '50mb'
}));
/* app.use(express.urlencoded({extended: true})); */

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Expose-Headers","x-auth-token");
    res.setHeader("Access-Control-Allow-Headers","x-auth-token");
    /* res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); */
    next();
})
app.use(express.static('public'));

app.get('/test', auth, (req, res) => {
    return res.json('Odgovor pre returna');
})
app.post('/register', async (req, res) => {
    const name = req.body.name;
    const user_found = await User.findOne({name: name});
    console.log(user_found);
    const user = new User({name: name});
    try {
        await user.save();
        res.json('You are registered with name: ' + name);
    } catch(err) {
        console.log(err)
        res.json('There seems to be an error with name ' + name);
    }
    
})
app.post('/get_token', async (req, res) => {
    const name = req.body.name;
    const name_found = await User.findOne({name: name});
    if(name_found == null) return res.json('You need to be registered')
    const token = jwt.sign(name, config.get('jwtPrivateKey'));
    console.log(name_found)
    return res.header('x-auth-token', token).json(token)
})

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    console.log(token)
    if(token === 'null' /* || token === 'generic' */) return res.json('Token is missing!!!')
    const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
    const user = User.findOne({name: decodedToken});
    console.log(user)
    if(decodedToken) {
        next()
    }else{
        /* console.log(decodedToken); */
        return res.json('You are not registered')
    }
}

app.listen(5000, '127.0.0.1', () => console.log(`Server is listening on port ${5000}`))