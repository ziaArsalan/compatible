const ejs = require('ejs')
const mailgun = require('mailgun-js')
require('dotenv').config();


const mg = mailgun ({
    apiKey: process.env.api_key,
    domain: process.env.domain
})

module.exports = async (req, res) => {
    console.log('Trading Email');
    try {
        let emailBody
        const from = 'no-reply@competible.com.au'
        const requestData = req.body

        ejs.renderFile('./views/trading.ejs', {data: requestData }, function(err, str){
            if(str){
                emailBody = str;
            } else if(err){
                console.log(err);
            }
        })

        const mailData = {
            from:   from,
            to:     requestData.buyer_email,
            subject:'Pet Purchased',
            html:   emailBody,
        }

        await mg.messages().send(mailData, function(error, response){
            if(error){
                console.log(error);
                res.status(400).send({
                    success: false,
                    message: 'Unable to send email.',
                    error: error
                })
            } else {
                console.log(response);
                res.status(200).send({
                    success: true,
                    message: 'Email successfully sent.',
                    response
                })
            }
        })
        
    } catch (error) {
        console.log('Trading Mail - ERROR', error);
        res.status(400).send({
            success: false,
            messages: 'Unable to send email.'
        })
        
    }
    
}