const ejs = require('ejs')
const mailgun = require('mailgun-js')
require('dotenv').config();


const mg = mailgun ({
    apiKey: process.env.api_key,
    domain: process.env.domain
})

module.exports = async (req, res) => {
    // jkendall2011@hotmail.com
    // var emails = ['mm@isystematic.com']
    var emails = ['mm@isystematic.com', 'salmankhan@isystematic.com', 'ak@isystematic.com', 'jkendall2011@hotmail.com']
    req.body.date = new Date().toDateString()
    req.body.mailTo = 'mm@isystematic.com'
    var errorMail = [];
    var emailBody;
    var data;

    var data = req.body
    
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
                mg.messages().send(data, function (error, body) {
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
  
}