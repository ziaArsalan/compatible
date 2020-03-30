const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
var cors = require('cors');
const path = require("path")
const routes = require('./routes/routes')

// Create Instance of express app-
const app = express()

// We want to serve JS and HTML in ejs
// ejs stand for Embedded JavaScript
app.set('view engine', 'ejs')

// We alos want to send CSS, images, favicon and other Static Files
app.use(express.static('views'))
app.set('views', __dirname + '/views')
app.use('/public', express.static(path.join(__dirname,'/public')))


// Give the Server Access to the User Input
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(logger('dev'))

// CORS Policy
app.use(cors());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Origin,Content-Type');
    next();
})

// Routes
app.use(routes)

var port = process.env.PORT || 8080

app.listen(port, function(){
    console.log('App is runing on port:' + port);
});