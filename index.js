const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser;
const express = require('express');

let inbox = [];

const server = new SMTPServer({
    onData(stream, session, callback) {
        parser(stream, {}, (err, parsed) => {
            if (err) {
                console.log("Error:", err)
                return;
            }

            let mail = {
                messageId: parsed.messageId,
                from: parsed.from.text,
                to: parsed.to.text,
                subject: parsed.subject,
                html: parsed.html,
            }

            inbox.push(mail);
            stream.on("end", callback)
        })
    },
    disabledCommands: ['AUTH']
});

server.listen(25, "0.0.0.0")

const app = express()

app.get('/inbox/:mail', function (req, res) {
    let find = inbox.filter(x => x.to == req.params.mail + "@nurislam.eu.org");
    if (find) {
        res.json(find);
    } else {
        res.send(":)");
    }
})

app.listen(80, function () {
    console.log('Sunucu çalışıyor...');
});