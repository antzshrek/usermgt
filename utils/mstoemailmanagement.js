var rp = require('request-promise'),
    emailmanagement = process.env.EMAILMANAGEMENT,
    sendgridAPI = process.env.SENDGRIDKEY;


exports.sendMail = (emailBody) =>
{
    var personalizations = {
                            "personalizations": [{"to": [{"email": emailBody.to}]}],
                            "from" : {"email": "example@example.com", "name": emailBody.from},
                            "subject":emailBody.subject,
                            "content": [{"type": "text/plain", "value": emailBody.content}],
                           
    };

    let options = {
        method: 'POST',
        headers: {
       "Content-Type": "application/json",
        "Authorization": "Bearer " + sendgridAPI
    	},
        uri:emailmanagement,
        body: personalizations,
        json:true
    };
    
    return rp(options);
};
