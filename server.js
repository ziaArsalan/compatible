const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mailgun = require('mailgun-js')
const ejs = require('ejs')
var cors = require('cors');
const path = require("path")

require('dotenv').config();

const mg_neuro = mailgun ({
    apiKey: process.env.api_key,
    domain: process.env.domain
})


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


var port = process.env.PORT || 8080

app.post('/api/send_mail', async (req, res)=>{
    // var emails = ['mm@isystematic.com', 'ak@isystematic.com', 'eliza@cwsau.com.au', 'steve@cwsau.com.au', 'whitney@cwsau.com.au']
    var emails = ['mm@isystematic.com']
    // var emails = ['mm@isystematic.com', 'zia20isys@gmail.com']
    req.body.date = new Date().toDateString()
    req.body.mailTo = 'mm@isystematic.com'
    var errorMail = [];
    var emailBody;
    var data;

    var data = req.body
    
    // var keys =Object.keys(data)
    // keys.forEach(key => {
    //     if(key != 'mailTo' && key != 'server' && key != 'date'){
    //         data[key.substr(2)] = data[key]
    //         delete data[key]
    //     }
    // })

    ejs.renderFile('./views/email.ejs', {data: data }, function(err, str){
        if(str){
            emailBody = str;
        } else if(err){
            console.log(err);
        }
    })

    for(let email of emails) {
        data = {
            from:   req.body.email || req.body.Email,
            to:     email,
            subject:'Pet has been flagged',
            html:   emailBody,
        }

        function sendMessge() {
            return new Promise(resolve => {
                mg_neuro.messages().send(data, function (error, body) {
                    if(body){
                        console.log('Success Message', body);
                        resolve();
                    } else if (error) {
                        console.log('Error Message', error);
                        errorMail.push(email);
                        resolve();
                    }
                });
            });
        }
        await sendMessge();
    }

    // console.log('check', errorMail);
    // console.log(data);
    
    // res.render('email.ejs', {data: data})
    res.status(200).send({
        success: true,
        message: 'email successfully sent.',
        error_in_email: errorMail
    })
  
})

app.listen(port, function(){
    console.log('App is runing on port:' + port);
});