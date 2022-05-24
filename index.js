var aws = require("aws-sdk");
var ses = new aws.SES({ region: "YOUR_SES_AWS_REGION" });

exports.handler = async function (event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 4));
    var message = event.Records[0].Sns.Message;
    var parsedMessage = {};
    try {
        parsedMessage = JSON.parse(message);
        console.log('parsedMessage:', parsedMessage);
    } catch (e) {
        console.error('Could not parse message as JSON! message:', message);
    }

    try {
        var rawMessage = parsedMessage?.message ?? 'No parsed message, so you get this instead: <3';
        var emailSubject = 'Hello world from your lambda';

    } catch (e) {
        console.error('Failed to initialize variables:', message);
        return;
    }

    var params = {
        Destination: {
            ToAddresses: ["YOUR_SES_VERIFIED_EMAIL_ADDRESS_TO_SEND_TO"],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: rawMessage
                },
                Text: {
                    Charset: "UTF-8",
                    Data: rawMessage
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: emailSubject
            }
        },
        Source: "YOUR_SES_VERIFIED_EMAIL_ADDRESS_TO_SEND_FROM",
    };

    var sendEmailPromise = ses.sendEmail(params).promise();
    sendEmailPromise.then(function (data) {
        console.log('Email Success!', data);
    }).catch(function (err) {
        console.log('Email failed', err);
    });
    return sendEmailPromise;
};
